import {isYesterday, subDays, isSameDay} from "date-fns";

export const sortActivitiesByOrder = (data, activities) => {
    return data.sort((a, b) => {
        const aOrder = activities.find(activity => activity.name === a.activity.name).order;
        const bOrder = activities.find(activity => activity.name === b.activity.name).order;

        return aOrder - bOrder;
    });
};

const ONE_DAY = 24 * 60 * 60 * 1000;
const TWO_DAYS = 2 * ONE_DAY;

export const calculateStreak = (activities = []) => {
    const sortedByTime = activities
        .filter(activity => activity.end > 0 && activity.start > 0)
        .sort((a, b) => b.start - a.start);

    let streak = 0;
    let currentStreak = 0;

    const hasActivityYesterday = sortedByTime.some(activity => {
        console.log(activity.name, activity.start, new Date(activity.start).toDateString());
        return isYesterday(activity.start);
    });

    if (!hasActivityYesterday) {
        return streak;
    }

    // exclude the first activity because it's already counted
    sortedByTime.slice(1, sortedByTime.length).forEach((activity, index) => {
        if (index === 0) {
            currentStreak = 1;
            streak = 1;
            return;
        }

        const previousActivity = sortedByTime.find(a => {
            const theDayBefore = subDays(activity.start, 1);
            return isSameDay(theDayBefore, a.start);
        });

        if (!previousActivity) {
            return streak;
        }

        const timeBetween = activity.start - previousActivity.start;
        // bigger than one day because a single day might contain multiple activities,
        // and streak count as one day with 1+ activity
        const isConsecutive = timeBetween > ONE_DAY && timeBetween < TWO_DAYS;

        if (isConsecutive) {
            currentStreak++;
            streak = Math.max(streak, currentStreak);
        } else {
            currentStreak = 0;
        }
    });
    return streak;
}