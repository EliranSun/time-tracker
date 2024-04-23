import {differenceInCalendarDays, differenceInDays, format, isSameDay, isToday, isYesterday} from "date-fns";
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

    // last activity first, loop is not reversed
    activitiesPerDayByTime.sort((a, b) => b.end - a.end);

    if (activitiesPerDayByTime.length === 0) {
        return 0;
    }

    const lastActivity = activitiesPerDayByTime[0].end;

    // streak is broken since the last activity is not today or yesterday
    if (!isToday(lastActivity) && !isYesterday(lastActivity)) {
        return 0;
    }

    // reaching here means the last activity is today or yesterday, which counts as 1 streak
    let streak = 1;

    for (let i = 1; i < activitiesPerDayByTime.length; i++) {
        const currentDay = activitiesPerDayByTime[i].end;
        const previousDay = activitiesPerDayByTime[i - 1].end;

        if (differenceInCalendarDays(previousDay, currentDay) === 1) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}