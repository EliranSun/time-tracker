import { useEffect, useState } from "react";
import { ChartBar } from "@phosphor-icons/react";
import { addDoc, collection, updateDoc, setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "./App";
import classNames from "classnames";
import { useOrientation } from 'react-use';
import { useActivityData } from "./hooks/useActivityData";
import { addDays, intervalToDuration, isSameDay, startOfWeek } from "date-fns";

const addActivityData = async (activity) => {
    return await addDoc(collection(db, `activities/${activity.name}/data`), activity);
};

const updateActivityData = async (ref, activity) => {
    return await updateDoc(ref, activity);
}

const setCurrentActivityDoc = async (activity) => {
    return await setDoc(doc(db, 'currentActivity', 'activity'), activity);
};

const getCurrentActivityDoc = () => {
    return getDoc(doc(db, 'currentActivity', 'activity'));
};

const Block = ({ children, className, ...rest }) => {
    return (
        <div
            className={classNames("w-full text-white flex flex-col items-center justify-center", className)}
            {...rest}>
            {children}
        </div>
    )
}

export const ActivitiesView = ({ onChangePage, activities = [] }) => {
    const orientationState = useOrientation();
    const [lastDocumentRef, setLastDocumentRef] = useState(null);
    const [currentActivity, setCurrentActivity] = useState({});
    const [counter, setCounter] = useState(0);
    const activitiesData = useActivityData(activities.map(activity => activity.name));
    console.log({ activitiesData });

    useEffect(() => {
        if (currentActivity.name) {
            // setCounter(0);

            const interval = setInterval(() => {
                setCounter(prev => {
                    console.log({ prevCounter: prev });
                    return prev + 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [currentActivity.name]);

    useEffect(() => {
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'hidden') {
                localStorage.setItem('timeElapsed', new Date().getTime().toString());
            } else if (document.visibilityState === 'visible') {
                if (localStorage.getItem('timeElapsed')) {
                    const timeElapsed = new Date().getTime() - parseInt(localStorage.getItem('timeElapsed'));
                    setCounter(prev => prev + Math.floor(timeElapsed / 1000));
                    localStorage.removeItem('timeElapsed');
                }
            }
        });
    }, []);

    useEffect(() => {
        getCurrentActivityDoc().then((doc) => {
            if (doc.exists()) {
                const data = doc.data();
                console.log({ data });
                if (!data.start) {
                    return;
                }

                setCurrentActivity(data);
                debugger;
                setCounter(Math.floor((new Date().getTime() - data.start) / 1000));
            }
        }).catch(error => {
            console.error("Error getting document:", error);
        })

        const counter = localStorage.getItem('counter');

        if (counter && parseInt(counter) > 0) {
            setCounter(parseInt(counter));
        }
    }, []);

    useEffect(() => {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntriesByType("navigation");
            entries.forEach((entry) => {
                if (entry.type === 'reload') {
                    localStorage.setItem('counter', counter.toString());
                    setCurrentActivity(prev => {
                        setCurrentActivityDoc(prev);
                        return prev;
                    })
                }
            });
        });

        observer.observe({ type: "navigation", buffered: true });
    }, []);

    useEffect(() => {
        setCurrentActivity({});
        setCounter(0);
    }, [orientationState]);

    const getLastSession = (name) => {
        if (!name || !activitiesData[name]) {
            return "";
        }

        const start = activitiesData[name].at(-1)?.start;
        const end = activitiesData[name].at(-1)?.end;

        if (!start || !end) {
            return "";
        }

        const duration = end - start;
        const minutes = Math.floor(duration / 60000);
        const seconds = ((duration % 60000) / 1000).toFixed(0);

        return `Last session: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const getLastWeekData = (name, data) => {
        const activityData = data[name];
        const week = [{
            name: "Sunday",
        }, {
            name: "Monday",
        }, {
            name: "Tuesday",
        }, {
            name: "Wednesday",
        }, {
            name: "Thursday",
        }, {
            name: "Friday",
        }, {
            name: "Saturday",
        }];

        if (!name || !data || !activityData) {
            return week;
        }


        return week.map((day, index) => {
            const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
            const targetDay = addDays(weekStart, index);
            const dayData = activityData.filter(item => isSameDay(new Date(item.start), targetDay));

            const duration = intervalToDuration({
                start: dayData[0]?.start,
                end: dayData[dayData.length - 1]?.end
            });

            return {
                ...day,
                duration: [duration.hours && `${duration.hours}h`, `${duration.minutes || 0}m`].filter(Boolean).join(" "),
            }
        });
    }

    return (
        <div className="h-screen w-screen flex flex-wrap gap-1">
            {activities.filter(item => item.orientationAngle === orientationState.angle).map((activity, index) => {
                const Icon = activity.icon || (() => null);
                return (
                    <Block
                        key={activity.name}
                        style={{
                            backgroundColor: currentActivity.name === activity.name ? `${activity.color}` : "",
                        }}
                        onMouseDown={async () => {
                            if (!currentActivity.name) {
                                setCurrentActivity(activity);
                                localStorage.setItem('currentActivity', JSON.stringify({
                                    name: activity.name,
                                    start: new Date().getTime(),
                                    end: 0
                                }));

                                const ref = await addActivityData({
                                    name: activity.name,
                                    start: new Date().getTime(),
                                    end: 0
                                });

                                setLastDocumentRef(ref);
                                return;
                            }

                            if (currentActivity.name === activity.name) {
                                setCounter(0);
                                setCurrentActivity({});
                                localStorage.removeItem('currentActivity');

                                updateActivityData(lastDocumentRef, {
                                    name: activity.name,
                                    end: new Date().getTime()
                                });
                            }
                        }}>
                        <Icon size={80}/>
                        <p className="text-9xl font-extralight tracking-wide">{activity.name}</p>
                        <p className="text-8xl font-mono">{currentActivity.name === activity.name
                            ? `${Math.floor(counter / 60) < 10 ? "0" : ""}${Math.floor(counter / 60)}:${counter % 60 < 10 ? "0" : ""}${counter % 60}`
                            : ""}</p>
                        <div className="">
                            <p>{getLastSession(activity.name)}</p>
                            <div className={classNames("flex justify-center", {
                                "gap-4 absolute bottom-14 m-auto text-center left-0 right-0": orientationState.angle === 0,
                                "gap-0 flex-col absolute top-0 bottom-0 m-auto right-0 h-screen": orientationState.angle === 90,
                                "gap-0 flex-col absolute top-0 bottom-0 m-auto left-0 h-screen": orientationState.angle === 270,
                            })}>
                                {getLastWeekData(activity.name, activitiesData).map((item, index) => {
                                    return (
                                        <div
                                            key={item.name}
                                            className={classNames("py-1 px-4", index % 2 === 0 ? "bg-gray-800/50" : "bg-gray-700/50")}>
                                            <p>{item.duration}</p>
                                            <p>{item.name.slice(0, 1)}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </Block>
                )
            })}
        </div>
    );
};