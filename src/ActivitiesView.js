import { useEffect, useState } from "react";
import { ChartBar } from "@phosphor-icons/react";
import { addDoc, collection, updateDoc, setDoc, doc, getDoc } from "firebase/firestore";
import { Activities, db } from "./App";
import classNames from "classnames";

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
            className={classNames("w-[calc(50%-5px)] text-white flex flex-col items-center justify-center", className)}
            {...rest}>
            {children}
        </div>
    )
}

export const ActivitiesView = ({ onChangePage }) => {
    const [lastDocumentRef, setLastDocumentRef] = useState(null);
    const [currentActivity, setCurrentActivity] = useState({});
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        if (currentActivity.name) {
            // setCounter(0);

            const interval = setInterval(() => {
                setCounter(prev => prev + 1);
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
                setCurrentActivity(data);
                setCounter(Math.floor((new Date().getTime() - data.start) / 1000));
            }
        }).catch(error => {
            console.error("Error getting document:", error);
        })

        const counter = localStorage.getItem('counter');

        if (counter) {
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

    return (
        <div className="h-[90vh] flex flex-wrap gap-1">
            {Activities.map((activity, index) => {
                return (
                    <Block
                        key={activity.name}
                        style={{
                            backgroundColor: currentActivity.name === activity.name ? `${activity.color}` : "",
                            border: currentActivity.name !== activity.name ? `1px solid rgba(255,255,255,0.5)` : ""
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
                                    start: Activities[index].data[Activities[index].data.length - 1].start,
                                    end: new Date().getTime()
                                });
                            }
                        }}>
                        <p>{activity.name}</p>
                        <p className="h-4">{currentActivity.name === activity.name ? `${Math.floor(counter / 60)}:${counter % 60}` : ""}</p>
                    </Block>
                )
            })}
            <Block onClick={onChangePage}>
                <ChartBar/>
            </Block>
        </div>
    );
};