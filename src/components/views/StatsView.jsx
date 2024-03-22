import {useContext, useEffect, useState} from "react";
import {isThisMonth, isThisWeek, isThisYear, isToday, add, format, sub} from "date-fns";
import {replaceMetaThemeColor} from "../../utils/colors";
import {useTimeSwipe} from "../../hooks/useTimeSwipe";
import {round} from 'lodash';
import {ActivitiesContext} from "../../context/ActivitiesContext";
import {getAllDocsInActivity} from "../../utils/db";
import {CardinalNavigation} from "../organisms/CardinalNavigation";
import classNames from "classnames";

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

const formatDay = (dateFrame) => format(sub(new Date(), {days: dateFrame}), "EEEE");
const formatWeek = (dateFrame) => `week ${format(sub(new Date(), {weeks: dateFrame}), "w")}`;
const formatMonth = (dateFrame) => format(sub(new Date(), {months: dateFrame}), "MMMM");
const formatYear = (dateFrame) => format(sub(new Date(), {years: dateFrame}), "yyyy");

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

    const swipeHandlers = useTimeSwipe((newDateFrame) => {
        setDateFrame(newDateFrame);
    }, (newTimeFrame) => {
        setTimeFrame(newTimeFrame);
        setDateFrame(0);
    });

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
                // week
                setTimeFrameName(formatWeek(dateFrame));
                setAdjacentTimeframes({
                    previous: formatWeek(dateFrame + 1),
                    next: formatWeek(dateFrame - 1),
                    higher: "month",
                    lower: "day"
                });
                break;

            case timeFrame % 5 === 2:
                // month
                setTimeFrameName(formatMonth(dateFrame));
                setAdjacentTimeframes({
                    previous: formatMonth(dateFrame + 1),
                    next: formatMonth(dateFrame - 1),
                    higher: "year",
                    lower: "week"
                });
                break;

            case timeFrame % 5 === 3:
                // year
                setTimeFrameName(formatYear(dateFrame));
                setAdjacentTimeframes({
                    previous: formatYear(dateFrame + 1),
                    next: formatYear(dateFrame - 1),
                    higher: "∞",
                    lower: "month"
                });
                break;

            case timeFrame % 5 === 4:
                // all
                setTimeFrameName("all");
                setAdjacentTimeframes({
                    previous: "∞",
                    next: "∞",
                    higher: "day",
                    lower: "year"
                });
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

        // replaceMetaThemeColor(firstActivityColor);

        setSortedActivities(sorted);
        setTotalTime(todayActivitiesTotalTime);
    }, [allActivitiesData, timeFrame, dateFrame]);


    return (
        <>
            <div className="flex flex-col w-screen justify-evenly h-[90vh] px-2 overflow-hidden">
                {sortedActivities.map(({activity, data, totalTime: activityTotalTime}, index) => {
                    const normalizedHeight = activityTotalTime / totalTime * 100 + "%";
                    const hours = Math.floor(activityTotalTime / 1000 / 60 / 60);
                    const minutes = Math.floor(activityTotalTime / 1000 / 60 % 60);
                    const seconds = Math.floor(activityTotalTime / 1000 % 60);
                    const timeString = getTimeString(hours, minutes, seconds);
                    const Icon = activity.icon;
                    const isLast = index === sortedActivities.length - 1;
                    const isFirst = index === 0;
                    const onClick = () => window.history.pushState({}, "", `/stats/activity/${activity.name.toLowerCase()}`);

                    return (
                        <div
                            key={index}
                            className={classNames({
                                "flex text-right items-center justify-between text-[2.5em] min-h-[50px] py-4 px-12 font-mono": true,
                                "rounded-b-3xl": isLast,
                                "rounded-t-3xl": isFirst,
                            })}
                            style={{
                                backgroundColor: activity.color,
                                height: normalizedHeight
                            }}>
                            <Icon onClick={onClick}/>
                            <p>{timeString}</p>
                        </div>
                    );
                })}
            </div>
            <CardinalNavigation
                setAdjacentTimeframes={setAdjacentTimeframes}
                adjacentTimeframes={adjacentTimeframes}
                timeFrameName={timeFrameName}
                swipeHandlers={swipeHandlers}/>
        </>
    )
};