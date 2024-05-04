import {createContext, useEffect, useState, useCallback} from "react";
import {getAllDocsInActivity} from "../utils/db";
import {Activities} from "../constants/activities";

export const ActivitiesContext = createContext(
    {
        activities: []
    }
);

export const ActivitiesProvider = ({children}) => {
    const [activities, setAllActivities] = useState([]);
    const fetch = useCallback(() => {
        Promise
            .all(Activities.map(activity => getAllDocsInActivity(activity.name)))
            .then(results => {
                setAllActivities(results);
            });
    }, []);

    useEffect(() => {
        fetch();
    }, []);

    return (
        <ActivitiesContext.Provider value={{activities, fetch}}>
            {children}
        </ActivitiesContext.Provider>
    );
};
