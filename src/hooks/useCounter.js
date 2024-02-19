import { useEffect, useState } from "react";
import { formatCounter } from "../utils/counter";

export const useCounter = (activityName) => {
    const [counter, setCounter] = useState(0);

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
        counter,
    };
};
