import {
CaretDown, 
CaretUp, 
MoonStars, 
ArrowsIn,
ChartPieSlice} from "@phosphor-icons/react";

const DateFrame = ({value, onClick}) => {
    return (
        <div className="flex gap-2" onClick={onClick}>
            <div className="flex flex-col items-center justify-center">
                <CaretUp size={13}/>
                <CaretDown size={13}/>
            </div>
            <div className="flex items-center gap-2">
                {value}
            </div>
        </div>
    )
};

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
    return (
        <div className="px-4 pt-2 pb-4 flex items-center justify-between">
            <h1 className="text-3xl font-mono">
                {timeFrameName.toUpperCase()}
            </h1>
            <div className="text-xs">
                {summedTime}
            </div>
            <div className="flex items-center gap-4">
                <DateFrame value={dateFrame} onClick={onChangeTimeFrame}/>
                <ArrowsIn onClick={onExpandViewClick}/>
                 <ChartPieSlice onClick={onChangeView}/>
                <FilterSleepCheckbox
                    shouldFilterSleep={shouldFilterSleep}
                    setShouldFilterSleep={setShouldFilterSleep}/>
            </div>
        </div>
    );
};