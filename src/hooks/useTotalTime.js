import {useEffect, useState} from "react";
import {add, isThisMonth, isThisWeek, isThisYear, isToday} from "date-fns";
import {sortActivitiesByOrder} from "../utils/activities";
import {Activities} from "../constants/activities";

const ACTIVITY_MIN_TIME = 2 * 60 * 1000;

export function useTotalTime({activities, allActivitiesData, dateFrame, timeFrame, inactiveColors}) {
    // TODO: Two different hooks
    const [totalTime, setTotalTime] = useState(0);
    const [sortedActivities, setSortedActivities] = useState([]);
    const [unsortedActivities, setUnsortedActivities] = useState([]);

    useEffect(() => {
        const data = [];
        let todayActivitiesTotalTime = 0;
        setUnsortedActivities([]);

        for (let i = 0; i < allActivitiesData.length; i++) {
            const activity = activities[i];
            const todayCompletedActivities = allActivitiesData[i].filter(item => {
                const isBelowMinTime = item.end - item.start < ACTIVITY_MIN_TIME;
                const activityColor = Activities.find(a => a.name === item.name).color;

                if (item.end === 0 || !item.end || isBelowMinTime)
                    return false;

                if (inactiveColors.includes(activityColor))
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

            setUnsortedActivities(prev => prev.concat(todayCompletedActivities));

            const totalTime = todayCompletedActivities.reduce((acc, item) => acc + item.end - item.start, 0);
            todayActivitiesTotalTime += totalTime;

            todayCompletedActivities.length > 0 && data.push({
                activity,
                data: todayCompletedActivities,
                totalTime
            });
        }

        const sorted = sortActivitiesByOrder(data, activities);
        setSortedActivities(sorted);
        setTotalTime(todayActivitiesTotalTime);
        setUnsortedActivities(prev => prev.sort((a, b) => a.start - b.start));

    }, [allActivitiesData, timeFrame, dateFrame, inactiveColors]);

    return {totalTime, sortedActivities, unsortedActivities};
}