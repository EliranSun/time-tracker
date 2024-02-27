import { useMemo } from "react";
import { getLastSession } from "../utils/activities";

export const LastSessionData = ({ activity, data }) => {
    const sessionData = useMemo(() => {
        return getLastSession(activity.name, data);
    }, [activity.name, data]);

    return (
        <p className="text-gray-500 text-xs">
            <i>Last Session:</i>{' '}
            <span className="font-mono">{sessionData}</span>
        </p>
    );
};