import { useEffect, useState } from "react";
import { ArrowCounterClockwise, ChartBar, Lock, LockOpen } from "@phosphor-icons/react";
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

export const ActivitiesView = ({ onChangePage, activities = [] }) => {
    const orientationState = useOrientation();
    const [isLocked, setIsLocked] = useState(false);
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
        var meta = document.createElement('meta');
        meta.name = "theme-color";
        meta.content = "#282c34";
        document.getElementsByTagName('head')[0].appendChild(meta);

        getCurrentActivityDoc().then((doc) => {
            if (doc.exists()) {
                const data = doc.data();
                console.log({ data });
                if (!data.start) {
                    return;
                }

                setCurrentActivity(data);
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
        if (isLocked) {
            return;
        }

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

    const LockIcon = isLocked ? Lock : LockOpen;
    const orientationActivity = activities.find(activity => activity.orientationAngle === orientationState.angle) || {};
    const Icon = orientationActivity?.icon || (() => null);
    const hasBackgroundActivity = orientationState.angle !== currentActivity.orientationAngle && isLocked;

    return (
        <>
            <div
                style={{
                    backgroundColor: hasBackgroundActivity ? currentActivity.color : "transparent"
                }}
                className={classNames("absolute flex items-center justify-center gap-2 text-white", {
                    "text-xl px-4 py-2 rounded-2xl": hasBackgroundActivity,
                    "": !hasBackgroundActivity,
                    "top-10 left-0 right-0 m-auto w-1/3": orientationState.angle === 0,
                    "left-10 bottom-10 m-auto": orientationState.angle === 90,
                })}>
                <LockIcon
                    size={32}
                    className="cursor-pointer"
                    onClick={() => setIsLocked(!isLocked)}/>
                {hasBackgroundActivity ? `${currentActivity.name}` : ""}
            </div>
            <div className="h-screen w-screen flex flex-wrap gap-1">
                <Block
                    key={orientationActivity.name}
                    style={{
                        backgroundColor: currentActivity.name === orientationActivity.name ? `${orientationActivity.color}` : "",
                    }}
                    onMouseDown={async () => {
                        if (!currentActivity.name) {
                            setCurrentActivity(orientationActivity);
                            setIsLocked(true);
                            var meta = document.getElementsByTagName('meta')['theme-color'];
                            meta.content = orientationActivity.color;

                            localStorage.setItem('currentActivity', JSON.stringify({
                                name: orientationActivity.name,
                                start: new Date().getTime(),
                                end: 0
                            }));

                            const ref = await addActivityData({
                                name: orientationActivity.name,
                                start: new Date().getTime(),
                                end: 0
                            });

                            setLastDocumentRef(ref);
                            return;
                        }

                        if (currentActivity.name === orientationActivity.name) {
                            setCounter(0);
                            setCurrentActivity({});
                            setIsLocked(false);
                            var meta = document.getElementsByTagName('meta')['theme-color'];
                            meta.content = "#282c34";

                            localStorage.removeItem('currentActivity');

                            updateActivityData(lastDocumentRef, {
                                name: orientationActivity.name,
                                end: new Date().getTime()
                            });
                        }
                    }}>
                    <Icon size={80}/>
                    <p className="text-9xl font-extralight tracking-wide">{orientationActivity.name}</p>
                    <p className="text-8xl font-mono">{currentActivity.name === orientationActivity.name
                        ? `${Math.floor(counter / 60) < 10 ? "0" : ""}${Math.floor(counter / 60)}:${counter % 60 < 10 ? "0" : ""}${counter % 60}`
                        : ""}</p>
                    <div className="">
                        <p>{getLastSession(orientationActivity.name)}</p>
                        <div className={classNames("flex justify-center", {
                            "gap-0 absolute bottom-28 m-auto text-center left-0 right-0": orientationState.angle === 0,
                            "gap-0 flex-col absolute top-0 bottom-0 m-auto right-0 h-screen": orientationState.angle === 90 || orientationState.angle === 270,
                        })}>
                            {getLastWeekData(orientationActivity.name, activitiesData).map((item, index) => {
                                return (
                                    <div
                                        key={item.name}
                                        className={classNames("py-1 px-4")}>
                                        <p>{item.duration}</p>
                                        <p>{item.name.slice(0, 1)}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </Block>
            </div>
        </>
    );
};