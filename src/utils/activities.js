import { collection, getDocs } from "firebase/firestore";
import { db } from "../App";
import { addDays, intervalToDuration, isSameDay, startOfWeek } from "date-fns";

export const getAllDocsInActivity = async (activityName) => {
    const querySnapshot = await getDocs(collection(db, `activities/${activityName}/data`));
    const data = [];
    querySnapshot.forEach((doc) => {
        data.push(doc.data());
    });

    return data;
};
export const getLastWeekData = (name, data) => {
    const activityData = data[name];
    const week = [{
        name: "Sunday",
    }, {
        name: "Monday",
    }, {
        name: "Tuesday",
    }, {
        name: "Wednesday",
    }, {
        name: "Thursday",
    }, {
        name: "Friday",
    }, {
        name: "Saturday",
    }];

    if (!name || !data || !activityData) {
        return week;
    }


    return week.map((day, index) => {
        const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
        const targetDay = addDays(weekStart, index);
        const dayData = activityData.filter(item => isSameDay(new Date(item.start), targetDay));

        const duration = intervalToDuration({
            start: dayData[0]?.start,
            end: dayData[dayData.length - 1]?.end
        });

        return {
            ...day,
            duration: [duration.hours && `${duration.hours}h`, `${duration.minutes || 0}m`].filter(Boolean).join(" "),
        }
    });
};

export const getLastSession = (name, data) => {
    if (!name || !data[name]) {
        return "";
    }

    const start = data[name].at(-1)?.start;
    const end = data[name].at(-1)?.end;

    if (!start || !end) {
        return "No entries";
    }

    const duration = end - start;
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(0);

    return `Last session: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};