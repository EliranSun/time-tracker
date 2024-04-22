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

    console.log({activitiesPerDayByTime});
    
    if (activitiesPerDayByTime.length === 0) {
        return 0;
    }

    if (activities.length === 1) {
        if (isToday(activities[0].end)) {
            return 1;
        }

        return 0;
    }

    for (let i = 0; i < activitiesPerDayByTime.length; i++) {
        const thisActivity = activitiesPerDayByTime[i];
        const previousActivity = activitiesPerDayByTime[i - 1];

        if (previousActivity) {
            const diff = differenceInDays(previousActivity.end, thisActivity.end);
            if (diff > 1) {
                break;
            }
        }

        streak++;
    }

    return streak;
}