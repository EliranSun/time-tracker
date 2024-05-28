import {format, addDays, isSameDay, isBefore, startOfWeek} from "date-fns";
import {round} from 'lodash';
import {ACTIVITY_MINIMUM_TIME} from "../constants/activities";

export const getConsequentialWeekData = (data = []) => {
    if (data.length === 0) {
        console.info("No data for consequential week");
        return [];
    }

    const consequenceData = [];
    let currentDay = data[0].end;
    const lastDay = data.at(-1).end;

    const WHOLE_DAY = 24 * 60 * 60 * 1000;

    while (lastDay - currentDay > -WHOLE_DAY) {
        const dayData = data.filter(item => {
            return isSameDay(new Date(item.end), currentDay) && item.end > 0
        });

        const duration = Math.round(dayData.reduce((acc, item) => {
            return acc + item.end - item.start;
        }, 0) / 60 / 60 / 1000);

        consequenceData.push({
            duration,
            dayName: format(currentDay, 'EEEEE')
        });

        currentDay = addDays(currentDay, 1);
    }

    return consequenceData;
};

export const getWeekData = (name, data, isLastWeek = true) => {
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
        let minutes = round(Math.floor((duration % 3600000) / 60000), -1);

        if (minutes === 60) {
            minutes = 0;
            hours++;
        }

        let measuredMinutes = 0;
        if (hours <= 0) {
            measuredMinutes = minutes;
        }

        const measure = Math.round(hours + (measuredMinutes / 60));
        minutes = minutes < 10 ? `${minutes}0` : minutes;
        totalCount += measure;

        return {
            ...day,
            measure,
            shortDuration: hours > 0
                ? `${Math.round(hours + minutes / 60)}h`
                : minutes > 0
                    ? `${minutes}m`
                    : "",
            duration: {
                hours,
                minutes,
            }
        }
    });

    return {
        data: weekData,
        totalActivitiesMeasure: Math.floor(totalCount),
    };
};

export const formatDuration = (duration) => {
    if (!duration)
        return "";

    let hours = Math.floor(duration / 3600000);
    let minutes = round(Math.floor((duration % 3600000) / 60000), -1);

    return hours > 0
        ? `${Math.round(hours + minutes / 60)}h`
        : minutes > 0
            ? `${minutes}m`
            : ""
};

export const formatForTimeInput = (duration) => {
    if (!duration)
        return "";

    let hours = Math.floor(duration / 3600000);
    let minutes = Math.floor((duration % 3600000) / 60000);

    return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
}

export const getLastSession = (name = "", data = []) => {
    if (!name || data.length === 0) {
        return "No entries";
    }

    const lastSession = data
        .filter(item => item.end > 0 && item.end - item.start > ACTIVITY_MINIMUM_TIME)
        .sort((a, b) => b.start - a.start)
        ?.at(0);
    const start = lastSession?.start;
    const end = lastSession?.end;

    if (!start || !end) {
        return formatDuration(0);
    }

    const duration = end - start;
    return formatDuration(duration || 0);
};