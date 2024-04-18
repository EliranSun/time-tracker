import {createContext, useEffect, useState} from "react";
import {getAllDocsInActivity} from "../utils/db";
import {Activities} from "../constants/activities";

export const ActivitiesContext = createContext(
    []
);

export const ActivitiesProvider = ({children}) => {
    const [allActivities, setAllActivities] = useState([]);
    useEffect(() => {
        Promise
            .all(Activities.map(activity => getAllDocsInActivity(activity.name)))
            .then(results => {
                setAllActivities(results);
            });
    }, []);

    return (
        <ActivitiesContext.Provider value={[allActivities, setAllActivities]}>
            {children}
        </ActivitiesContext.Provider>
    );
};
