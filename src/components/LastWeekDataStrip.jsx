import classNames from "classnames";
import { getLastWeekData } from "../utils/activities";
import { useActivityData } from "../hooks/useActivityData";
import { useMemo } from "react";
import { TodaySessions } from "./TodaySessions";

export const LastWeekDataStrip = ({ activity, data }) => {
    const lastWeekData = useMemo(() => {
        return getLastWeekData(activity.name, data);
    }, [activity.name, data]);

    return (
        <div className="flex justify-center w-fit items-end m-auto text-center h-20">
            {lastWeekData.data.map((item) => {
                const measure = item.measure || 0;
                return (
                    <div
                        key={item.name}
                        className={classNames("flex flex-col items-center gap-2 py-1 px-0 opacity-60 w-8")}>
                        <p className="flex flex-col flex-wrap">
                            {(measure && measure > 0)
                                ? new Array(measure).fill(null).map((_, index) => {
                                    return <span key={index} className="w-2 h-2 bg-gray-700 dark:bg-white"/>
                                })
                                : "-"}
                        </p>
                        <div>
                            <p className="text-xs">{item.duration}</p>
                            <p>{item.name.slice(0, 1)}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};
