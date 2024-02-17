import { Activities } from "./App";
import { useEffect, useState } from "react";
import { getAllDocsInActivity } from "./utils/activities";

export const StatsView = ({ onChangePage }) => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = [];
            for (let i = 0; i < Activities.length; i++) {
                const activity = Activities[i];
                const activityData = await getAllDocsInActivity(activity);
                data.push({ activity, data: activityData });
            }

            console.log({ data });
            setActivities(data);
        };

        fetchData();
    }, []);

    // .filter(item => item.activity.name === "Pets")

    return (
        <div className="text-white">
            <button onClick={onChangePage}>BACK</button>
            <h1>Stats</h1>
            <div>
                {activities.map((activity, index) => (
                    <div key={index}>
                        <h2>{activity.activity.name}</h2>
                        <div>
                            {activity.data.map((data, index) => {
                                const timeElapsed = data.end ? Math.round((data.end - data.start) / 1000) : 0;

                                if (timeElapsed === 0)
                                    return null;

                                return (
                                    <div key={index}>
                                        {timeElapsed} seconds
                                        on {new Date(data.start).toLocaleDateString("en-GB", {
                                        timeZone: "UTC",
                                    })}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};