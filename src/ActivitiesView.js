import { useEffect, useMemo, useState } from "react";
import { Lock, LockOpen } from "@phosphor-icons/react";
import { addDoc, collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./App";
import classNames from "classnames";
import { useOrientation } from 'react-use';
import { useActivityData } from "./hooks/useActivityData";
import { useCounter } from "./hooks/useCounter";
import { getLastWeekData } from "./utils/activities";
import { LastWeekDataStrip } from "./components/LastWeekDataStrip";
import { LastSessionData } from "./components/LastSessionData";

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
            className={classNames("w-full flex flex-col items-center justify-center p-4", className)}
            {...rest}>
            {children}
        </div>
    )
};

const formatCounter = (counter) => {
    const hours = Math.floor(counter / 3600);
    const minutes = Math.floor((counter - hours * 3600) / 60);
    const seconds = counter - hours * 3600 - minutes * 60;

    return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

const setMetaThemeColor = (color) => {
    const prevMeta = document.querySelectorAll('meta[name="theme-color"]');
    if (prevMeta.length > 0) {
        Array.from(prevMeta).map(item => item.remove());
    }

    var meta = document.createElement('meta');
    meta.name = "theme-color";
    meta.content = color;
    document.getElementsByTagName('head')[0].appendChild(meta);
};

export const ActivitiesView = ({ currentActivity, onActivityChange, activity, isDiscrete }) => {
    // const orientationState = useOrientation();
    const [lastDocumentRef, setLastDocumentRef] = useState(null);
    const [counter, setCounter] = useCounter(currentActivity.name);

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
        // Set the theme color to the default. 
        // This is necessary because there's no meta on the index.html (to enable the dynamity)
        setMetaThemeColor("#282c34");

        getCurrentActivityDoc().then((doc) => {
            if (doc.exists()) {
                const data = doc.data();
                if (!data.start) {
                    return;
                }

                onActivityChange(data);
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
                    onActivityChange(prev => {
                        setCurrentActivityDoc(prev);
                        return prev;
                    })
                }
            });
        });

        observer.observe({ type: "navigation", buffered: true });
    }, []);

    const Icon = activity?.icon || (() => null);

    return (
        <div className="h-screen w-screen flex flex-wrap gap-1">
            <Block
                key={activity.name}
                style={{ backgroundColor: currentActivity.name === activity.name ? `${activity.color}` : "" }}
                onDoubleClick={async () => {
                    if (!currentActivity.name) {
                        onActivityChange(activity);
                        setMetaThemeColor(activity.color);

                        localStorage.setItem('currentActivity', JSON.stringify({
                            name: activity.name,
                            start: new Date().getTime(),
                            end: 0
                        }));

                        try {
                            const ref = await addActivityData({
                                name: activity.name,
                                start: new Date().getTime(),
                                end: 0
                            });

                            setLastDocumentRef(ref);
                        } catch (error) {
                            alert(`Error adding data: ${error.message}`);
                        }
                        return;
                    }

                    if (currentActivity.name === activity.name) {
                        setCounter(0);
                        onActivityChange(null);
                        setMetaThemeColor("#282c34");

                        localStorage.removeItem('currentActivity');

                        updateActivityData(lastDocumentRef, {
                            name: activity.name,
                            end: new Date().getTime()
                        }).catch(error => {
                            alert(`Error updating data: ${error.message}`);
                        })
                    }
                }}>
                <Icon size={isDiscrete ? 10 : 80}/>
                <p className={classNames("font-extralight tracking-wide", isDiscrete ? "text-sm" : "text-8xl")}>
                    {activity.name}
                </p>
                <p className={classNames("font-mono", isDiscrete ? "text-xs" : "text-7xl")}>
                    {currentActivity.name === activity.name
                        ? formatCounter(counter)
                        : ""}
                </p>
                {isDiscrete ? null :
                    <div>
                        <LastSessionData activity={activity}/>
                        <LastWeekDataStrip activity={activity}/>
                    </div>}
            </Block>
        </div>
    );
};