import {useMemo} from "react";
import {getWeekData, getConsequntialWeekData} from "../utils/session";
import {WeeklyLineChart} from "./atoms/WeeklyLineChart";
import classNames from "classnames";

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
        const foo = getConsequntialWeekData(activity.name, data);
        return getWeekData(activity.name, data);
            // alert(JSON.stringify(data));
    }, [activity.name, data]);

    return (
            <div className="absolute overflow-hidden w-full mt-28 z-50">
                <WeeklyLineChart data={lastWeekData.data.map(item => ({...item, name: item.name.slice(0, 1)}))}/>
            </div>
    );
};
