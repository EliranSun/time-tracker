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
        const lastActivity = activitiesPerDayByTime[i];
        const previousDayActivity = subDays(lastActivity.end, 1);
        const nextActivity = activitiesPerDayByTime[i + 1];

        console.log({lastActivity, nextActivity, previousDayActivity});

        if (isToday(lastActivity.end)) {
            streak++;
            continue;
        }

        if (isSameDay(nextActivity, previousDayActivity)) {
            streak++;
            continue;
        }

        break;
    }

    // for (let i = 0; i < activitiesPerDayByTime.length; i++) {
    //     const currentActivity = activitiesPerDayByTime[i];
    //     const nextActivity = activitiesPerDayByTime[i + 1];
    //
    //     if (!nextActivity) {
    //         if (isYesterday(currentActivity.end) || isToday(currentActivity.end)) {
    //             streak++;
    //             console.log("no next activity (last?) but activity is today/yesterday", {currentActivity, streak});
    //         }
    //
    //         console.log("no next activity (last?)", {currentActivity, streak});
    //         break;
    //     }
    //
    //     if (differenceInDays(currentActivity.end, nextActivity.end) > 1) {
    //         console.log("gap was more then a day", {nextActivity, currentActivity, streak});
    //         break;
    //     }
    //
    //     streak++
    //     console.log("gap was less or equal then a day", {nextActivity, currentActivity, streak});
    // }

    return streak;
}