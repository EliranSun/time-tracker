import {differenceInDays, format, isSameDay, isToday, isYesterday} from "date-fns";
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

    if (activitiesPerDayByTime.length === 0) {
        return 0;
    }

    const lastActivity = activitiesPerDayByTime[0].end;
    if (!isToday(lastActivity) && !isYesterday(lastActivity)) {
        // streak is broken since the last activity is not today or yesterday
        return 0;
    }

    for (let i = 0; i < activitiesPerDayByTime.length; i++) {
        if (i > 0) {
            const previousDate = format(new Date(activitiesPerDayByTime[i - 1].end), "MM-dd-yyyy");
            const currentDate = format(new Date(activitiesPerDayByTime[i].end), "MM-dd-yyyy");

            if (differenceInDays(previousDate, currentDate) > 1) {
                break;
            }
        }

        streak++;
    }

    return streak;
}