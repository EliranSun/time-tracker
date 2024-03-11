import {roundToNearestMinutes} from "date-fns";
import { formatDuration, formatForTimeInput } from "../utils/session";
import { EditEntry } from "./EditEntry";

const formatDateTimeParts = (timestamp) => {
    return new Intl.DateTimeFormat('en-IL', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: 'numeric',
    })
        .format(new Date(roundToNearestMinutes(timestamp, {nearestTo: 5})))
        .split(" at ");
};

export const LastSessions = ({activitiesData}) => {
    return (
        <div className="h-16 text-xs text-white font-mono overflow-y-auto">
            {activitiesData
                .filter(item => {
                    return (
                        item.end > 0 &&
                        (item.end - item.start) > 60 * 1000
                    );
                })
                .sort((a, b) => b.start - a.start)
                .map(item => {
                    const starTimeDateParts = formatDateTimeParts(item.start);
                    // const endDate = new Intl.DateTimeFormat('en-GB', {
                    //     hour: 'numeric',
                    //     minute: 'numeric',
                    // }).format(new Date(roundToNearestMinutes(item.end, {nearestTo: 5})));

                    const startDate = new Date(item.start).toISOString().split("T")[0];
                    const endDate = new Date(item.end).toISOString().split("T")[0];
                    const duration = formatForTimeInput(item.end - item.start)

                    return (
                        <div
                            key={item.start}
                            className="flex justify-between w-44 m-auto">
                            <EditEntry start={startDate} end={endDate} duration={duration}/>
                            {/*<span>{starTimeDateParts[0]}</span>*/}
                            {/*<span>{formatDuration(item.end - item.start)}</span>*/}
                        </div>
                    )
                })}
        </div>
    )
};