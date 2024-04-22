import {differenceInDays, isSameDay, isToday} from "date-fns";
import {ACTIVITY_MINIMUM_TIME} from "../constants/activities";
import {formatDuration} from "./session";

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
        .filter(activity => {
            return (
                activity.end > 0 &&
                activity.start > 0 &&
                Math.abs(activity.end - activity.start) > ACTIVITY_MINIMUM_TIME
            );
        })
        .forEach(activity => {
            if (!activitiesPerDayByTime.find(item => isSameDay(item.end, activity.end))) {
                activitiesPerDayByTime.push({
                    ...activity,
                    formattedDay: new Date(activity.end).toLocaleDateString("en-US"),
                    totalTime: formatDuration(activity.end - activity.start)
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
            console.log({previousActivity, thisActivity, diff});
            if (diff > 0) {
                break;
            }
        }

        streak++;
    }

    return streak;
}