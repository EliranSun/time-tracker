import { useContext, useEffect, useState } from "react";
import { add, format, isThisMonth, isThisWeek, isThisYear, isToday } from "date-fns";
import { useTimeSwipe } from "../../hooks/useTimeSwipe";
import { ActivitiesContext } from "../../context/ActivitiesContext";
import { getAllDocsInActivity } from "../../utils/db";
import { CardinalNavigation } from "../organisms/CardinalNavigation";
import classNames from "classnames";
import { getTimeString } from "../../utils/time";
import { useTimeAndDateFrame } from "../../hooks/useTimeAndDateFrame";
import { useTotalTime } from "../../hooks/useTotalTime";

export const StatsView = ({ onChangePage, activities }) => {
    // const [isNavigationPressed, setIsNavigationPressed] = useState(false);
    const [timeFrame, setTimeFrame] = useState(0);
    const [dateFrame, setDateFrame] = useState(0);
    const [allActivitiesData, setAllActivitiesData] = useContext(ActivitiesContext);
    const [shouldFilterSleep, setShouldFilterSleep] = useState(false);
    const { adjacentTimeframes, setAdjacentTimeframes, timeFrameName } = useTimeAndDateFrame(timeFrame, dateFrame);
    const { totalTime, sortedActivities } = useTotalTime({
        activities,
        allActivitiesData,
        dateFrame,
        timeFrame,
        shouldFilterSleep
    });
    const swipeHandlers = useTimeSwipe((newDateFrame) => {
        setDateFrame(newDateFrame);
    }, (newTimeFrame) => {
        setTimeFrame(newTimeFrame);
        setDateFrame(0);
    });

    useEffect(() => {
        Promise
            .all(activities.map(activity => getAllDocsInActivity(activity.name)))
            // getAllDocsInActivity()
            .then(results => {
                console.log(results);
                setAllActivitiesData(results);
            });
    }, []);

    return (
        <>
            <div className="flex flex-col w-screen justify-evenly h-[90vh] px-2 overflow-hidden">
                {sortedActivities
                    .map(({ activity, data, totalTime: activityTotalTime }, index) => {
                        const normalizedHeight = activityTotalTime / totalTime * 100 + "%";
                        const hours = Math.floor(activityTotalTime / 1000 / 60 / 60);
                        const minutes = Math.floor(activityTotalTime / 1000 / 60 % 60);
                        const seconds = Math.floor(activityTotalTime / 1000 % 60);
                        const timeString = getTimeString(hours, minutes, seconds);
                        const Icon = activity.icon;
                        const isLast = index === sortedActivities.length - 1;
                        const isFirst = index === 0;
                        const onClick = () => window.history.pushState({}, "", `/stats/activity/${activity.name.toLowerCase()}`);

                        return (
                            <div
                                key={index}
                                className={classNames({
                                    "flex text-right items-center justify-between text-[2.5em] min-h-[50px] py-4 px-12 font-mono": true,
                                    "rounded-b-3xl": isLast,
                                    "rounded-t-3xl": isFirst,
                                })}
                                style={{
                                    backgroundColor: activity.color,
                                    height: normalizedHeight
                                }}>
                                <Icon onClick={onClick}/>
                                <p>{timeString}</p>
                            </div>
                        );
                    })}
            </div>
            <div className="flex justify-between px-8 items-center">
                <CardinalNavigation
                    setAdjacentTimeframes={setAdjacentTimeframes}
                    adjacentTimeframes={adjacentTimeframes}
                    timeFrameName={timeFrameName}
                    swipeHandlers={swipeHandlers}/>
                <input
                    type="checkbox"
                    onChange={() => setShouldFilterSleep(!shouldFilterSleep)}
                    checked={shouldFilterSleep}/>
            </div>
        </>
    )
};