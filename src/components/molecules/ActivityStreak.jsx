import {Badge} from "../atoms/Badge";
import {useMemo} from "react";

const ONE_DAY = 24 * 60 * 60 * 1000;

export const ActivityStreak = ({activities = []}) => {
    const streak = useMemo(() => {
        const sortedByTime = activities.sort((a, b) => a.start - b.start);
        let streak = 0;
        let currentStreak = 0;
        let lastEnd = 0;
        sortedByTime.forEach(activity => {
            if ((activity.start - lastEnd) < ONE_DAY) {
                currentStreak++;
                streak = Math.max(streak, currentStreak);
            } else {
                currentStreak = 0;
            }
            lastEnd = activity.end;
        });

        return streak;
    }, [activities]);

    return <Badge value={streak} label="Streak"/>;
};