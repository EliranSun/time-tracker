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
            on
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

export const ActivitiesView = ({ currentActivity, onActivityStart, onActivityEnd, activity, isDiscrete }) => {
    const [refPath, setRefPath] = useState("");
    const [lastStartTime, setLastStartTime] = useState(null);

    useEffect(() => {
        if (!currentActivity.name || currentActivity.name !== activity.name) {
            return;
        }

        if (currentActivity.start > 0 && currentActivity.end === 0) {
            setMetaThemeColor(activity.color);
            setLastStartTime(currentActivity.start);
            setRefPath(currentActivity.refPath);
        }
    }, [activity.name, currentActivity]);

    useEffect(() => {
        // Set the theme color to the default. 
        // This is necessary because there's no meta on the index.html (to enable the dynamity)
        setMetaThemeColor("#282c34");

        // getCurrentActivityDoc().then((doc) => {
        //     if (doc.exists()) {
        //         const data = doc.data();
        //         if (!data.start) {
        //             return;
        //         }
        //
        //         onActivityStart({});
        //     }
        // }).catch(error => {
        //     console.error("Error getting document:", error);
        // })
    }, []);

    const Icon = activity?.icon || (() => null);

    const onStartTick = useCallback((startTime) => {
        setMetaThemeColor(activity.color);
        setLastStartTime(startTime);

        addActivityData({
            name: activity.name,
            start: startTime,
            end: 0
        }).then(ref => {
            const refPath = ref.path;
            const data = {
                name: activity.name,
                color: activity.color,
                start: startTime,
                end: 0,
                refPath
            };
            localStorage.setItem('currentActivity', JSON.stringify(data));
            onActivityStart(data);
            setRefPath(refPath);
        }).catch(error => {
            alert(`Error adding data: ${error.message}`);
        });
    }, [activity]);

    const onStopTick = useCallback(() => {
        onActivityEnd();
        setMetaThemeColor("#282c34");
        setLastStartTime(null);
        localStorage.removeItem('currentActivity');

        const ref = doc(db, refPath);

        updateActivityData(ref, {
            name: activity.name,
            end: new Date().getTime()
        })
            .catch(error => {
                alert(`Error updating data: ${error.message}`);
            })
    }, [activity.name, refPath]);

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