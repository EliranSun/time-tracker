import { useEffect, useState } from "react";

const formatCounter = (lastTime) => {
    const counter = parseInt((new Date().getTime() - lastTime) / 1000);
    const hours = Math.floor(counter / 3600);
    const minutes = Math.floor((counter - hours * 3600) / 60);
    const seconds = counter - hours * 3600 - minutes * 60;

    return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export const useCounter = (activityName, lastTime) => {
    const [_counter, setCounter] = useState(0);

    useEffect(() => {
        if (activityName) {
            // ticking here does not really affect the counter, just updates the state,
            // which triggers now() - startTime in the formatCounter function
            const interval = setInterval(() => {
                setCounter(prev => prev + 1);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [activityName]);

    return {
        counter: formatCounter(lastTime),
    };
};
