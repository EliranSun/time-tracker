import {useContext, useEffect, useMemo, useState} from "react";
import {ActivitiesContext} from "../../context/ActivitiesContext";
import {round, uniqBy} from 'lodash';
import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    startOfMonth,
    startOfWeek,
} from 'date-fns';
import {calcAlphaChannelBasedOnOpacity} from "../../utils/colors";
import {useTimeSwipe} from "../../hooks/useTimeSwipe";
import classNames from "classnames";
import {getAllDocsInActivity} from "../../utils/db";

function getDaysIncludingWeekends(date) {
    const firstDayOfMonth = startOfMonth(date);
    const lastDayOfMonth = endOfMonth(date);
    const startOfWeekForFirstDay = startOfWeek(firstDayOfMonth, {weekStartsOn: 0});
    const endOfWeekForLastDay = endOfWeek(lastDayOfMonth, {weekStartsOn: 0});
    const daysArray = eachDayOfInterval({
        start: startOfWeekForFirstDay,
        end: endOfWeekForLastDay,
    });

    return daysArray.map(day => ({
        day: day.getDate(),
        month: day.getMonth(),
        year: day.getFullYear(),
    }));
}

const Weekdays = [
    'S', 'M', 'T', 'W', 'T', 'F', 'S'
];

export const ActivityCalendarView = ({activity, isZenMode}) => {
    const [dateIndex, setDateIndex] = useState(0);
    const swipeHandlers = useTimeSwipe(setDateIndex);
    const [allActivitiesData] = useContext(ActivitiesContext);

    const activityData = useMemo(() => {
        if (allActivitiesData.length === 0) {
            return {};
        }

        const dataByDays = {};
        const activities = allActivitiesData.find(entries => {
            return entries.some(entry => entry.name === activity.name);
        }) || [];

        const unique = uniqBy(activities, 'start')
            .filter(activity => activity.start > 0 && activity.end > 0)
            .sort((a, b) => a.start - b.start);

        unique.forEach(entry => {
            const date = new Date(entry.end);
            const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            if (!dataByDays[key]) {
                dataByDays[key] = [];
            }
            dataByDays[key].push(entry);
        });

        return dataByDays;
    }, [allActivitiesData, activity.name]);

    const month = addMonths(new Date(), dateIndex).getMonth();
    const year = new Date().getFullYear();
    const selectedMonthDate = new Date(year, month, 1);
    const daysMap = getDaysIncludingWeekends(selectedMonthDate);

    let highestTotalInHours = 0;
    const _ = useMemo(() => {
        return daysMap.map(({day, month, year}, index) => {
            const activityThisDay = activityData[`${year}-${month}-${day}`] || [];
            const totalInHours = (activityThisDay.reduce((acc, entry) => {
                return acc + (entry.end - entry.start);
            }, 0) / 1000 / 60 / 60);

            if (totalInHours > highestTotalInHours) {
                highestTotalInHours = totalInHours;
            }
            return totalInHours;
        });
    }, [daysMap]);

    const getTotalString = (total) => {
        const hours = Number(String(total).split('.')[0]);
        const minutes = round(Math.floor((total - hours) * 60), -1);
        if (minutes > 30) {
            return `${hours + 1}h`;
        }

        if (hours === 0 && minutes > 0) {
            return `${minutes}m`;
        }

        if (hours === 0 && minutes === 0) {
            return "";
        }

        return `${hours}h`;
    };

    const formattedActivityName = useMemo(() => {
        return activity.name.toUpperCase();
    }, [activity.name]);

    return (
        <section className="w-screen px-4" {...swipeHandlers}>
            <h1
                className="font-mono hypens-manual w-10/12 text-8xl mt-16 mb-2 tracking-tighter"
                style={{color: activity.color}}>
                {formattedActivityName.slice(0, 5)}&shy;{formattedActivityName.slice(5, activity.name.length)}
            </h1>
            <h2 className="font-mono text-6xl mb-8" style={{color: activity.color}}>
                {format(new Date(year, month, 1), 'MMM').toUpperCase()}
            </h2>
            <div className="grid grid-cols-7 justify-center max-w-[700px] m-auto mb-2">
                {Weekdays.map((day, index) => (
                    <div key={index} className="text-center">{day}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1.5 justify-center max-w-[700px] m-auto">
                {daysMap.map(({day, month, year}, index) => {
                    const key = `${year}-${month}-${day}`;
                    const activityThisDay = activityData[key] || [];
                    const totalInHours = (activityThisDay.reduce((acc, entry) => {
                        return acc + (entry.end - entry.start);
                    }, 0) / 1000 / 60 / 60);

                    const opacity = totalInHours / highestTotalInHours;
                    const alpha = calcAlphaChannelBasedOnOpacity(opacity);

                    const isEntryToday = isSameDay(new Date(), new Date(year, month, day));
                    const isEntryThisMonth = isSameMonth(selectedMonthDate, new Date(year, month, day));

                    return (
                        <div
                            key={index + 1}
                            style={{
                                backgroundColor: `${activity.color}${alpha}`,
                            }}
                            className={classNames("w-full text-center h-full rounded-full aspect-square", {
                                "flex items-center justify-center flex-col text-white px-2": true,
                                "outline outline-offset-2 outline-4 outline-black": isEntryToday,
                                "opacity-10": !isEntryThisMonth
                            })}>
                            {isZenMode ? null :
                                <>
                                    <span className="text-xs text-black">{day}</span>
                                    <span className="text-sm font-mono">
                                        {getTotalString(totalInHours)}
                                    </span>
                                </>}
                        </div>)
                })}
            </div>
        </section>);
};