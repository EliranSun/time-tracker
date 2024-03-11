import {roundToNearestMinutes} from "date-fns";
import { formatDuration } from "../utils/session";

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
export const TodaySessions = ({activitiesData}) => {
    return (
        <div className="h-16 text-xs opacity-40 font-mono overflow-y-auto">
            {activitiesData
                .filter(item => {
                    return (
                        item.end > 0 &&
                        (item.end - item.start) > 60 * 1000
                    );
                })
                .sort((a, b) => b.start - a.start)
                // .slice(0, 4)
                .map(item => {
                    const starTimeDateParts = formatDateTimeParts(item.start);
                    const endDate = new Intl.DateTimeFormat('en-GB', {
                        hour: 'numeric',
                        minute: 'numeric',
                    }).format(new Date(roundToNearestMinutes(item.end, {nearestTo: 5})));

                    return (
                        <div
                            key={item.start}
                            className="flex justify-between w-44 m-auto">
                            <span>{starTimeDateParts[0]}</span>
                            <span>
                                <span>{formatDuration(item.end - item.start)}</span>
                            </span>
                        </div>
                    )
                })}
        </div>
    )
};