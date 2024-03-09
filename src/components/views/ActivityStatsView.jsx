import { useContext, useEffect, useMemo, useState } from "react";
import { ActivitiesContext } from "../../context/ActivitiesContext";
import { round, uniqBy } from 'lodash';
import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    startOfMonth,
    startOfWeek,
    subMonths,
    isSameDay,
    isSameMonth
} from 'date-fns';
import { replaceMetaThemeColor } from "../../utils/colors";
import { useTimeSwipe } from "../../hooks/useTimeSwipe";
import classNames from "classnames";

const calcAlphaChannelBasedOnOpacity = (opacity) => {
    const alpha = Math.round(opacity * 255).toString(16);
    return alpha.length === 1 ? `0${alpha}` : alpha;
}

function getDaysIncludingWeekends(date) {
    const firstDayOfMonth = startOfMonth(date);
    const lastDayOfMonth = endOfMonth(date);
    const startOfWeekForFirstDay = startOfWeek(firstDayOfMonth, { weekStartsOn: 0 });
    const endOfWeekForLastDay = endOfWeek(lastDayOfMonth, { weekStartsOn: 0 });
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

export const ActivityStatsView = ({ activity, isZenMode }) => {
    const [dateIndex, setDateIndex] = useState(0);
    const swipeHandlers = useTimeSwipe(setDateIndex);

    const [allActivitiesData] = useContext(ActivitiesContext);
    const activityData = useMemo(() => {
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
    const daysMap = getDaysIncludingWeekends(new Date(year, month, 1));

    let highestTotal = 0;
    const _ = useMemo(() => {
        return daysMap.map(({ day, month, year }, index) => {
            const activityThisDay = activityData[`${year}-${month}-${day}`] || [];
            const total = (activityThisDay.reduce((acc, entry) => {
                return acc + (entry.end - entry.start);
            }, 0) / 1000 / 60 / 60);

            if (total > highestTotal) {
                highestTotal = total;
            }
            return total;
        });
    }, [daysMap]);

    const getTotalString = (total) => {
        const hours = Number(String(total).split('.')[0]);
        const minutes = round(Math.floor((total - hours) * 60), -1);

        if (hours > 0 && minutes > 0) {
            return `${hours}h ${minutes}m`;
        }

        if (hours > 0) {
            return `${hours}h`;
        }

        if (minutes > 0) {
            return `${minutes}m`;
        }

        return '';
    };

    return (
        <section className="w-screen h-screen top-0 p-2" {...swipeHandlers}>
            <h1 className="font-mono text-8xl mt-8 mb-2 tracking-tighter" style={{ color: activity.color }}>
                {activity.name.toUpperCase()}
            </h1>
            <h2 className="font-mono text-6xl mb-8" style={{ color: activity.color }}>
                {format(new Date(year, month, 1), 'MMM').toUpperCase()}
            </h2>
            <div className="grid grid-cols-7 justify-center max-w-[700px] m-auto mb-2">
                <div>S</div>
                <div>M</div>
                <div>T</div>
                <div>W</div>
                <div>T</div>
                <div>F</div>
                <div>S</div>
            </div>
            <div className="grid grid-cols-7 gap-px justify-center max-w-[700px] m-auto bg-white/90">
                {daysMap.map(({ day, month, year }, index) => {
                    const key = `${year}-${month}-${day}`;
                    const activityThisDay = activityData[key] || [];
                    const total = (activityThisDay.reduce((acc, entry) => {
                        return acc + (entry.end - entry.start);
                    }, 0) / 1000 / 60 / 60);

                    const opacity = (total / highestTotal) < 0.1 ? 0.1 : total / highestTotal;
                    const alpha = calcAlphaChannelBasedOnOpacity(opacity);
                    const isEntryToday = isSameDay(new Date(), new Date(year, month, day));
                    const isEntryThisMonth = isSameMonth(new Date(), new Date(year, month, day));
                    
                    return (
                        <div
                            className={classNames("w-full aspect-square flex items-center justify-center flex-col text-white", {
                                "outline outline-offset-2 outline-4 outline-black": isEntryToday,
                                "opacity-30": !isEntryThisMonth
                            })}
                            key={index + 1}
                            style={{
                                backgroundColor: `${activity.color}${alpha}`,
                            }}>
                            {isZenMode ? null : <div className="flex flex-col text-black">
                               <span className="font-bold">{day}</span>
                                <span className="text-xs opacity-70">{getTotalString(total)}</span>
                            </div>}
                        </div>)
                })}
            </div>
        </section>);
};