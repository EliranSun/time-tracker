import {Badge} from "../atoms/Badge";
import {useMemo} from "react";
import {isYesterday} from "date-fns";

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

        const hasActivityYesterday = sortedByTime.some((activity, index) => {
            return isYesterday(activity.start);
        });

        if (!hasActivityYesterday) {
            return streak;
        }

        sortedByTime.forEach((activity, index) => {
            if (index === 0) {
                currentStreak = 1;
                streak = 1;
                return;
            }

            const previousActivity = sortedByTime[index - 1];
            const timeBetween = previousActivity.start - activity.start;
            // bigger than one day because a single day might contain multiple activities,
            // and streak count as one day with 1+ activity
            const isConsecutive = timeBetween > ONE_DAY && timeBetween < TWO_DAYS;

            if (isConsecutive) {
                currentStreak++;
                streak = Math.max(streak, currentStreak);
            } else {
                currentStreak = 1;
            }
        });
        return streak;
    }, [activities]);

    return <Badge value={streak} label="Streak"/>;
};