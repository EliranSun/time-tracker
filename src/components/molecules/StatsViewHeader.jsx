import {
    CaretDown,
    CaretUp,
    MoonStars,
    ArrowsIn,
    ChartPieSlice
} from "@phosphor-icons/react";
import {Activities} from "../../constants/activities";
import {useState} from "react";
import classNames from "classnames";

const FilterSleepCheckbox = ({setShouldFilterSleep, shouldFilterSleep}) => {
    return (
        <div className="flex items-center gap-2">
            <input
                type="checkbox"
                onChange={() => setShouldFilterSleep(!shouldFilterSleep)}
                checked={!shouldFilterSleep}/>
            <MoonStars size={20}/>
        </div>
    );
};

export const StatsViewHeader = ({
                                    timeFrameName,
                                    summedTime,
                                    dateFrame,
                                    onChangeTimeFrame,
                                    onChangeView,
                                    onExpandViewClick,
                                    inactiveColors,
                                    setInactiveColors,
                                }) => {

    return (
        <div>
            <div className="px-4 pt-2 pb-4 flex items-center justify-between">
                <h1 className="text-2xl font-mono">
                    {timeFrameName.toUpperCase()}
                </h1>
                <div className="flex">
                    {Activities.map(activity => {
                        const Icon = activity.icon;
                        return (
                            <span
                                style={{backgroundColor: activity.color}}
                                className={classNames("w-5 h-5 flex items-center justify-center", {
                                    "grayscale": inactiveColors.includes(activity.color),
                                })}
                                onClick={() => {
                                    setInactiveColors(inactiveColors.includes(activity.color)
                                        ? inactiveColors.filter(color => color !== activity.color)
                                        : [...inactiveColors, activity.color]);
                                }}>
                            <Icon/>
                        </span>
                        );
                    })}
                </div>
            </div>
            <div className="flex justify-between px-4">
                <div className="text-xs">
                    {summedTime}
                </div>
                <div className="flex items-center gap-4">
                    <ArrowsIn onClick={onExpandViewClick}/>
                    <ChartPieSlice onClick={onChangeView}/>
                </div>
            </div>
        </div>
    );
};