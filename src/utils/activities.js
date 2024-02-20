import { collection, getDocs } from "firebase/firestore";
import { addDays, intervalToDuration, isSameDay, startOfWeek } from "date-fns";
import { formatTimestamp } from "./time";
import { db } from "./db";

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
        duration: "",
    }, {
        name: "Monday",
        duration: "",
    }, {
        name: "Tuesday",
        duration: "",
    }, {
        name: "Wednesday",
        duration: "",
    }, {
        name: "Thursday",
        duration: "",
    }, {
        name: "Friday",
        duration: "",
    }, {
        name: "Saturday",
        duration: "",
    }];

    if (!name || data.length === 0 || !activityData) {
        return { data: week, totalActivitiesMeasure: 0 };
    }

    let totalCount = 0;
    const weekData = week.map((day, index) => {
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

        const measure = Math.round(hours + (minutes * 2 / 60));
        totalCount += measure;

        return {
            ...day,
            measure,
            duration: hours === 0 && minutes === 0 ? "" :
                `${hours > 0 ? `${hours}h` : ""}${minutes > 0 ? `${minutes}m` : ""}`,
        }
    });

    return {
        data: weekData,
        totalActivitiesMeasure: Math.round(totalCount),
    };
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
    const timeString = formatTimestamp(duration);

    return `Last session: ${timeString}`;
};