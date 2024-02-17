import { useEffect, useState } from "react";
import { getAllDocsInActivity } from "../utils/activities";

export const useActivityData = (activityNames = []) => {
    const [activitiesData, setActivitiesData] = useState({});

    useEffect(() => {
        if (activityNames.length === 0)
            return;

        const fetchData = async () => {
            let data = {};
            for (const activityName of activityNames) {
                const activityData = await getAllDocsInActivity(activityName);
                data = {
                    ...data,
                    [activityName]: activityData.sort((a, b) => a.start - b.start).filter(item => item.end > 0)
                }
            }

            console.count("useActivityData");
            setActivitiesData(data);
        };

        fetchData();
    }, [activityNames]);

    return activitiesData;
};