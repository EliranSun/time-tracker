import { useEffect, useState } from "react";

export const useCounter = (activityName) => {
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        if (activityName) {
            const interval = setInterval(() => {
                setCounter(prev => {
                    const lastTickTimestamp = Number(localStorage.getItem('lastTickTimestamp'));
                    const timeElapsed = Date.now() - lastTickTimestamp;

                    if (lastTickTimestamp && timeElapsed > 2000) {
                        alert('timeElapsed in seconds: ' + (timeElapsed / 1000));
                        localStorage.setItem('lastTickTimestamp', Date.now().toString());
                        return prev + Math.floor(timeElapsed / 1000);
                    }

                    return prev + 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [activityName]);

    return {
        counter,
        add: () => setCounter(prev => prev + 60),
        subtract: () => setCounter(prev => prev - 60 <= 0 ? 0 : prev - 60),
        setCounter: newCounterState => {
            if (!newCounterState) {
                localStorage.removeItem('lastTickTimestamp');
            }

            setCounter(newCounterState);
        }
    };
};
