import {isYesterday, subDays, differenceInDays, isSameDay, isToday} from "date-fns";

const ONE_DAY = 24 * 60 * 60 * 1000;
const TWO_DAYS = 2 * ONE_DAY;

export const sortActivitiesByOrder = (data, activities) => {
    return data.sort((a, b) => {
        const aOrder = activities.find(activity => activity.name === a.activity.name).order;
        const bOrder = activities.find(activity => activity.name === b.activity.name).order;

        return aOrder - bOrder;
    });
};

export const calculateStreak = (activities = []) => {
    let activitiesPerDayByTime = [];

    activities
        .filter(activity => activity.end > 0 && activity.start > 0)
        .forEach(activity => {
            if (!activitiesPerDayByTime.find(item => isSameDay(item.end, activity.end))) {
                activitiesPerDayByTime.push({
                    ...activity,
                    formattedDay: new Date(activity.end).toLocaleDateString("en-US"),
                });
            }
        });

    let streak = 0;

    // last activity first, loop is not reversed
    activitiesPerDayByTime.sort((a, b) => b.end - a.end);

    if (activitiesPerDayByTime.length === 0) {
        return 0;
    }

    for (let i = 0; i < activitiesPerDayByTime.length; i++) {
        const previousActivity = activitiesPerDayByTime[i - 1];
        const currentActivity = activitiesPerDayByTime[i];

        if (!previousActivity) {
            if (isToday(currentActivity.end) || isYesterday(currentActivity.end)) {
                streak++;
            }
            continue;
        }

        if (differenceInDays(previousActivity.end, currentActivity.end) > 1) {
            break;
        }

        streak++
    }

    return streak;
}