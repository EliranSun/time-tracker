import {addDays, isSameDay, roundToNearestMinutes, startOfWeek} from "date-fns";
import {formatTimestamp} from "./time";

export const getLastWeekData = (name, data) => {
    const activityData = data;
    const week = [{
        name: "Sunday",
        duration: "",
    }, {
        name: "Monday",
        duration: "",
    }, {
        name: "Tuesday",
        duration: "",
    }, {
        name: "Wednesday",
        duration: "",
    }, {
        name: "Thursday",
        duration: "",
    }, {
        name: "Friday",
        duration: "",
    }, {
        name: "Saturday",
        duration: "",
    }];

    if (!name || data.length === 0 || !activityData) {
        return {data: week, totalActivitiesMeasure: 0};
    }

    let totalCount = 0;
    const weekData = week.map((day, index) => {
        const weekStart = startOfWeek(new Date(), {weekStartsOn: 0});
        const targetDay = addDays(weekStart, index);
        const dayData = activityData.filter(item => {
            return isSameDay(new Date(item.end), targetDay) && item.end > 0
        });

        const duration = dayData.reduce((acc, item) => {
            return acc + item.end - item.start;
        }, 0);

        let hours = Math.floor(duration / 3600000);
        let minutes = roundToNearestMinutes(Math.floor((duration % 3600000) / 60000), {nearestTo: 10});

        if (minutes >= 30) {
            hours++;
        }

        let measuredMinutes = 0;
        if (hours <= 0) {
            measuredMinutes = Math.floor(minutes / 10);
        }

        const measure = hours + (measuredMinutes / 60);
        minutes = minutes < 10 ? `${minutes}0` : minutes;
        totalCount += measure;

        return {
            ...day,
            measure,
            duration: hours === 0 && minutes === 0 ? "" :
                `${hours > 0 ? `${hours}h` : ""}${minutes > 0 ? `${minutes}m` : ""}`,
        }
    });

    return {
        data: weekData,
        totalActivitiesMeasure: Math.floor(totalCount),
    };
};
export const getLastSession = (name = "", data = []) => {
    if (!name || data.length === 0) {
        return "No entries";
    }

    const lastSession = data
        .filter(item => item.end > 0 && item.end - item.start > 60 * 1000)
        .sort((a, b) => b.start - a.start)
        ?.at(0);
    const start = lastSession?.start;
    const end = lastSession?.end;

    if (!start || !end) {
        return formatTimestamp(0);
    }

    const duration = end - start;
    return formatTimestamp(duration || 0);
};