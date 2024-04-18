import {useEffect, useMemo, useState} from "react";
import {add, isThisMonth, isThisWeek, isThisYear, isToday} from "date-fns";
import {sortActivitiesByOrder} from "../utils/activities";
import {ViewTypes} from "../constants/views";
import {Activities} from "../constants/activities";
import {formatTimestamp} from "../utils/time";

const ACTIVITY_MIN_TIME = 2 * 60 * 1000;

const getCompletedItemsInActivityInScope = (allActivityData = [], dateFrame, timeFrame) => {
    // allActivitiesData = [
    //      [{ name: "Atly", start: 0, end: 0 }, { name: "Atly" start: 0, end: 0 }], 
    //      [{ name: "Games", start: 0, end: 0 }, { name: "Games", start: 0, end: 0 }],
    //      [...],
    // ]
    return allActivityData.filter(item => {
        const isTimeBelowMinimum = item.end - item.start < ACTIVITY_MIN_TIME;

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

export function useActivitiesByColorOrder({allActivitiesData, dateFrame, timeFrame}) {
    return useMemo(() => {
        const data = [];
        const activity = Activities.find(activity => activity.name === allActivitiesData[0].name);

        for (const activityData of allActivitiesData) {
            const completedItems = getCompletedItemsInActivityInScope(activityData, dateFrame, timeFrame);

            if (completedItems.length > 0) {
                data.push({
                    activity,
                    data: completedItems,
                    totalTime: completedItems.reduce((acc, item) => acc + item.end - item.start, 0),
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
            const completedItems = getCompletedItemsInActivityInScope(activityData, dateFrame, timeFrame);
            data.push([...data, ...completedItems]);
        }

        return data.sort((a, b) => a.start - b.start);
    }, [allActivitiesData, dateFrame, timeFrame]);
}

// data = [
//      [{ name: "Atly", start: 0, end: 0 }, { name: "Atly" start: 0, end: 0 }], 
//      [{ name: "Games", start: 0, end: 0 }, { name: "Games", start: 0, end: 0 }],
//      [...],
// ]
export function useTotalTime(data = []) {
    return useMemo(() => {
        return data.reduce((dataAcc, item) => item.reduce((acc, curr) => acc + curr.end - curr.start, 0) + dataAcc, 0);
    }, [data]);
}

export function useTimeSum(items) {
    return useMemo(() => {
        const totalTimestamp = items.reduce((acc, curr) => acc + curr.totalTime, 0);
        return formatTimestamp(totalTimestamp);
    }, [items]);
}