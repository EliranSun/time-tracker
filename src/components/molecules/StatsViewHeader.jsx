import {
    List,
    Unite,
    ChartPieSlice
} from "@phosphor-icons/react";
import {Activities} from "../../constants/activities";
import classNames from "classnames";
import {ViewTypes} from "../../constants/views";
import {useMemo} from "react";
import {useTimeSum} from "../../hooks/useActivitiesByView";

const ViewIcon = {
    [ViewTypes.AGGREGATE]: Unite,
    [ViewTypes.DETAIL]: List,
    [ViewTypes.PIECHART]: ChartPieSlice,
}

export const StatsViewHeader = ({
                                    timeFrameName,
                                    onChangeView,
                                    inactiveColors,
                                    setInactiveColors,
                                    viewName,
                                    items = [],
                                }) => {
    const summedTime = useTimeSum(items);
    const Icon = ViewIcon[viewName];
    const rainbowFilterIcons = useMemo(() => {
        return [...Activities]
            .sort((a, b) => a.order - b.order)
            .filter(activity => {
                if (items.length === 0)
                    return false;

                return items.find(item => item.activity?.name?.toLowerCase() === activity.name?.toLowerCase());
            });
    }, [inactiveColors]);

    return (
        <div className="text-black dark:text-white">
            <div className="px-4 pt-2 pb-4 flex items-center justify-between">
                <h1 className="text-2xl font-mono">
                    {timeFrameName.toUpperCase()}
                </h1>
                <div className="flex">
                    {rainbowFilterIcons.map(activity => {
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
                    <Icon onClick={onChangeView}/>
                </div>
            </div>
        </div>
    );
};