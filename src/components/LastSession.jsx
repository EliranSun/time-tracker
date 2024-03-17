import {useMemo} from "react";
import {getLastSession} from "../utils/session";

export const LastSession = ({activity, data}) => {
    const sessionData = useMemo(() => {
        return getLastSession(activity.name, data);
    }, [activity.name, data]);

    return (
        <p className="w-full text-xs flex justify-between">
            <i>Last Session:</i>{' '}
            <span className="font-mono">{sessionData}</span>
        </p>
    );
};
