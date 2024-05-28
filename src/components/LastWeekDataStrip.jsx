import {useMemo} from "react";
import {getWeekData, getConsequentialWeekData} from "../utils/session";
import {WeeklyLineChart} from "./atoms/WeeklyLineChart";
import {ACTIVITY_MINIMUM_TIME} from "../constants/activities";

const Duration = ({item}) => {
    return (
        <p className="mt-2 text-[10px] leading-[9px] flex flex-col m-auto inset-x-0 bottom-1">
            {/*{item.duration.hours > 0 ? <span>{item.duration.hours}h</span> : null}*/}
            {/*{item.duration.minutes > 0 ? <span>{item.duration.minutes}m</span> : null}*/}
            <span>{item.shortDuration}</span>
        </p>
    );
};

export const LastWeekDataStrip = ({activity, data}) => {
    const lastWeekData = useMemo(() => {
        return getConsequentialWeekData(data
            .filter(item => item.end > 0 && item.start > 0)
            .filter(item => (item.end - item.start) > ACTIVITY_MINIMUM_TIME)
            .reverse());
        // return getWeekData(activity.name, data);
        // alert(JSON.stringify(data));
    }, [activity.name, data]);

    return (
        <div className="overflow-hidden w-96 h-60 z-50">
            <WeeklyLineChart data={lastWeekData}/>
        </div>
    );
};
