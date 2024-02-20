export const formatTimestamp = (timestamp) => {
    const hours = Math.floor(counter / 3600);
    const minutes = Math.floor((counter - hours * 3600) / 60);
    const seconds = counter - hours * 3600 - minutes * 60;

    let timeString = "";
    
    if (hours > 0) timeString += hours;
    if (minutes > 0) timeString += `:{minutes}`;
    if (seconds > 0) timeString += `:{seconds}`;

    return timeString;
};