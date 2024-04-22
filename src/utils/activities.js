import {isYesterday, subDays, isToday, isSameDay} from "date-fns";

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
    const activitiesPerDayByTime = [];
        
        activities
        .filter(activity => activity.end > 0 && activity.start > 0)
        .sort((a, b) => b.start - a.start)
        .forEach(activity => {
            if (!activitiesPerDayByTime.find(item => isSameDay(item.end, activity.end))) {
                activitiesPerDayByTime.push(activity);
                }
            });

    let streak = 0;
    
    if (activitiesPerDayByTime.length === 0) {
        return 0;
        }

    for (let i = activitiesPerDayByTime.length - 1; i <= 0; i--) {
        
        const currentActivity = activitiesPerDayByTime[i];

        if (isToday(currentActivity.end)) {
            streak++;
            }
            
        if (!isYesterday(currentActivity.end)) {
            break;
        }

        if (!activitiesPerDayByTime[i + 1].end || !currentActivity.end) {
            break;
            }

        streak++
    }
    
    return streak;
}