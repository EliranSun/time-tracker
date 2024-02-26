import { isSameDay, roundToNearestMinutes } from "date-fns";

const formatDateTimeParts = (timestamp) => {
    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: 'numeric',
    })
        .format(new Date(roundToNearestMinutes(timestamp, { nearestTo: 5 })))
        .split(' at ')
};
export const TodaySessions = ({ activitiesData }) => {
    return (
        <div>
            {activitiesData
                .filter(item => {
                    return (
                        // isSameDay(new Date(item.start), new Date()) &&
                        item.end > 0 &&
                        (item.end - item.start) > 60 * 1000
                    );
                })
                .sort((a, b) => b.start - a.start)
                .slice(0, 4)
                .map(item => {
                    const starTimeDateParts = formatDateTimeParts(item.start);

                    return (
                        <div
                            key={item.start}
                            className="flex text-xs opacity-40 justify-between w-20 m-auto font-mono">
                            <span>{starTimeDateParts[1]}</span>
                            <span>-</span>
                            <span>
                                {new Intl.DateTimeFormat('en-GB', {
                                    hour: 'numeric',
                                    minute: 'numeric',
                                }).format(new Date(roundToNearestMinutes(item.end, { nearestTo: 5 })))}
                            </span>
                        </div>
                    )
                })}
        </div>
    )
};