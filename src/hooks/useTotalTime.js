import { useEffect, useState } from "react";
import { add, isThisMonth, isThisWeek, isThisYear, isToday } from "date-fns";
import { sortActivitiesByOrder } from "../utils/activities";

const ROUND_TO = 10;

export function useTotalTime({ activities, allActivitiesData, dateFrame, timeFrame, shouldFilterSleep }) {
    // TODO: Two different hooks
    const [totalTime, setTotalTime] = useState(0);
    const [sortedActivities, setSortedActivities] = useState([]);

    useEffect(() => {
        const data = [];
        let todayActivitiesTotalTime = 0;

        for (let i = 0; i < allActivitiesData.length; i++) {
            const activity = activities[i];
            const todayCompletedActivities = allActivitiesData[i].filter(item => {
                if (item.end === 0 || !item.end || (item.end - item.start) < (ROUND_TO * 60 * 1000))
                    return false;

                if (shouldFilterSleep && activity.name === "Sleep")
                    return false;

                switch (true) {
                    default:
                    case timeFrame % 5 === 0:
                        const day = add(item.end, { days: dateFrame });
                        return isToday(day);

                    case timeFrame % 5 === 1:
                        const week = add(item.end, { weeks: dateFrame });
                        return isThisWeek(week);

                    case timeFrame % 5 === 2:
                        const month = add(item.end, { months: dateFrame });
                        return isThisMonth(month);

                    case timeFrame % 5 === 3:
                        const year = add(item.end, { years: dateFrame });
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

        // const firstActivityColor = sorted[0]?.activity.color;
        // replaceMetaThemeColor(firstActivityColor);

        setSortedActivities(sorted);
        setTotalTime(todayActivitiesTotalTime);
    }, [allActivitiesData, timeFrame, dateFrame, shouldFilterSleep]);

    return { totalTime, sortedActivities };
}