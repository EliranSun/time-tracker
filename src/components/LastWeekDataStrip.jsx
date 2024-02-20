import classNames from "classnames";
import { useOrientation } from "react-use";
import { getLastWeekData } from "../utils/activities";
import { useActivityData } from "../hooks/useActivityData";
import { isSameDay, roundToNearestMinutes } from "date-fns";
import { useMemo } from "react";

export const LastWeekDataStrip = ({ activity }) => {
    const orientationState = useOrientation();
    const activitiesData = useActivityData(activity.name);
    const lastWeekData = useMemo(() => getLastWeekData(activity.name, activitiesData), [activity.name, activitiesData]);

    return (
        <>
            <div className={classNames("absolute flex justify-center w-fit", {
                "bottom-28 m-auto text-center left-0 right-0": orientationState.angle === 0,
                "top-0 m-auto right-0": orientationState.angle === 90 || orientationState.angle === 270,
            })}>
                {lastWeekData.map((item) => {
                    return (
                        <div
                            key={item.name}
                            className={classNames("py-1 px-4")}>
                            <p>{item.duration}</p>
                            <p>{item.name.slice(0, 1)}</p>
                        </div>
                    )
                })}
            </div>
            <div>
                {activitiesData
                    .filter(item => {
                        return (
                            isSameDay(new Date(item.start), new Date()) &&
                            item.end > 0 &&
                            (item.end - item.start) > 60 * 1000
                        );
                    })
                    .sort((a, b) => b.end - b.start - (a.end - a.start))
                    .slice(0, 4)
                    .map(item => {
                        return (
                            <p
                                key={item.start}
                                className="flex text-xs opacity-40 justify-between">
                                {new Intl.DateTimeFormat('en-GB', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                })
                                    .format(new Date(roundToNearestMinutes(item.start, { nearestTo: 5 })))
                                    .split(',')
                                    .map((item, index) => {
                                        return <span className="first-of-type:mr-4" key={index}>{item}</span>
                                    })}
                                <span>-</span>
                                <span>
                                    {new Intl.DateTimeFormat('en-GB', {
                                        hour: 'numeric',
                                        minute: 'numeric',
                                    }).format(new Date(roundToNearestMinutes(item.end, { nearestTo: 5 })))}
                                </span>
                            </p>
                        )
                    })}
            </div>
        </>
    );
};
