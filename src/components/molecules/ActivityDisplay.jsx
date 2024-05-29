import {Spinner} from "@phosphor-icons/react";
import {ActivityTitle} from "../atoms/ActivityTitle";
import {StartTimeCounter} from "../StartTimeCounter";
import {ActivityDataSection} from "../organisms/ActivityDataSection";
import classNames from "classnames";

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
    const Icon = activity?.icon || (() => null);

    return (
        <div className="flex flex-col items-center" {...swipeHandlers}>
            <div className={classNames("flex flex-col justify-between", {
                "hidden": isEditEntryView || isZenMode,
            })}>
                <ActivityDataSection
                    dayByDayData={dayByDayData}
                    isEditEntryView={isEditEntryView}
                    setIsEditEntryView={setIsEditEntryView}
                    activitiesData={activitiesData}
                    activity={activity}/>
            </div>
            <div className="flex items-center gap-2">
                {isLoading
                    ? <Spinner
                        color={textColor}
                        size={80}
                        className="animate-spin"/>
                    : <Icon
                        onClick={() => setIsAddEntryView(!isAddEntryView)}
                        size={80}/>}
                <ActivityTitle name={activity.name} isZenMode={isZenMode}/>
            </div>
            <StartTimeCounter
                startTime={currentActivity.name === activity.name ? lastStartTime : 0}
                isZenMode={isZenMode}/>

        </div>
    )
};