import classNames from "classnames";
import { getLastWeekData } from "../utils/activities";
import { useActivityData } from "../hooks/useActivityData";
import { useMemo } from "react";
import { TodaySessions } from "./TodaySessions";

export const LastWeekDataStrip = ({ activity }) => {
    const activitiesData = useActivityData(activity.name);
    const lastWeekData = useMemo(() => {
        return getLastWeekData(activity.name, activitiesData);
    }, [activity.name, activitiesData]);

    return (
        <>
            <div className="absolute flex justify-center w-fit items-end bottom-20 m-auto text-center left-0 right-0">
                {lastWeekData.data.map((item) => {
                    const measure = item.measure || 0;
                    const measureValue = lastWeekData.totalActivitiesMeasure > 0
                        ? Math.round(measure + 1 / lastWeekData.totalActivitiesMeasure)
                        : 0;

                    return (
                        <div
                            key={item.name}
                            className={classNames("flex flex-col items-center gap-2 py-1 px-0 opacity-60 w-8")}>
                            <p className="flex flex-col flex-wrap">
                                {(measureValue && measureValue > 0) ? new Array(measureValue).fill(null).map((_, index) => {
                                    return <span key={index} className="w-2 h-2 bg-gray-700 dark:bg-white"/>
                                }) : null}
                            </p>
                            <div>
                                <p className="text-xs">{item.duration}</p>
                                <p>{item.name.slice(0, 1)}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
            <TodaySessions activitiesData={activitiesData}/>
        </>
    );
};
