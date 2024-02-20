export const formatTimestamp = (timestamp) => {
    const hours = Math.floor(timestamp / 360000);
    const minutes = Math.floor((timestamp - hours * 360000) / 60);
    const seconds = timestamp - hours * 360000 - minutes * 60;
    
    const hoursString = hours || "00";
    const minutesString = minutes ? `:${minutes}` : ":00";
    const secondsString = seconds ? `:${seconds}` : ":00";

    return hoursString + minutesString + secondsString;;
};