const ONE_HOUR = 60 * 60;

export const formatTimestamp = (timestampDiff) => {
    const durationSeconds = timestampDiff / 1000;
    
    const hours = Math.floor(durationSeconds / ONE_HOUR);
    const minutes = Math.floor((durationSeconds - hours * ONE_HOUR) / 60);
    const seconds = Math.floor((durationSeconds - hours * ONE_HOUR - minutes * 60));
    
    const hoursString = hours || "00";
    const minutesString = minutes ? `:${minutes}` : ":00";
    const secondsString = seconds ? `:${seconds}` : ":00";

    return hoursString + minutesString + secondsString;;
};