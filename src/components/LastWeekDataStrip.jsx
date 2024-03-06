import classNames from "classnames";
import {useMemo} from "react";
import {getLastWeekData} from "../utils/session";

export const LastWeekDataStrip = ({activity, data}) => {
    const lastWeekData = useMemo(() => {
        return getLastWeekData(activity.name, data);
    }, [activity.name, data]);

    return (
        <div className="flex justify-center w-fit items-end m-auto text-center h-20 gap-2">
            {lastWeekData.data.map((item) => {
                const measure = item.measure || 0;
                return (
                    <div
                        key={item.name}
                        className={classNames("relative flex flex-col items-center gap-2 py-1 px-0 opacity-60 w-8")}>
                        <p className=" flex flex-col flex-wrap">
                            {(measure && measure > 0)
                                ? new Array(measure).fill(null).map((_, index) => {
                                    return <span key={index} className="w-8 h-4 bg-gray-700 dark:bg-white"/>
                                })
                                : "-"}
                        </p>
                        <p className="absolute text-xs leading-tight flex flex-col text-white m-auto inset-x-0 bottom-9">
                            {item.duration.hours > 0 ? <span>{item.duration.hours}h</span> : null}
                            {item.duration.minutes > 0 ? <span>{item.duration.minutes}m</span> : null}
                        </p>
                        <p>{item.name.slice(0, 1)}</p>
                    </div>
                )
            })}
        </div>
    );
};
