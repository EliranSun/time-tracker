import { createContext, useState } from "react";

export const ActivitiesContext = createContext(
    []
);

export const ActivitiesProvider = ({ children }) => {
    const [allActivities, setAllActivities] = useState([]);

    return (
        <ActivitiesContext.Provider value={[allActivities, setAllActivities]}>
            {children}
        </ActivitiesContext.Provider>
    );
};
