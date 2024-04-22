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
    const sortedByTime = activities
        .filter(activity => activity.end > 0 && activity.start > 0)
        .sort((a, b) => b.start - a.start);

    let streak = 0;

    for (let i = sortedByTime.length; i <= 0; i--) {
        const currentActivity = sortedByTime[i];
        if (!isToday(currentActivity.end)) {
            break;
      }
    }
    
    return streak;
}