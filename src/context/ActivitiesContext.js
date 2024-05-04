import {createContext, useEffect, useState} from "react";
import {getAllDocsInActivity, getUserActivities} from "../utils/db";
import {Activities} from "../constants/activities";

export const ActivitiesContext = createContext(
    []
);

export const ActivitiesProvider = ({children}) => {
    const [allActivities, setAllActivities] = useState([]);

    // TODO: Activity by name for O(1) fetching
    useEffect(() => {
        // Promise
        //     .all(Activities.map(activity => getAllDocsInActivity(activity.name)))
        //     .then(results => {
        //         setAllActivities(results);
        //     });

        getUserActivities().then(activities => {
            setAllActivities(activities);
        });
    }, []);

    return (
        <ActivitiesContext.Provider value={[allActivities, setAllActivities]}>
            {children}
        </ActivitiesContext.Provider>
    );
};
