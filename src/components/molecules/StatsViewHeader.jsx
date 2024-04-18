import {ChartPieSlice, Notepad, Unite} from "@phosphor-icons/react";
import {ViewTypes} from "../../constants/views";

export const StatsViewHeader = ({
    timeFrameName,
    viewName,
    onChangeView,
    totalTime = 0,
    highlightedViewColor = "gold"
}) => {

    return (
        <div className="text-black dark:text-white">
            <div className="px-4 pt-2 pb-4 flex items-center gap-2">
                <h1 className="text-2xl font-mono">
                    {timeFrameName.toUpperCase()}
                </h1>-
                <div className="text-xs">
                    {totalTime}
                </div>
            </div>
            <div className="flex justify-center items-center px-4">
                <div className="flex items-center gap-4 my-2 text-black dark:text-white">
                    <Unite
                        color={viewName === ViewTypes.AGGREGATE ? highlightedViewColor : "currentColor"}
                        onClick={() => onChangeView(ViewTypes.AGGREGATE)}/>
                    <Notepad
                        color={viewName === ViewTypes.DETAIL ? highlightedViewColor : "currentColor"}
                        onClick={() => onChangeView(ViewTypes.DETAIL)}/>
                    <ChartPieSlice
                        color={viewName === ViewTypes.PIE ? highlightedViewColor : "currentColor"}
                        onClick={() => onChangeView(ViewTypes.PIE)}/>
                </div>
            </div>
        </div>
    );
};