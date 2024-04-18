import {createContext, useState} from "react";

export const ActivitiesFilterContext = createContext([]);

export const ActivitiesFilterProvider = ({children}) => {
    const [filters, setFilters] = useState([]);

    return (
        <ActivitiesFilterContext.Provider value={[filters, setFilters]}>
            {children}
        </ActivitiesFilterContext.Provider>
    );
}