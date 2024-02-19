import { useCallback, useEffect, useState } from "react";
import { Minus, MinusCircle, Plus, PlusCircle } from "@phosphor-icons/react";
import { addDoc, collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./App";
import classNames from "classnames";
import { useCounter } from "./hooks/useCounter";
import { LastWeekDataStrip } from "./components/LastWeekDataStrip";
import { LastSessionData } from "./components/LastSessionData";
import { formatCounter } from "./utils/counter";

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

export const ActivitiesView = ({ currentActivity, onActivityChange, activity, isDiscrete, counter }) => {
    const [lastDocumentRef, setLastDocumentRef] = useState(null);
    const [lastStartTime, setLastStartTime] = useState(null);

    useEffect(() => {
        const storedLastStartTime = localStorage.getItem('lastStartTime');
        if (storedLastStartTime) {
            onStartTick(parseInt(storedLastStartTime));
        }
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
            }
        }).catch(error => {
            console.error("Error getting document:", error);
        })
    }, []);
    const Icon = activity?.icon || (() => null);

    const onStartTick = useCallback((startTime) => {
        localStorage.setItem('lastStartTime', startTime.toString());
        onActivityChange(activity);
        setMetaThemeColor(activity.color);
        setLastStartTime(startTime);

        localStorage.setItem('currentActivity', JSON.stringify({
            name: activity.name,
            start: startTime,
            end: 0
        }));

        addActivityData({
            name: activity.name,
            start: startTime,
            end: 0
        }).then(ref => {
            setLastDocumentRef(ref);
        }).catch(error => {
            alert(`Error adding data: ${error.message}`);
        });
    }, [activity]);

    const onStopTick = useCallback(() => {
        onActivityChange(null);
        setMetaThemeColor("#282c34");
        setLastStartTime(null);
        localStorage.removeItem('lastStartTime');
        localStorage.removeItem('currentActivity');

        updateActivityData(lastDocumentRef, {
            name: activity.name,
            end: new Date().getTime()
        }).catch(error => {
            alert(`Error updating data: ${error.message}`);
        })
    }, [activity.name, lastDocumentRef]);

    return (
        <div className="h-screen w-screen flex flex-wrap gap-1">
            <Block
                key={activity.name}
                style={{ backgroundColor: currentActivity.name === activity.name ? `${activity.color}` : "" }}
                onDoubleClick={() => {
                    const shouldStartTick = !currentActivity.name;
                    const shouldStopTick = currentActivity.name === activity.name;

                    if (shouldStartTick) {
                        onStartTick(new Date().getTime());
                        return;
                    }

                    if (shouldStopTick) {
                        onStopTick();
                    }
                }}>
                <Icon size={isDiscrete ? 10 : 80}/>
                <p className={classNames("font-extralight tracking-wide", isDiscrete ? "text-sm" : "text-8xl")}>
                    {activity.name}
                </p>
                {currentActivity.name !== activity.name ? null :
                    <p className={classNames("font-mono", isDiscrete ? "text-xs" : "text-6xl")}>
                        {formatCounter(lastStartTime)}
                    </p>}
                {isDiscrete ? null :
                    <div>
                        <LastSessionData activity={activity}/>
                        <LastWeekDataStrip activity={activity}/>
                    </div>}
            </Block>
        </div>
    );
};