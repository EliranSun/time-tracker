import {useEffect, useState} from "react";
import {getNewestInEachActivity} from "../utils/db";
import {Activities} from "../constants/activities";
import {random} from "lodash";

const OLDEST_ACTIVITY_KEY = "oldestActivity";
export const useOldestActivity = () => {
    const [oldestActivityName, setOldestActivityName] = useState(localStorage.getItem(OLDEST_ACTIVITY_KEY) || "");


    useEffect(() => {
        getNewestInEachActivity()
            .then(results => {
                const oldestActivity = results.sort((a, b) => a.lastEntryTimestamp - b.lastEntryTimestamp)[0];
                const oldestActivityName = oldestActivity?.name;
                setOldestActivityName(oldestActivityName);
                localStorage.setItem(OLDEST_ACTIVITY_KEY, oldestActivityName);
                return oldestActivityName;
            })
            .catch(error => {
                console.error(error);
                const result = Activities[random(0, Activities.length - 1)]?.name;
                setOldestActivityName(result);
                localStorage.setItem(OLDEST_ACTIVITY_KEY, oldestActivityName);
                return result;
            });
    }, []);

    return oldestActivityName;
}