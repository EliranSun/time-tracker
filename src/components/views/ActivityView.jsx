import {useEffect, useState, useContext, useMemo} from "react";
import classNames from "classnames";
import {Block} from "../Block";
import {getAppBackgroundColor, replaceMetaThemeColor} from "../../utils/colors";
import {StartTimeCounter} from "../StartTimeCounter";
import {usePageSwipe} from "../../hooks/usePageSwipe";
import {ActivityDataSection} from "../organisms/ActivityDataSection";
import {ActivitiesEntriesView} from "./ActivitiesEntriesView";
import {readableColor} from 'polished';
import {ActivitiesDungeonMap} from "../ActivitiesDungeonMap";
import {Spinner, Wall} from "@phosphor-icons/react";
import {useTimers} from "../../hooks/useTimers";
import {BackgroundColorOverlay} from "../atoms/stories/BackgroundColorOverlay";
import {ActivitiesContext} from "../../context/ActivitiesContext";
import {Activities, ACTIVITY_MINIMUM_TIME} from "../../constants/activities";
import {getConsequentialWeekData} from "../../utils/session";
import {LastWeekDataStrip} from "../LastWeekDataStrip";
import {ActivityTitle} from "../atoms/ActivityTitle";
import {ActivityDisplay} from "../molecules/ActivityDisplay";

const TEN_MINUTES = 10 * 60 * 1000;
const MAX_ACTIVITIES = 12;

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
    const {activities} = useContext(ActivitiesContext);
    const [lastStartTime, setLastStartTime] = useState(null);
    const [isAddEntryView, setIsAddEntryView] = useState(false);
    const activeActivities = useMemo(() => {
        const activeActivities = Activities.filter(activity => !activity.isArchived);
        let wallsCount = MAX_ACTIVITIES - activeActivities.length;

        return Activities.map(activity => {
            if (wallsCount > 0 && activity.isArchived) {
                wallsCount--;
                return {
                    ...activity,
                    icon: Wall,
                    isArchived: false,
                    isBlocked: true,
                }
            }

            return activity
        })
            // since we replace up to wallsCount, and any extra activity (since activities can be added)
            // should be filtered out
            .filter(activity => !activity.isArchived)
    }, []);
    const textColor = readableColor(currentActivity.name === activity.name ? activity.color : getAppBackgroundColor());
    const {logs, toggle, count, isLoading, setRefPath} = useTimers({
        activity,
        currentActivity,
        onActivityStart,
        onActivityEnd,
    });

    const activitiesData = useMemo(() => activities.find(entries => {
        return entries.some(entry => entry.name === activity.name);
    }) || [], [activities, activity.name]);

    const dayByDayData = useMemo(() => {
        return getConsequentialWeekData(
            activitiesData
                .filter(item => item.end > 0 && item.start > 0)
                .filter(item => (item.end - item.start) > ACTIVITY_MINIMUM_TIME)
                .sort((a, b) => a.end - b.end)
        );
    }, [activitiesData]);

    useEffect(() => {
        const isCurrentActivityCounterActive = currentActivity.name !== activity.name;
        replaceMetaThemeColor(isCurrentActivityCounterActive ? activity.color : getAppBackgroundColor());

        return () => {
            replaceMetaThemeColor(getAppBackgroundColor());
        }
    }, []);

    useEffect(() => {
        if (!currentActivity.name || currentActivity.name !== activity.name) {
            // swiping out of the activity
            replaceMetaThemeColor(getAppBackgroundColor());
            return;
        }

        if (currentActivity.start > 0 && currentActivity.end === 0) {
            // swiping into the activity
            replaceMetaThemeColor(activity.color);
            setLastStartTime(currentActivity.start);
            setRefPath(currentActivity.refPath);
        }
    }, [activity.name, currentActivity]);


    const swipeHandlers = usePageSwipe({
        activities: activeActivities,
        onSwipe: setActivePage,
        onEntryToggle: toggle,
        isDisabled: isAddEntryView || isEditEntryView
    });

    return (
        <>
            <div
                onDoubleClick={toggle}
                style={{color: textColor}}
                className={classNames("select-none", {
                    "mt-0 md:h-[90vh] flex items-start justify-center": isZenMode,
                    "mt-28 m-auto": !isZenMode && window.innerWidth > 400
                })}>
                {/*<button*/}
                {/*    className="fixed z-20 top-0 inset-x-0 text-xs"*/}
                {/*    onClick={() => alert(JSON.stringify(logs, null, 2))}>*/}
                {/*    logs*/}
                {/*</button>*/}
                <div {...swipeHandlers}>
                    <ActivitiesDungeonMap
                        activities={activeActivities}
                        isZenMode={isZenMode}
                        activePage={activePage}/>
                    <BackgroundColorOverlay
                        activity={activity}
                        currentActivity={currentActivity}
                        activitySwitch={toggle}
                        textColor={textColor}/>
                </div>
                <div className={classNames("w-full relative z-20 flex flex-wrap gap-px", {
                    "mt-0 items-start": isZenMode,
                    "mt-10 items-center": !isZenMode
                })}>
                    <ActivityDisplay
                        activity={activity}
                        currentActivity={currentActivity}
                        lastStartTime={lastStartTime}
                        isZenMode={isZenMode}
                        setIsAddEntryView={setIsAddEntryView}
                        isAddEntryView={isAddEntryView}
                        setIsEditEntryView={setIsEditEntryView}
                        isEditEntryView={isEditEntryView}
                        dayByDayData={dayByDayData}
                        activitiesData={activitiesData}
                        swipeHandlers={swipeHandlers}
                        isLoading={isLoading}
                        textColor={textColor}/>
                    <LastWeekDataStrip
                        isZenMode={isZenMode}
                        data={dayByDayData}
                        activity={activity}/>
                </div>
            </div>
            <ActivitiesEntriesView
                isOpen={isAddEntryView}
                onClose={() => setIsAddEntryView(false)}
                entries={[{
                    name: activity.name,
                    end: new Date().getTime(),
                    start: new Date().getTime() - TEN_MINUTES,
                }]}/>
        </>
    );
};