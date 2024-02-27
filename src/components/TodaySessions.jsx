import { roundToNearestMinutes } from "date-fns";

const formatDateTimeParts = (timestamp) => {
    return new Intl.DateTimeFormat('he-IL', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: 'numeric',
    })
        .format(new Date(roundToNearestMinutes(timestamp, { nearestTo: 5 })))
        .split(', ');
};
export const TodaySessions = ({ activitiesData }) => {
    return (
        <div className="h-16">
            {activitiesData
                .filter(item => {
                    return (
                        item.end > 0 &&
                        (item.end - item.start) > 60 * 1000
                    );
                })
                .slice(0, 4)
                .map(item => {
                    const starTimeDateParts = formatDateTimeParts(item.start);
                    const endDate = new Intl.DateTimeFormat('en-GB', {
                        hour: 'numeric',
                        minute: 'numeric',
                    }).format(new Date(roundToNearestMinutes(item.end, { nearestTo: 5 })));

                    return (
                        <div
                            key={item.start}
                            className="flex text-xs opacity-40 justify-between w-20 m-auto font-mono">
                            <span>{starTimeDateParts[1]}</span>
                            <span>-</span>
                            <span>{endDate} </span>
                        </div>
                    )
                })}
        </div>
    )
};