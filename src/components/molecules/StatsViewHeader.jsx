import {ChartPieSlice, List, Unite} from "@phosphor-icons/react";
import {ViewTypes} from "../../constants/views";
import {useTimeSum} from "../../hooks/useActivitiesByView";

const ViewIcon = {
    [ViewTypes.AGGREGATE]: Unite,
    [ViewTypes.DETAIL]: List,
    [ViewTypes.PIECHART]: ChartPieSlice,
}

export const StatsViewHeader = ({
    timeFrameName,
    onChangeView,
    viewName,
    items = [],
}) => {
    const summedTime = useTimeSum(items);
    const Icon = ViewIcon[viewName];

    return (
        <div className="text-black dark:text-white">
            <div className="px-4 pt-2 pb-4 flex items-center justify-between">
                <h1 className="text-2xl font-mono">
                    {timeFrameName.toUpperCase()}
                </h1>
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