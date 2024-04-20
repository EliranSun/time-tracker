import {useCallback, useEffect, useState} from "react";
import classNames from "classnames";
import {Block} from "../Block";
import {addActivityData, getRefByPath, updateActivityData} from "../../utils/db";
import {getAppBackgroundColor, replaceMetaThemeColor} from "../../utils/colors";
import {useActivityData} from "../../hooks/useActivityData";
import {Counter} from "../Counter";
import {usePageSwipe} from "../../hooks/usePageSwipe";
import {ActivityDataSection} from "../organisms/ActivityDataSection";
import {ActivitiesEntriesView} from "./ActivitiesEntriesView";
import {readableColor} from 'polished';
import {ActivitiesDungeonMap} from "../ActivitiesDungeonMap";
import {Spinner, SpinnerBall} from "@phosphor-icons/react";
import {Colors} from "../../constants/activities";

const ColorOverlay = ({activity, currentActivity}) => {
    return (
        <div
            className="fixed w-screen h-screen top-0 left-0 -z-10 flex items-center justify-center"
            style={{
                backgroundColor: currentActivity.name === activity.name
                    ? `${activity.color}`
                    : getAppBackgroundColor()
            }}/>
    );
};

export const ActivityView = ({
    currentActivity,
    onActivityStart,
    onActivityEnd,
    activity,
    isZenMode,
    setActivePage,
    isEditEntryView,
    setIsEditEntryView,
    activePage
}) => {
    const [refPath, setRefPath] = useState("");
    const [lastStartTime, setLastStartTime] = useState(null);
    const [isAddEntryView, setIsAddEntryView] = useState(false);
    const [updateCount, setUpdateCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const activitiesData = useActivityData(activity.name, updateCount);
    const textColor = readableColor(currentActivity.name === activity.name ? activity.color : getAppBackgroundColor());

    useEffect(() => {
        if (!currentActivity.name || currentActivity.name !== activity.name) {
            replaceMetaThemeColor(getAppBackgroundColor());
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
        setIsAddEntryView(false);
        setLastStartTime(startTime);
        setIsLoading(true);

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
            replaceMetaThemeColor(activity.color);
            setIsLoading(false);
            setRefPath(refPath);
        }).catch(error => {
            alert(`Error adding data: ${error.message}`);
            setIsLoading(false);
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

    const activityToggle = useCallback(() => {
        const shouldStartTick = !currentActivity.name;
        const shouldStopTick = currentActivity.name === activity.name;

        if (shouldStartTick) {
            onStartTick(new Date().getTime());
            return;
        }

        if (shouldStopTick) {
            onStopTick();
        }
    }, [currentActivity.name, activity.name]);

    const swipeHandlers = usePageSwipe({
        onSwipe: setActivePage,
        onEntryToggle: activityToggle,
        isDisabled: isAddEntryView || isEditEntryView
    });
    return (
        <>
            <div
                {...swipeHandlers}
                className="m-auto mt-28 select-none"
                onDoubleClick={() => {
                    console.log('double click');
                    activityToggle();
                }}
                onKeyDown={(event) => {
                    const isEnterKey = event.key === "Enter";
                    if (!isEnterKey)
                        return;

                    activityToggle();
                }}>
                <ActivitiesDungeonMap
                    isZenMode={isZenMode}
                    activePage={activePage}/>
                <ColorOverlay
                    activity={activity}
                    currentActivity={currentActivity}
                    activitySwitch={activityToggle}
                    textColor={textColor}/>
                <div className="flex items-center flex-wrap gap-1 mt-10">
                    <Block
                        key={activity.name}>
                        <div className="flex flex-col items-center">
                            {isLoading
                                ? <Spinner
                                    color={activity.color}
                                    size={80}
                                    className="animate-spin"/>
                                : <Icon
                                    onClick={() => setIsAddEntryView(!isAddEntryView)}
                                    size={80}/>}
                            <p
                                className={classNames("font-extralight tracking-wide min-h-sm:text-base text-8xl")}>
                                {activity.name}
                            </p>
                            <Counter
                                isActive={currentActivity.name === activity.name}
                                lastStartTime={lastStartTime}
                                isZenMode={isZenMode}/>
                        </div>
                        {(isZenMode || isAddEntryView) ? null : (
                            <div className="my-2 flex flex-col justify-between">
                                <ActivityDataSection
                                    isEditEntryView={isEditEntryView}
                                    setIsEditEntryView={setIsEditEntryView}
                                    activitiesData={activitiesData}
                                    activity={activity}/>
                            </div>
                        )}
                    </Block>
                </div>
            </div>

            <ActivitiesEntriesView
                isOpen={isAddEntryView}
                onClose={() => setIsAddEntryView(false)}
                entries={[{
                    start: new Date().getTime() - 60 * 60 * 1000,
                    end: new Date().getTime(),
                    name: activity.name,
                }]}/>
        </>
    );
};