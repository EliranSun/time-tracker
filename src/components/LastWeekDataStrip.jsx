import classNames from "classnames";
import { useOrientation } from "react-use";
import { getLastWeekData } from "../utils/activities";
import { useActivityData } from "../hooks/useActivityData";
import { isSameDay, roundToNearestMinutes } from "date-fns";
import { useMemo } from "react";

const formatDateTimeParts = (timestamp) => {
    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: 'numeric',
    })
        .format(new Date(roundToNearestMinutes(timestamp, { nearestTo: 5 })))
        .split(' at ')
};

const TodaySessions = ({ activitiesData }) => {
    return (
        <div>
            {activitiesData
                .filter(item => {
                    return (
                        isSameDay(new Date(item.start), new Date()) &&
                        item.end > 0 &&
                        (item.end - item.start) > 60 * 1000
                    );
                })
                // .sort((a, b) => b.end - b.start - (a.end - a.start))
                .sort((a, b) => b.start - a.start)
                .slice(0, 4)
                .map(item => {
                    const starTimeDateParts = formatDateTimeParts(item.start);

                    return (
                        <div
                            key={item.start}
                            className="flex text-xs opacity-40 justify-between w-20 m-auto font-mono">
                            <span>{starTimeDateParts[1]}</span>
                            <span>-</span>
                            <span>
                                {new Intl.DateTimeFormat('en-GB', {
                                    hour: 'numeric',
                                    minute: 'numeric',
                                }).format(new Date(roundToNearestMinutes(item.end, { nearestTo: 5 })))}
                            </span>
                        </div>
                    )
                })}
        </div>
    )
};

export const LastWeekDataStrip = ({ activity }) => {
    const activitiesData = useActivityData(activity.name);
    const lastWeekData = useMemo(() => {
        return getLastWeekData(activity.name, activitiesData);
    }, [activity.name, activitiesData]);

    return (
        <>
            <div className="absolute flex justify-center w-fit items-end bottom-28 m-auto text-center left-0 right-0">
                {lastWeekData.data.map((item) => {
                    const measure = item.measure || 0;
                    const measureValue = Math.round(measure + 1 / lastWeekData.totalActivitiesMeasure);

                    return (
                        <div
                            key={item.name}
                            className={classNames("flex flex-col items-center gap-2 py-1 px-4 opacity-60")}>
                            <p className="flex flex-col flex-wrap">
                                {measureValue > 0 && new Array(measureValue).fill(null).map(i => {
                                    return <span className="w-2 h-2 bg-white"></span>
                                })}
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
