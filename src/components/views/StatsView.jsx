import {useContext, useEffect, useMemo, useState} from "react";
import {useTimeSwipe} from "../../hooks/useTimeSwipe";
import {ActivitiesContext} from "../../context/ActivitiesContext";
import {getAllDocsInActivity} from "../../utils/db";
import {formatTimestamp} from "../../utils/time";
import {useTimeAndDateFrame} from "../../hooks/useTimeAndDateFrame";
import {useTotalTime} from "../../hooks/useTotalTime";
import {Timeframes} from "../../constants/time";
import {StatsViewHeader} from "../molecules/StatsViewHeader";
import {ActivityTotalTime} from "../molecules/ActivityTotalTime";
import {Activities} from "../../constants/activities";

const ViewTypes = {
    AGGREGATE: "aggregate",
    DETAIL: "detail",
    PIECHART: "piechart",
};

export const StatsView = ({activities}) => {
    const [timeFrame, setTimeFrame] = useState(0);
    const [dateFrame, setDateFrame] = useState(Timeframes.DAY);
    const [allActivitiesData, setAllActivitiesData] = useContext(ActivitiesContext);
    const [shouldFilterSleep, setShouldFilterSleep] = useState(false);
    const {timeFrameName} = useTimeAndDateFrame(timeFrame, dateFrame);
    const [viewType, setViewType] = useState(ViewTypes.AGGREGATE);

    const {totalTime, sortedActivities, unsortedActivities} = useTotalTime({
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
                setAllActivitiesData(results);
            });
    }, []);

    const summedTime = useMemo(() => {
        const totalTimestamp = sortedActivities.reduce((acc, curr) => acc + curr.totalTime, 0);
        return formatTimestamp(totalTimestamp);
    }, [sortedActivities]);

    console.log({timeFrame});
    const dateFrameName = Object.entries(Timeframes).find(([_key, value]) => value === timeFrame)[0];
    const items = useMemo(() => {
        return viewType === ViewTypes.AGGREGATE ? sortedActivities : unsortedActivities;
    }, [viewType, sortedActivities, unsortedActivities]);

    return (
        <>
            <div>
                <StatsViewHeader
                    dateFrame={dateFrameName}
                    summedTime={summedTime}
                    timeFrameName={timeFrameName}
                    onChangeView={() => setViewType(viewType === ViewTypes.AGGREGATE ? ViewTypes.DETAIL : ViewTypes.AGGREGATE)}
                    setShouldFilterSleep={setShouldFilterSleep}
                    shouldFilterSleep={shouldFilterSleep}/>
                <div className="overflow-y-auto h-[83vh]">
                    <div className="flex-col w-screen justify-evenly h-full px-2 overflow-y-auto">
                        {items.length === 0 ? (
                            <div className="font-mono text-center text-3xl">
                                This day is filled with possibilities... <br/><br/>
                                Their only masters <br/> are you and time.
                            </div>
                        ) : items.map((item, index) => {
                            let activity;
                            let activityTotalTime;

                            if (viewType === ViewTypes.DETAIL) {
                                activity = Activities.find(activity => activity.name === item.name);
                                activity = {...activity, ...item};
                                activityTotalTime = activity.end - activity.start;
                            } else {
                                activity = item.activity;
                                activityTotalTime = item.totalTime;
                            }

                            return (
                                <ActivityTotalTime
                                    key={activity.name + index}
                                    activityTotalTime={activityTotalTime}
                                    timeFrame={timeFrame}
                                    totalTime={totalTime}
                                    activity={activity}
                                    isLast={index === items.length - 1}
                                    isFirst={index === 0}/>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
};