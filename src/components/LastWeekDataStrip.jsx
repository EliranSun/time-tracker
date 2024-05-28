import {useMemo, useState} from "react";
import {getWeekData} from "../utils/session";
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
    const [isOpen, setIsOpen] = useState(false);
    const lastWeekData = useMemo(() => {
        const data = getWeekData(activity.name, data);
            // alert(JSON.stringify(data));
            return data;
    }, [activity.name, data]);

    return (
        <div>
            hi
            {/* <div className="absolute overflow-hidden w-full mt-28 z-50">
                <WeeklyLineChart data={lastWeekData.data.map(item => ({...item, name: item.name.slice(0, 1)}))}/>
            </div> */}
        </div>
    );
};
