import {Badge} from "../atoms/Badge";
import {useMemo} from "react";

const ONE_DAY = 24 * 60 * 60 * 1000;
const TWO_DAYS = 2 * ONE_DAY;

export const ActivityStreak = ({activities = []}) => {
    const streak = useMemo(() => {
        // Last activity is the most recent one
        const sortedByTime = activities
            .filter(activity => activity.end > 0 && activity.start > 0)
            .sort((a, b) => b.start - a.start);

        let streak = 0;
        let currentStreak = 0;

        sortedByTime.forEach(activity => {
            const isNextDay = activity.start - sortedByTime[streak]?.start > TWO_DAYS;
            const isSameDay = activity.start - sortedByTime[streak]?.start < ONE_DAY;

            if (isNextDay) {
                streak = currentStreak > streak ? currentStreak : streak;
                currentStreak = 0;
            } else if (isSameDay) {
                currentStreak++;
            }
        });

        return streak;
    }, [activities]);

    return <Badge value={streak} label="Streak"/>;
};