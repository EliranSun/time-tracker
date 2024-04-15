import {format, formatDuration, startOfWeek, endOfWeek, sub} from "date-fns";
import {round} from "lodash";
import {Timeframes} from "../constants/time";

const ONE_HOUR = 60 * 60;

export const formatTimestamp = (timestampDiff) => {
    const durationSeconds = timestampDiff / 1000;

    const hours = Math.floor(durationSeconds / ONE_HOUR);
    const minutes = Math.floor((durationSeconds - hours * ONE_HOUR) / 60);
    const seconds = Math.floor((durationSeconds - hours * ONE_HOUR - minutes * 60));

    const hoursString = hours || "00";
    let minutesString = ":00";
    let secondsString = ":00";

    if (minutes > 0)
        if (minutes < 10) minutesString = `:0${minutes}`;
        else minutesString = `:${minutes}`;

    if (seconds > 0)
        if (seconds < 10) secondsString = `:0${seconds}`;
        else secondsString = `:${seconds}`;

    return hoursString + minutesString + secondsString;
};

export const formatDay = (dateFrame) => format(sub(new Date(), {days: dateFrame}), "EEEE");

export const formatWeek = (dateFrame) => {
    const date = sub(new Date(), {weeks: dateFrame});
    const start = startOfWeek(date, {weekStartsOn: 0});
    const end = endOfWeek(date, {weekStartsOn: 0});

    return `${format(start, 'd')}-${format(end, 'd MMM')}`;
};

export const formatMonth = (dateFrame) => format(sub(new Date(), {months: dateFrame}), "MMMM");

export const formatYear = (dateFrame) => format(sub(new Date(), {years: dateFrame}), "yyyy");

export const getTimeString = (activityTotalTime, timeFrame = Timeframes.DAY) => {
    const hours = (activityTotalTime / 1000 / 60 / 60);
    const minutes = (activityTotalTime / 1000 / 60 % 60); // get the remainder of the hours

    const roundedHours = Math.floor(hours);
    const roundedMinutes = Math.round(round(minutes, -1)); // round to the nearest 10

    if (activityTotalTime === 0) {
        return "";
    }

    if (roundedHours === 0) {
        if (timeFrame > Timeframes.DAY) {
            return `<1h`;
        }

        return `${roundedMinutes}m`;
    }

    if (roundedMinutes === 60) {
        return `${roundedHours + 1}h`;
    }

    if (roundedMinutes === 0) {
        return `${roundedHours}h`;
    }

    return `${roundedHours}h${roundedMinutes}m`;
};