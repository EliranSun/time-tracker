import {useContext, useEffect, useMemo, useState} from "react";
import {isThisMonth, isThisWeek, isThisYear, isToday, add, format, sub} from "date-fns";
import {replaceMetaThemeColor} from "../../utils/colors";
import {Timer, ArrowsOutCardinal} from "@phosphor-icons/react";
import {useTimeSwipe} from "../../hooks/useTimeSwipe";
import {round} from 'lodash';
import {ActivitiesContext} from "../../context/ActivitiesContext";
import {getAllDocsInActivity} from "../../utils/db";

const Timespans = ["days", "week", "month", "year", "all"];
const ROUND_TO = 30;

const sortActivitiesByOrder = (data, activities) => {
    return data.sort((a, b) => {
        const aOrder = activities.find(activity => activity.name === a.activity.name).order;
        const bOrder = activities.find(activity => activity.name === b.activity.name).order;

        return aOrder - bOrder;
    });
};

const getTimeString = (hours, minutes, seconds) => {
    if (hours === 0 && minutes === 0)
        return `1m`;

    return `${hours > 0 ? `${hours}h` : ""}${minutes > 0 ? `${round(minutes, -1)}m` : ""}`;
};

const formatDay = (dateFrame) => format(sub(new Date(), {days: dateFrame}), "EEEE")

export const StatsView = ({onChangePage, activities}) => {
    const [isNavigationPressed, setIsNavigationPressed] = useState(false);
    const [totalTime, setTotalTime] = useState(0);
    const [timeFrame, setTimeFrame] = useState(0);
    const [dateFrame, setDateFrame] = useState(0);
    const [allActivitiesData, setAllActivitiesData] = useContext(ActivitiesContext);
    const [sortedActivities, setSortedActivities] = useState([]);
    const [timeFrameName, setTimeFrameName] = useState(format(new Date(), "EEEE"));
    const [adjacentTimeframes, setAdjacentTimeframes] = useState({ 
            previous: "",
            next: "",
            lower: "",
            higher: ""
        });
        
    const swipeHandlers = useTimeSwipe(setDateFrame, setTimeFrame);

    useEffect(() => {
        Promise
            .all(activities.map(activity => getAllDocsInActivity(activity.name)))
            // getAllDocsInActivity()
            .then(results => {
                console.log(results);
                setAllActivitiesData(results);
            });
    }, []);

    useEffect(() => {
        // TODO: We can refactor to without an effect
        switch (true) {
            default:
            case timeFrame % 5 === 0:
                // day
                setTimeFrameName(formatDay(dateFrame));
                setAdjacentTimeframes({
                    previous: formatDay(dateFrame + 1),
                    next: formatDay(dateFrame - 1),
                    higher: "week",
                    lower: "∞"
                });
                break;

            case timeFrame % 5 === 1:
                setTimeFrameName(format(sub(new Date(), {weeks: dateFrame}), "w"));
                break;

            case timeFrame % 5 === 2:
                setTimeFrameName(format(sub(new Date(), {months: dateFrame}), "MMMM"));
                break;

            case timeFrame % 5 === 3:
                setTimeFrameName(format(sub(new Date(), {years: dateFrame}), "yyyy"));
                break;

            case timeFrame % 5 === 4:
                setTimeFrameName("∞");
                break;
        }
    }, [dateFrame, timeFrame]);

    useEffect(() => {
        const data = [];
        let todayActivitiesTotalTime = 0;

        for (let i = 0; i < allActivitiesData.length; i++) {
            const activity = activities[i];
            const todayCompletedActivities = allActivitiesData[i].filter(item => {
                if (item.end === 0 || !item.end || (item.end - item.start) < ROUND_TO / 2 * 60 * 1000)
                    return false;

                switch (true) {
                    default:
                    case timeFrame % 5 === 0:
                        const day = add(item.end, {days: dateFrame});
                        return isToday(day);

                    case timeFrame % 5 === 1:
                        const week = add(item.end, {weeks: dateFrame});
                        return isThisWeek(week);

                    case timeFrame % 5 === 2:
                        const month = add(item.end, {months: dateFrame});
                        return isThisMonth(month);

                    case timeFrame % 5 === 3:
                        const year = add(item.end, {years: dateFrame});
                        return isThisYear(year);

                    case timeFrame % 5 === 4:
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

        setSortedActivities(sorted);
        setTotalTime(todayActivitiesTotalTime);
    }, [allActivitiesData, timeFrame, dateFrame]);


    return (
        <div>
            <div 
                {...swipeHandlers}
                className="fixed flex flex-col text-white gap-2 items-center justify-center inset-x-0 bottom-5 m-auto">
                {isNavigationPressed ? <span className="bg-black">
                {adjacentTimeframes.higher}
                </span> : null}
                <div className="flex gap-2">
                 {isNavigationPressed ? <span className="bg-black">
                {adjacentTimeframes.previous}
                </span> : null}
            <button className="bg-black h-32 p-4 flex items-center flex-col text-white font-mono w-16">
                {/* <Timer size={32}/> */}
                <div className="relative">
                    <span className="absolute top-0 inset-x-0">{timeFrameName}</span>
                    <ArrowsOutCardinal size={50}/>
                </div>
            </button>
            {isNavigationPressed ? <span className="bg-black">
            {adjacentTimeframes.next}
            </span>: null}
            </div>
            {isNavigationPressed ? <span className="bg-black">
                {adjacentTimeframes.lower}
                </span> : null}
            </div>
            <div className="flex flex-col w-screen justify-evenly h-screen">
                {sortedActivities.map(({activity, data, totalTime: activityTotalTime}, index) => {
                    const normalizedHeight = activityTotalTime / totalTime * 100 + "%";
                    const hours = Math.floor(activityTotalTime / 1000 / 60 / 60);
                    const minutes = Math.floor(activityTotalTime / 1000 / 60 % 60);
                    const seconds = Math.floor(activityTotalTime / 1000 % 60);
                    const timeString = getTimeString(hours, minutes, seconds);
                    const Icon = activity.icon;

                    return (
                        <div
                            key={index}
                            onClick={() => window.history.pushState({}, "", `/stats/activity/${activity.name.toLowerCase()}`)}
                            className="flex text-right items-center justify-between text-[2.5em] min-h-[50px] py-4 px-12 font-mono"
                            style={{
                                backgroundColor: activity.color,
                                height: normalizedHeight
                            }}>
                            <h2 className="">
                                {/*{activity.name.toUpperCase().slice(0, 5)}{' '}*/}
                                <Icon/>{' '}
                            </h2>
                            <p>
                                {timeString}
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
        </div>
    )
}
    ;