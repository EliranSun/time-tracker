export const formatTimestamp = (timestamp) => {
    const hours = Math.floor(timestamp / 24 / 60 / 1000);
    const minutes = Math.floor(timestamp / 60 / 1000);
    const seconds = Math.floor(timestamp / 1000);
    
    const hoursString = hours || "00";
    const minutesString = minutes ? `:${minutes}` : ":00";
    const secondsString = seconds ? `:${seconds}` : ":00";

    return hoursString + minutesString + secondsString;;
};