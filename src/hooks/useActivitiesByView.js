import {useMemo} from "react";
import {add, isThisMonth, isThisWeek, isThisYear, isToday} from "date-fns";
import {Activities, ACTIVITY_MINIMUM_TIME} from "../constants/activities";
import {formatTimestamp} from "../utils/time";

const getCompletedItemsInActivityInScope = (allActivityData = [], dateFrame, timeFrame) => {
    // allActivitiesData = [
    //      [{ name: "Atly", start: 0, end: 0 }, { name: "Atly" start: 0, end: 0 }], 
    //      [{ name: "Games", start: 0, end: 0 }, { name: "Games", start: 0, end: 0 }],
    //      [...],
    // ]
    return allActivityData.filter(item => {
        const isTimeBelowMinimum = item.end - item.start < ACTIVITY_MINIMUM_TIME;

        if (item.end === 0 || !item.end || isTimeBelowMinimum)
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
};

export function useActivitiesByColorOrder({allActivitiesData = [], dateFrame, timeFrame}) {
    return useMemo(() => {
        const data = [];

        for (const activityData of allActivitiesData) {
            if (!activityData || activityData.length === 0)
                continue;

            const completedItems = getCompletedItemsInActivityInScope(activityData, dateFrame, timeFrame);
            const totalTime = completedItems.reduce((acc, item) => acc + item.end - item.start, 0);
            const activity = Activities.find(activity => activity.name === activityData[0].name);

            if (completedItems.length > 0) {
                data.push({
                    activity,
                    data: completedItems,
                    totalTime
                });
            }
        }

        return data.sort((a, b) => a.activity.order - b.activity.order);
    }, [allActivitiesData, dateFrame, timeFrame]);
}

export function useActivitiesByTime({allActivitiesData, dateFrame, timeFrame}) {
    return useMemo(() => {
        const data = [];

        for (const activityData of allActivitiesData) {
            if (!activityData || activityData.length === 0)
                continue;

            // all X activity items
            const completedItems = getCompletedItemsInActivityInScope(activityData, dateFrame, timeFrame);
            if (completedItems.length > 0) {
                data.push(...completedItems.map(item => ({
                    activity: Activities.find(activity => activity.name === item.name),
                    start: item.start,
                    end: item.end,
                    totalTime: item.end - item.start
                })));
            }
        }

        return data.sort((a, b) => a.start - b.start);
    }, [allActivitiesData, dateFrame, timeFrame]);
}

// data = [
//      [{ name: "Atly", start: 0, end: 0 }, { name: "Atly" start: 0, end: 0 }], 
//      [{ name: "Games", start: 0, end: 0 }, { name: "Games", start: 0, end: 0 }],
//      [...],
// ]
export function useTotalTime({data = [], dateframe, timeframe}) {
    return useMemo(() => {
        let totalTime = 0;

        for (const activity of data) {
            const completedItems = getCompletedItemsInActivityInScope(activity, dateframe, timeframe);

            for (const item of completedItems) {
                if (item.end === 0 || !item.end || item.end < item.start || item.start === 0 || !item.start)
                    continue;

                totalTime += item.end - item.start;
            }
        }

        return totalTime;
    }, [data, dateframe, timeframe]);
}

export function useTimeSum({data, timeFrame, dateFrame}) {
    return useMemo(() => {
        let timeSum = 0;

        for (const activity of data) {
            const completedItems = getCompletedItemsInActivityInScope(activity, dateFrame, timeFrame);

            for (const item of completedItems) {
                if (item.end === 0 || !item.end || item.end < item.start || item.start === 0 || !item.start)
                    continue;

                timeSum += item.end - item.start;
            }
        }

        return formatTimestamp(timeSum);
    }, [data, timeFrame, dateFrame]);
}