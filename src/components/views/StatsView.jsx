import {useContext, useEffect, useState} from "react";
import {useTimeSwipe} from "../../hooks/useTimeSwipe";
import {ActivitiesContext} from "../../context/ActivitiesContext";
import {getAllDocsInActivity} from "../../utils/db";
import {CardinalNavigation} from "../organisms/CardinalNavigation";
import classNames from "classnames";
import {getTimeString} from "../../utils/time";
import {useTimeAndDateFrame} from "../../hooks/useTimeAndDateFrame";
import {useTotalTime} from "../../hooks/useTotalTime";
import {Timeframes} from "../../constants/time";
import {CaretUp, CaretDown, MoonStars, CaretLeft, CaretRight} from "@phosphor-icons/react";
import {StatsViewHeader} from "../molecules/StatsViewHeader";
import {ActivityTotalTime} from "../molecules/ActivityTotalTime";

export const StatsView = ({activities}) => {
    const [timeFrame, setTimeFrame] = useState(0);
    const [dateFrame, setDateFrame] = useState(Timeframes.DAY);
    const [allActivitiesData, setAllActivitiesData] = useContext(ActivitiesContext);
    const [shouldFilterSleep, setShouldFilterSleep] = useState(false);
    const {timeFrameName} = useTimeAndDateFrame(timeFrame, dateFrame);
    const {totalTime, sortedActivities} = useTotalTime({
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
        setDateFrame(Timeframes.DAY);
    });

    useEffect(() => {
        Promise
            .all(activities.map(activity => getAllDocsInActivity(activity.name)))
            .then(results => {
                console.log(results);
                setAllActivitiesData(results);
            });
    }, []);

    const summedTime = sortedActivities?.reduce((acc, curr) => acc + (curr.totalTime || 0), 0) || 0;
    const dateFrameName = Object.entries(Timeframes).find(([_key, value]) => value === timeFrame)[0];

    return (
        <>
            <div {...swipeHandlers}>
                <StatsViewHeader
                    dateFrame={dateFrameName}
                    summedTime={summedTime}
                    timeFrameName={timeFrameName}
                    setShouldFilterSleep={setShouldFilterSleep}
                    shouldFilterSleep={shouldFilterSleep}/>
                <div className="flex flex-col w-screen justify-evenly h-[80vh] px-2 overflow-hidden">
                    {sortedActivities.length === 0
                        ? (
                            <div className="font-mono text-center text-3xl">
                                This day is filled with possibilities... <br/><br/>
                                Their only masters <br/> are you and time.
                            </div>
                        )
                        : sortedActivities.map(({activity, data, totalTime: activityTotalTime}, index) => {
                            return (
                                <ActivityTotalTime
                                    key={activity.name}
                                    activityTotalTime={activityTotalTime}
                                    timeFrame={timeFrame}
                                    totalTime={totalTime}
                                    activity={activity}
                                    isLast={index === sortedActivities.length - 1}
                                    isFirst={index === 0}/>
                            )
                        })}
                </div>
            </div>
        </>
    )
};