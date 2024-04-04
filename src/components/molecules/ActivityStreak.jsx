import {Badge} from "../atoms/Badge";

export const ActivityStreak = ({activities = []}) => {
    const sortedByTime = activities.sort((a, b) => a.start - b.start);
    let streak = 0;
    let currentStreak = 0;
    let lastEnd = 0;
    sortedByTime.forEach(activity => {
        if (activity.start - lastEnd < 24 * 60 * 60 * 1000) {
            currentStreak++;
            streak = Math.max(streak, currentStreak);
        } else {
            currentStreak = 1;
        }
        lastEnd = activity.end;
    });

    return <Badge value={streak} label="Streak"/>;
};