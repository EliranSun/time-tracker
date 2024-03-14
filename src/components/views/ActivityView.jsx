import {useCallback, useEffect, useState} from "react";
import classNames from "classnames";
import {useLongPress} from "react-use";
import {Block} from "../Block";
import {addActivityData, getRefByPath, updateActivityData} from "../../utils/db";
import {getAppBackgroundColor, replaceMetaThemeColor} from "../../utils/colors";
import {useActivityData} from "../../hooks/useActivityData";
import {AddActivityEntry} from "../AddActivityEntry";
import {Counter} from "../Counter";
import {usePageSwipe} from "../../hooks/usePageSwipe";
import {ActivityDataSection} from "../organisms/ActivityDataSection";

export const ActivityView = ({currentActivity, onActivityStart, onActivityEnd, activity, isZenMode, setActivePage}) => {
    const [refPath, setRefPath] = useState("");
    const [lastStartTime, setLastStartTime] = useState(null);
    const [isAddEntryView, setIsAddEntryView] = useState(false);
    const [updateCount, setUpdateCount] = useState(0);
    const activitiesData = useActivityData(activity.name, updateCount);
    const swipeHandlers = usePageSwipe(setActivePage);

    const defaultOptions = {
        isPreventDefault: true,
        delay: 3000,
    };
    const longPressEvent = useLongPress((event) => {
        const touchPoints = event.touches?.length;
        if (touchPoints === 1) {
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
            .then(() => setUpdateCount(prev => prev + 1))
            .catch(error => {
                alert(`Error updating data: ${error.message}`);
            })
    }, [activity.name, refPath]);

    return (
        <>
            <div {...swipeHandlers} className="">
                <div
                    className="fixed top-0 left-0 w-screen h-screen -z-10"
                    style={{backgroundColor: currentActivity.name === activity.name ? `${activity.color}` : ""}}/>
                <div className="h-2/3 flex items-center flex-wrap gap-1 select-none">
                    <Block
                        key={activity.name}
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
                        <div className="flex flex-col items-center mt-12 my-8">
                            <Icon size={80}/>
                            <p
                                {...longPressEvent}
                                className={classNames("font-extralight tracking-wide text-8xl")}>
                                {activity.name}
                            </p>
                            <Counter
                                isActive={currentActivity.name === activity.name}
                                lastStartTime={lastStartTime}
                                isZenMode={isZenMode}/>
                        </div>
                        {isAddEntryView ?
                            <AddActivityEntry
                                activity={activity}
                                setIsAddEntryView={setIsAddEntryView}/>
                            : null}
                        {(isZenMode || isAddEntryView) ? null : (
                            <div className="my-2 flex flex-col justify-between">
                                <ActivityDataSection
                                    activitiesData={activitiesData}
                                    activity={activity}/>
                            </div>
                        )}
                    </Block>
                </div>
            </div>
            <div id="scrollable-elements"/>
        </>
    );
};