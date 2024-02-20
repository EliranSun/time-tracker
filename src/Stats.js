import { useEffect, useState } from "react";
import { getAllDocsInActivity } from "./utils/activities";
import { isThisMonth, isThisWeek, isThisYear, isToday, roundToNearestMinutes } from "date-fns";

const Timespans = ["today", "this week", "this month", "this year", "all"];
const ROUND_TO = 60;

export const StatsView = ({ onChangePage, activities }) => {
    const [timespanIndex, setTimespanIndex] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [fetchedActivities, setFetchedActivities] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = [];
            let todayActivitiesTotalTime = 0;

            const activityData = await Promise.all(activities.map(activity => getAllDocsInActivity(activity.name)));


            for (let i = 0; i < activityData.length; i++) {
                const activity = activities[i];
                const todayCompletedActivities = activityData[i].filter(item => {
                    if (item.end === 0 || !item.end || (item.end - item.start) < ROUND_TO * 60 * 1000)
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

            setFetchedActivities(data);
            setTotalTime(todayActivitiesTotalTime);
        };

        fetchData();
    }, [timespanIndex]);

    // .filter(item => item.activity.name === "Pets")

    const getTimeString = (hours, minutes, seconds) => {
        if (hours === 0 && minutes === 0)
            return `1m`;

        const date = new Date(1,1,1970,hours,minutes,seconds);
        const roundedDate = roundToNearestMinutes(date, { nearestTo: ROUND_TO });
        const roundedHours = roundedDate.getHours();
        const roundedMinutes = roundedDate.getMinutes();
        return `${roundedHours > 0 ? `${roundedHours}h` : ""}${roundedMinutes > 0 ? `${roundedMinutes}m` : ""}`;
    };

    return (
        <>
            <button className="fixed top-0 right-0 bg-white px-4 py-1 w-32 text-black" onClick={() => {
                setTimespanIndex((timespanIndex + 1) % Timespans.length);
            }}>
                {Timespans[timespanIndex]}
            </button>
            <div className="flex flex-col w-screen justify-evenly h-screen">
                {fetchedActivities.sort((a, b) => {
                    const aOrder = activities.find(activity => activity.name === a.activity.name).order;
                    const bOrder = activities.find(activity => activity.name === b.activity.name).order;

                    return aOrder - bOrder;
                }).map(({ activity, data, totalTime: activityTotalTime }, index) => {
                    const normalizedHeight = activityTotalTime / totalTime * 100 + "%";
                    const hours = Math.floor(activityTotalTime / 1000 / 60 / 60);
                    const minutes = Math.floor(activityTotalTime / 1000 / 60 % 60);
                    const seconds = Math.floor(activityTotalTime / 1000 % 60);

                    return (
                        <div
                            key={index}
                            className="flex items-center justify-center text-5xl flex-shrink min-h-20 px-4 flex-grow"
                            style={{
                                backgroundColor: activity.color,
                                height: normalizedHeight
                            }}>
                            <h2 className="font-mono h-fit">
                                {activity.name.toUpperCase()}{' '}
                                {getTimeString(hours, minutes, seconds)}
                            </h2>
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