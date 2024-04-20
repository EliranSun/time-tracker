import {useMemo} from "react";
import {getLastWeekData} from "../utils/session";

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
        return getLastWeekData(activity.name, data);
    }, [activity.name, data]);

    return (
        <div className="w-full flex justify-center w-fit items-end m-auto text-center h-fit gap-0">
            {lastWeekData.data.map((item) => {
                const measure = item.measure || 0;
                return (
                    <div key={item.name} className="flex flex-col items-center opacity-80 w-7">
                        <div className="relative flex flex-col gap-0 bg-black dark:bg-gray-100 max-h-16">
                            {new Array(measure).fill(null).map((_, index) => {
                                return (
                                    <span
                                        key={index}
                                        style={{backgroundColor: ""}}
                                        className="w-2 h-2"/>
                                );
                            })}
                        </div>
                        <Duration item={item}/>
                        <p className="text-sm">{item.name.slice(0, 1)}</p>
                    </div>
                )
            })}
        </div>
    );
};
