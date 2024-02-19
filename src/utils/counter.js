export const formatCounter = (lastTime) => {
    const counter = parseInt((new Date().getTime() - lastTime) / 1000);
    const hours = Math.floor(counter / 3600);
    const minutes = Math.floor((counter - hours * 3600) / 60);
    const seconds = counter - hours * 3600 - minutes * 60;

    return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}