export const formatTimestamp = (timestamp) => {
    const hours = Math.floor(timestamp / 3600);
    const minutes = Math.floor((timestamp - hours * 3600) / 60);
    const seconds = timestamp - hours * 3600 - minutes * 60;

    let timeString = "";
    
    if (hours > 0) timeString += hours;
    if (minutes > 0) timeString += `:{minutes}`;
    if (seconds > 0) timeString += `:{seconds}`;

    return timeString;
};