import { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { LastWeekDataStrip } from "./components/LastWeekDataStrip";
import { LastSessionData } from "./components/LastSessionData";
import { formatCounter } from "./utils/counter";
import { useLongPress } from "react-use";
import { Block } from "./components/Block";
import { addActivityData, getRefByPath, updateActivityData } from "./utils/db";
import { TimeInput } from "./components/TimeInput";
import { DateInput } from "./components/DateInput";
import { getAppBackgroundColor, replaceMetaThemeColor } from "./utils/colors";
import { AddActivityTimeEntryButton } from "./components/AddActivityTimeEntryButton";

export const ActivitiesView = ({ currentActivity, onActivityStart, onActivityEnd, activity, isDiscrete }) => {
    const [refPath, setRefPath] = useState("");
    const [lastStartTime, setLastStartTime] = useState(null);
    const [isAddEntryView, setIsAddEntryView] = useState(false);
    const defaultOptions = {
        isPreventDefault: true,
        delay: 500,
    };
    const longPressEvent = useLongPress((event) => {
        const touchPoints = event.touches?.length;
        if (touchPoints === 2) {
            setIsAddEntryView(prev => !prev);
        }
    }, defaultOptions);

    useEffect(() => {
        if (!currentActivity.name || currentActivity.name !== activity.name) {
            return;
        }

        if (currentActivity.start > 0 && currentActivity.end === 0) {
            replaceMetaThemeColor(activity.color);
            setLastStartTime(currentActivity.start);
            setRefPath(currentActivity.refPath);
        }
    }, [activity.name, currentActivity]);

    useEffect(() => {
        // Set the theme color to the default. 
        // This is necessary because there's no meta on the index.html (to enable the dynamity)
        replaceMetaThemeColor(getAppBackgroundColor());
    }, []);

    const Icon = activity?.icon || (() => null);

    const onStartTick = useCallback((startTime) => {
        replaceMetaThemeColor(activity.color);
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
        replaceMetaThemeColor(getAppBackgroundColor());
        setLastStartTime(null);
        localStorage.removeItem('currentActivity');

        const ref = getRefByPath(refPath);

        updateActivityData(ref, {
            name: activity.name,
            end: new Date().getTime()
        })
            .catch(error => {
                alert(`Error updating data: ${error.message}`);
            })
    }, [activity.name, refPath]);

    return (
        <div
            className="h-screen w-screen flex flex-wrap gap-1 select-none">
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
                    className={classNames("font-extralight tracking-wide", isDiscrete
                        ? "text-sm"
                        : "text-8xl")}>
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
                            <AddActivityTimeEntryButton
                                onSuccess={() => setIsAddEntryView(false)}
                                activityName={activity.name}/>
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