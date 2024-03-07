import {useMemo} from "react";
import {getLastWeekData} from "../utils/session";

const Duration = ({ item }) => {
    return (
        <p className="h-4 my-2 text-[10px] leading-[9px] flex flex-col m-auto inset-x-0 bottom-1">
                                {item.duration.hours > 0 ? <span>{item.duration.hours}h</span> : null}
                                {item.duration.minutes > 0 ? <span>{item.duration.minutes}m</span> : null}
                        </p>
                        );
};

export const LastWeekDataStrip = ({activity, data}) => {
    const lastWeekData = useMemo(() => {
        return getLastWeekData(activity.name, data);
    }, [activity.name, data]);

    return (
        <div className="flex justify-center w-fit items-end m-auto text-center h-24 gap-0">
            {lastWeekData.data.map((item) => {
                const measure = item.measure || 0;
                return (
                    <div key={item.name} className="flex flex-col items-center opacity-50 w-7">
                        <div className="relative flex flex-col flex-wrap gap-0 min-h-7 bg-black dark:bg-white">
                            {new Array(measure).fill(null).map((_, index) => {
                                return <span key={index} className="w-2 h-2 bg-black dark:bg-white"/>
                            })}
                        </div>
                        <Duration item={item} />
                        <p className="">{item.name.slice(0, 1)}</p>
                    </div>
                )
            })}
        </div>
    );
};
