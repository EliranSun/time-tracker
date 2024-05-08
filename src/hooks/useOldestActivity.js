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
                const oldestActivities = results
                    .sort((a, b) => a.lastEntryTimestamp - b.lastEntryTimestamp)
                    .filter(activity => !Activities.find(a => a.name === activity.name).isArchived);

                const oldestActivity = oldestActivities[0];
                const oldestActivityName = oldestActivity?.name;

                console.log({oldestActivities, oldestActivity});
                
                setOldestActivityName(oldestActivityName);
                localStorage.setItem(OLDEST_ACTIVITY_KEY, oldestActivityName);
                return oldestActivityName;
            })
            .catch(error => {
                alert(error.message);
                const result = Activities[random(0, Activities.length - 1)]?.name;
                setOldestActivityName(result);
                localStorage.setItem(OLDEST_ACTIVITY_KEY, oldestActivityName);
                return result;
            });
    }, []);

    return oldestActivityName;
}