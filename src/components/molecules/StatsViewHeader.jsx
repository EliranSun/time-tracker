import {CaretDown, CaretLeft, CaretRight, CaretUp, MoonStars} from "@phosphor-icons/react";

export const StatsViewHeader = ({timeFrameName, adjacentTimeframes, setShouldFilterSleep, shouldFilterSleep}) => {
    return (
        <div className="px-4 pt-2 pb-4 flex justify-between">
            <div className="flex gap-2 items-center">
                <CaretLeft/>
                <h1 className="text-3xl font-mono">
                    {timeFrameName.toUpperCase()}
                </h1>
                <CaretRight/>
            </div>
            <div className="flex gap-2">
                <div className="flex items-center gap-2">
                    <CaretUp/>
                    {adjacentTimeframes.higher}
                </div>
                <div className="flex items-center gap-2">
                    <CaretDown/>
                    {adjacentTimeframes.lower}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    onChange={() => setShouldFilterSleep(!shouldFilterSleep)}
                    checked={shouldFilterSleep}/>
                <MoonStars/>
            </div>
        </div>
    );
};