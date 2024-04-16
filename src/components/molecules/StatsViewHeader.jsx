import {
    List,
    Unite,
    ChartPieSlice
} from "@phosphor-icons/react";
import {Activities} from "../../constants/activities";
import classNames from "classnames";
import {ViewTypes} from "../../constants/views";


const ViewIcon = {
    [ViewTypes.AGGREGATE]: Unite,
    [ViewTypes.DETAIL]: List,
    [ViewTypes.PIECHART]: ChartPieSlice,
}

export const StatsViewHeader = ({
                                    timeFrameName,
                                    summedTime,
                                    onChangeView,
                                    inactiveColors,
                                    setInactiveColors,
                                    viewName,
                                }) => {

    const Icon = ViewIcon[viewName];

    return (
        <div className="text-black dark:text-white">
            <div className="px-4 pt-2 pb-4 flex items-center justify-between">
                <h1 className="text-2xl font-mono">
                    {timeFrameName.toUpperCase()}
                </h1>
                <div className="flex">
<<<<<<< HEAD
                    {Activities.sort((a,b) => a.order - b.order).map(activity => {
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
=======
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
>>>>>>> e2d7b2c2cf900da2cc4313a75a4b79e5d3c9b0cf
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
                    <Icon onClick={onChangeView}/>
                </div>
            </div>
        </div>
    );
};