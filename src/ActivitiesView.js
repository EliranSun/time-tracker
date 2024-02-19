import { useCallback, useEffect, useState } from "react";
import { Clock, Minus, MinusCircle, Plus, PlusCircle } from "@phosphor-icons/react";
import { addDoc, collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./App";
import classNames from "classnames";
import { useCounter } from "./hooks/useCounter";
import { LastWeekDataStrip } from "./components/LastWeekDataStrip";
import { LastSessionData } from "./components/LastSessionData";
import { formatCounter } from "./utils/counter";
import { useLongPress } from "react-use";

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

const TimeInput = ({ name }) => {
    return (
        <input
            name={name}
            className="w-20 bg-transparent"
            type="number"
            placeholder="00"
            onFocus={(event) => event.target.select()}
            onChange={(event) => {
                const name = event.target.name;
                const value = event.target.value;

                if (String(value).length >= 2) {
                    // focus on the next input
                    if (event.target.nextElementSibling) {
                        event.target.nextElementSibling.focus();
                    } else {
                        event.target.blur();
                    }
                }

                if (name === "time-hours" && value > 24) {
                    event.target.value = 24;
                }

                if (name === "time-minutes" && value > 59) {
                    event.target.value = 59;
                }

                if (name === "time-seconds" && value > 59) {
                    event.target.value = 59;
                }
            }}/>
    );
};

const DateInput = ({ name }) => {
    const MaxValues = {
        "date-day": 31,
        "date-month": 12,
        "date-year": 99,
        "date-hours": 24,
        "date-minutes": 59
    };
    const now = new Date();
    const DefaultValues = {
        "date-day": now.getDate(),
        "date-month": now.getMonth() + 1,
        "date-year": now.getFullYear().toString().slice(-2),
        "date-hours": now.getHours(),
        "date-minutes": now.getMinutes()
    };

    return (
        <input
            name={name}
            className="w-5 bg-transparent"
            type="number"
            placeholder="00"
            defaultValue={DefaultValues[name]}
            onFocus={(event) => event.target.select()}
            onChange={(event) => {
                const name = event.target.name;
                const value = event.target.value;

                if (String(value).length >= 2) {
                    // focus on the next input
                    if (event.target.nextElementSibling) {
                        event.target.nextElementSibling.focus();
                    } else {
                        event.target.blur();
                    }
                }

                if (value > MaxValues["date-day"]) {
                    event.target.value = MaxValues["date-day"];
                }
            }}/>
    );

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

export const ActivitiesView = ({ currentActivity, onActivityStart, onActivityEnd, activity, isDiscrete }) => {
    const [refPath, setRefPath] = useState("");
    const [lastStartTime, setLastStartTime] = useState(null);
    const [isAddEntryView, setIsAddEntryView] = useState(false);
    const defaultOptions = {
        isPreventDefault: true,
        delay: 500,
    };
    const longPressEvent = useLongPress(() => {
        setIsAddEntryView(prev => !prev);
    }, defaultOptions);

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
        setIsAddEntryView(false);
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

    const onInputChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        if (String(value).length >= 2) {
            // focus on the next input
            if (event.target.nextElementSibling) {
                event.target.nextElementSibling.focus();
            } else {
                event.target.blur();
            }
        }

        if (name === "time-hours" && value > 24) {
            event.target.value = 24;
        }

        if (name === "time-minutes" && value > 59) {
            event.target.value = 59;
        }

        if (name === "time-seconds" && value > 59) {
            event.target.value = 59;
        }
    };

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
                <p
                    {...longPressEvent}
                    className={classNames("font-extralight tracking-wide select-none", isDiscrete ? "text-sm" : "text-8xl")}>
                    {activity.name}
                </p>
                {isAddEntryView ? (
                    <div className="flex flex-col items-center">
                        <p className={classNames("font-mono", isDiscrete ? "text-xs" : "text-6xl")}>
                            <TimeInput name="time-hours" value="0"/>:
                            <TimeInput name="time-minutes" value="0"/>:
                            <TimeInput name="time-seconds" value="0"/>
                        </p>
                        <label>Start date:</label>
                        <div>
                            <div className="flex gap-4">
                                <div className="flex justify-center">
                                    <DateInput name="date-day"/>
                                    <span>/</span>
                                    <DateInput name="date-month"/>
                                    <span>/</span>
                                    <DateInput name="date-year"/>
                                </div>
                                <div className="flex justify-center">
                                    <DateInput name="date-hours"/>:
                                    <DateInput name="date-minutes"/>
                                </div>
                            </div>
                            <button
                                className="border border-white p-4 my-4"
                                onClick={() => {
                                    const date = new Date();
                                    const hours = document.querySelector('input[name="date-hours"]').value;
                                    const minutes = document.querySelector('input[name="date-minutes"]').value;
                                    const day = document.querySelector('input[name="date-day"]').value;
                                    const month = document.querySelector('input[name="date-month"]').value;
                                    const year = document.querySelector('input[name="date-year"]').value;

                                    const timeHours = document.querySelector('input[name="time-hours"]').value;
                                    const timeMinutes = document.querySelector('input[name="time-minutes"]').value;
                                    const timeSeconds = document.querySelector('input[name="time-seconds"]').value;

                                    if (!hours || !minutes || !day || !month || !year) {
                                        alert("Please fill date fields");
                                        return;
                                    }

                                    if (!timeHours && !timeMinutes && !timeSeconds) {
                                        alert("Please fill time fields");
                                        return;
                                    }

                                    date.setHours(hours);
                                    date.setMinutes(minutes);
                                    date.setSeconds(0);
                                    date.setDate(day);
                                    date.setMonth(month - 1);
                                    date.setFullYear(`20${year}`);

                                    const startTime = date.getTime();
                                    const endTime = startTime
                                        + (timeHours * 60 * 60 * 1000)
                                        + (timeMinutes * 60 * 1000)
                                        + (timeSeconds * 1000);

                                    addActivityData({
                                        name: activity.name,
                                        start: startTime,
                                        end: endTime
                                    })
                                        .then(() => {
                                            setIsAddEntryView(false);
                                        })
                                        .catch(error => {
                                            alert(`Error adding data: ${error.message}`);
                                        });
                                }}>

                                Add
                            </button>
                        </div>
                    </div>
                ) : null}
                {currentActivity.name !== activity.name ? null :
                    <p className={classNames("font-mono", isDiscrete ? "text-xs" : "text-6xl")}>
                        {formatCounter(lastStartTime)}
                    </p>}
                {(isDiscrete || isAddEntryView) ? null :
                    <div>
                        <LastSessionData activity={activity}/>
                        <LastWeekDataStrip activity={activity}/>
                    </div>}
            </Block>
        </div>
    );
};