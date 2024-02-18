import {useMemo} from "react";
import {getLastSession} from "../utils/activities";
import {useActivityData} from "../hooks/useActivityData";

export const LastSessionData = ({activity}) => {
    const activitiesData = useActivityData(activity.name);

    const sessionData = useMemo(() => {
        console.log("activity.name", activity.name, activitiesData);
        return getLastSession(activity.name, activitiesData);
    }, [activity.name, activitiesData]);

    return (
        <p className="h-20">{sessionData}</p>
    );
};