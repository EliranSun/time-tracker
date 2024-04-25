import {useEffect, useState} from "react";
import {getAllDocsInActivity} from "../utils/db";

export const useActivityData = ({name: activityName, dependencies = []}) => {
    const [activitiesData, setActivitiesData] = useState([]);

    useEffect(() => {
        if (!activityName)
            return;

        getAllDocsInActivity(activityName)
            .then(data => {
                const relevantData = data
                    .sort((a, b) => a.start - b.start)
                    .filter(item => item.end > 0);

                setActivitiesData(relevantData);
            })
            .catch(error => {
                console.error("Error getting document:", error);
            });
    }, [activityName, ...dependencies]);

    return activitiesData;
};