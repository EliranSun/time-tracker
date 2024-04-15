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
export const getTimeString = (hours, minutes, timeFrame = Timeframes.DAY) => {
    // const days = Math.floor(hours / 24);
    // let remainingHours = hours % 24;
    // let remainingMinutes = round(minutes % 60, -1);
    //
    // const daysString = days ? `${days}d` : "";
    // const minutesString = remainingMinutes ? `${remainingMinutes}m` : "";
    // let hoursString = remainingHours ? `${remainingHours}h` : "";
    //
    // if (timeFrame < Timeframes.MONTH) {
    //     return `${daysString}${hoursString}${minutesString}`;
    // }
    //
    // if (remainingMinutes > 30) {
    //     remainingHours++;
    // }
    //
    // hoursString = remainingHours ? `${remainingHours}h` : "";

    const roundedHours = Math.round(hours);
    const roundedMinutes = Math.round(round(minutes, -1));
    if (roundedHours === 0) {
        return `<1h`;
    }
    //
    // return `${daysString}${hoursString}`;

    return `${roundedHours}h${roundedMinutes}m`;
};