import {WeeklyLineChart} from "./atoms/WeeklyLineChart";

export const LastWeekDataStrip = ({data}) => {
    return (
        <div className="overflow-x-auto w-screen h-48 -ml-10">
            <WeeklyLineChart data={data}/>
        </div>
    );
};