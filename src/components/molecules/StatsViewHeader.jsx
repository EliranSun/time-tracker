import {
    CaretDown, 
    CaretUp, 
    MoonStars, 
    ArrowsIn,
    ChartPieSlice} from "@phosphor-icons/react";
import { Activities } from "../../constants/activities";
import { useState } from "react";
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
    setShouldFilterSleep,
    shouldFilterSleep,
    onExpandViewClick
}) => {
    const [inactiveColors, setInactiveColors] = useState([]);
    
    
    return (
        <div className="px-4 pt-2 pb-4 flex items-center justify-between">
            <h1 className="text-3xl font-mono">
                {timeFrameName.toUpperCase()}
            </h1>
            {/* <div className="text-xs">
                {summedTime}
            </div>
            <div className="flex items-center gap-4">
                <ArrowsIn onClick={onExpandViewClick}/>
                 <ChartPieSlice onClick={onChangeView}/>
                <FilterSleepCheckbox
                    shouldFilterSleep={shouldFilterSleep}
                    setShouldFilterSleep={setShouldFilterSleep}/>
            </div> */}
            <div className="flex">
                {Activities.map(activity => 
            <span 
                className={classNames("w-4 h-4", {
                    "bg-gray-200": inactiveColors.includes(activity.color)
                })}
                style={{backgroundColor: activity.color}}/>)}
            </div>
        </div>
    );
};