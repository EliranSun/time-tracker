import {WeeklyLineChart} from "./atoms/WeeklyLineChart";

export const LastWeekDataStrip = ({data, isZenMode}) => {
    if (isZenMode) {
        return null;
    }
    
    return (
        <div className="overflow-x-auto w-screen h-48 -ml-10">
            <WeeklyLineChart data={data}/>
        </div>
    );
};