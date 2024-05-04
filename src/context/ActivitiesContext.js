import {createContext, useEffect, useState} from "react";
import {getAllDocsInActivity} from "../utils/db";
import {Activities} from "../constants/activities";
import {noop} from "lodash";

export const ActivitiesContext = createContext(
    {
        activities: []
    }
);

export const ActivitiesProvider = ({children}) => {
    const [activities, setAllActivities] = useState([]);
    const fetch = noop;

    useEffect(() => {
        Promise
            .all(Activities.map(activity => getAllDocsInActivity(activity.name)))
            .then(results => {
                setAllActivities(results);
            });
    }, [fetch]);

    return (
        <ActivitiesContext.Provider value={{activities, fetch}}>
            {children}
        </ActivitiesContext.Provider>
    );
};
