import {Spinner} from "@phosphor-icons/react";
import {ActivityTitle} from "../atoms/ActivityTitle";
import {StartTimeCounter} from "../StartTimeCounter";
import {ActivityDataSection} from "../organisms/ActivityDataSection";
import classNames from "classnames";
import {ACTIVITY_MINIMUM_TIME} from "../../constants/activities";
import {useMemo} from "react";


export const ActivityDisplay = ({
    activity,
    currentActivity,
    lastStartTime,
    isZenMode,
    setIsAddEntryView,
    isAddEntryView,
    setIsEditEntryView,
    isEditEntryView,
    dayByDayData,
    activitiesData,
    swipeHandlers,
    isLoading,
    textColor
}) => {
    const Icon = isLoading ? Spinner : (activity?.icon || (() => null));

    const sortedFilteredActivities = useMemo(() => {
        return activitiesData
            .filter(item => item.end > 0 && item.start > 0 && item.end - item.start > ACTIVITY_MINIMUM_TIME)
            .map(item => ({
                end: item.end,
                start: item.start,
                dateString: new Date(item.end).toUTCString()
            }))
            .sort((a, b) => {
                if (a.end < b.end) {
                    return 1;
                }
                if (a.end > b.end) {
                    return -1;
                }
                return 0;
            });
    }, [activitiesData]);

    return (
        <div className="flex flex-col items-center" {...swipeHandlers}>
            <div className={classNames("flex items-center", {"gap-2 order-2": !isZenMode})}>
                <Icon
                    color={textColor}
                    className={isLoading ? "animate-spin" : ""}
                    onClick={() => setIsAddEntryView(!isAddEntryView)}
                    size={window.innerWidth < 400 ? 60 : isZenMode ? 60 : 80}/>
                <ActivityTitle
                    name={activity.name}
                    isZenMode={isZenMode}/>
            </div>
            <div className="order-1">
                <StartTimeCounter
                    startTime={currentActivity.name === activity.name ? lastStartTime : 0}
                    isZenMode={isZenMode}/>
            </div>
            <div className={classNames("order-3", {"hidden": isEditEntryView || isZenMode})}>
                <ActivityDataSection
                    activity={activity}
                    dayByDayData={dayByDayData}
                    isEditEntryView={isEditEntryView}
                    setIsEditEntryView={setIsEditEntryView}
                    activitiesData={sortedFilteredActivities}/>
            </div>

        </div>
    )
};