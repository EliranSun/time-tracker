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
        return getWeekData(activity.name, data);
    }, [activity.name, data]);

    console.log({lastWeekData});

    return (
        <>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={classNames("fixed top-0 bg-white z-50", { "hidden": !isOpen })}>
                {JSON.stringify(lastWeekData, null, 2)}
            </div>
            <div
                className="w-full flex justify-center w-fit items-end m-auto text-center h-28">
                {lastWeekData.data.map((item) => {
                    const measure = item.measure || 0;
                    return (
                        <div key={item.name} className="flex flex-col items-center opacity-80 w-7">
                            <div className="relative flex flex-col gap-0 bg-black dark:bg-white max-h-16">
                                {/*{new Array(measure).fill(null).map((_, index) => {*/}
                                {/*    return (*/}
                                {/*        <span*/}
                                {/*            key={index}*/}
                                {/*            style={{backgroundColor: ""}}*/}
                                {/*            className="w-2 h-2"/>*/}
                                {/*    );*/}
                                {/*})}*/}
                            </div>
                            {/*<Duration item={item}/>*/}
                            {/*<p className="text-sm">{item.name.slice(0, 1)}</p>*/}
                        </div>
                    )
                })}
            </div>
            <div className="absolute overflow-hidden w-full mt-28 z-50">
                <WeeklyLineChart data={lastWeekData.data.map(item => ({...item, name: item.name.slice(0, 1)}))}/>
            </div>
        </>
    );
};
