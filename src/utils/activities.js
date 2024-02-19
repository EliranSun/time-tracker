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
    const activityData = data;
    const week = [{
        name: "Sunday",
        duration: "-",
    }, {
        name: "Monday",
        duration: "-",
    }, {
        name: "Tuesday",
        duration: "-",
    }, {
        name: "Wednesday",
        duration: "-",
    }, {
        name: "Thursday",
        duration: "-",
    }, {
        name: "Friday",
        duration: "-",
    }, {
        name: "Saturday",
        duration: "-",
    }];

    if (!name || data.length === 0 || !activityData) {
        return week;
    }

    return week.map((day, index) => {
        const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
        const targetDay = addDays(weekStart, index);
        const dayData = activityData.filter(item => {
            return isSameDay(new Date(item.start), targetDay) && item.end > 0
        });


        const duration = dayData.reduce((acc, item) => {
            return acc + item.end - item.start;
        }, 0);

        const hours = Math.floor(duration / 3600000);
        const minutes = Math.floor((duration % 3600000) / 60000);

        return {
            ...day,
            duration: `${hours > 0 ? `${hours}h` : ""}${minutes > 0 ? `${minutes}m` : day.duration}`,
        }
    });
};

export const getLastSession = (name = "", data = []) => {
    if (!name || data.length === 0) {
        return "";
    }

    const lastSession = data.filter(item => item.end > 0 && item.end - item.start > 60 * 1000)?.at(-1);
    const start = lastSession?.start;
    const end = lastSession?.end;

    if (!start || !end) {
        return "No entries";
    }

    const duration = end - start;
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(0);

    return `Last session: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};