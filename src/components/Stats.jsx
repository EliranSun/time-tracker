import {useEffect, useMemo, useState} from "react";
import {getAllDocsInActivity} from "../utils/activities";
import {isThisMonth, isThisWeek, isThisYear, isToday, roundToNearestMinutes} from "date-fns";
import {replaceMetaThemeColor} from "../utils/colors";
import {Calendar} from "@phosphor-icons/react";

const Timespans = ["today", "week", "month", "year", "all"];
const ROUND_TO = 30;

const sortActivitiesByOrder = (data, activities) => {
    return data.sort((a, b) => {
        const aOrder = activities.find(activity => activity.name === a.activity.name).order;
        const bOrder = activities.find(activity => activity.name === b.activity.name).order;

        return aOrder - bOrder;
    });
}

export const StatsView = ({onChangePage, activities}) => {
    const [timespanIndex, setTimespanIndex] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [fetchedActivities, setFetchedActivities] = useState([]);

    useEffect(() => {
        const data = [];
        let todayActivitiesTotalTime = 0;

        Promise.all(activities.map(activity => getAllDocsInActivity(activity.name))).then(activityData => {
            for (let i = 0; i < activityData.length; i++) {
                const activity = activities[i];
                const todayCompletedActivities = activityData[i].filter(item => {
                    if (item.end === 0 || !item.end || (item.end - item.start) < ROUND_TO / 2 * 60 * 1000)
                        return false;

                    switch (timespanIndex) {
                        default:
                        case 0:
                            return isToday(item.start);
                        case 1:
                            return isThisWeek(item.start);
                        case 2:
                            return isThisMonth(item.start);
                        case 3:
                            return isThisYear(item.start);
                        case 4:
                            return true;
                    }
                });
                const totalTime = todayCompletedActivities.reduce((acc, item) => acc + item.end - item.start, 0);
                todayActivitiesTotalTime += totalTime;

                todayCompletedActivities.length > 0 && data.push({
                    activity,
                    data: todayCompletedActivities,
                    totalTime
                });
            }

            const sorted = sortActivitiesByOrder(data, activities);
            const firstActivityColor = sorted[0]?.activity.color;

            replaceMetaThemeColor(firstActivityColor);

            setFetchedActivities(sorted);
            setTotalTime(todayActivitiesTotalTime);
        });
    }, [timespanIndex]);

    // .filter(item => item.activity.name === "Pets")

    const getTimeString = (hours, minutes, seconds) => {
        if (hours === 0 && minutes === 0)
            return `1m`;

        const date = new Date(1, 1, 1970, hours, minutes, seconds);
        const roundedDate = roundToNearestMinutes(date, {nearestTo: ROUND_TO});
        const roundedHours = roundedDate.getHours();
        const roundedMinutes = roundedDate.getMinutes();
        return `${roundedHours > 0 ? `${roundedHours}h` : ""}${roundedMinutes > 0 ? `${roundedMinutes}m` : ""}`;
    };

    return (
        <>
            <button
                className="fixed bottom-3 right-5 m-auto p-4 flex items-center flex-col text-white font-mono w-16"
                onClick={() => {
                    setTimespanIndex((timespanIndex + 1) % Timespans.length);
                }}>
                <Calendar size={32}/>
                {Timespans[timespanIndex]}
            </button>
            <div className="flex flex-col w-screen justify-evenly h-screen">
                {fetchedActivities.map(({activity, data, totalTime: activityTotalTime}, index) => {
                    const normalizedHeight = activityTotalTime / totalTime * 100 + "%";
                    const hours = Math.floor(activityTotalTime / 1000 / 60 / 60);
                    const minutes = Math.floor(activityTotalTime / 1000 / 60 % 60);
                    const seconds = Math.floor(activityTotalTime / 1000 % 60);

                    return (
                        <div
                            key={index}
                            className="flex text-right items-center justify-between text-[2.5em] min-h-[50px] py-4 px-12 font-mono"
                            style={{
                                backgroundColor: activity.color,
                                height: normalizedHeight
                            }}>
                            <h2 className="">
                                {activity.name.toUpperCase()}{' '}
                            </h2>
                            <p>
                                {getTimeString(hours, minutes, seconds)}
                            </p>
                            {/*<div>*/}
                            {/*    {activity.data.map((data, index) => {*/}
                            {/*        const timeElapsed = data.end ? Math.round((data.end - data.start) / 1000) : 0;*/}

                            {/*        if (timeElapsed === 0)*/}
                            {/*            return null;*/}

                            {/*        return (*/}
                            {/*            <div key={index}>*/}
                            {/*                {timeElapsed} seconds*/}
                            {/*                on {new Date(data.start).toLocaleDateString("en-GB", {*/}
                            {/*                timeZone: "UTC",*/}
                            {/*            })}*/}
                            {/*            </div>*/}
                            {/*        )*/}
                            {/*    })}*/}
                            {/*</div>*/}
                        </div>
                    );
                })}
            </div>
        </>
    )
};