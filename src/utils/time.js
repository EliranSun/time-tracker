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