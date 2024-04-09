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
import {ArrowFatLeft, ArrowFatRight, CaretUp, CaretDown} from "@phosphor-icons/react";
import classNames from "classnames";

const DateFrame = ({value, onClick}) => {
    return (
        <div className="flex gap-2" onClick={onClick}>
            <div className="flex flex-col items-center justify-center">
                <CaretUp size={13}/>
                <CaretDown size={13}/>
            </div>
            <div className="flex items-center gap-2">
                {value}
            </div>
        </div>
    )
};

const ViewTypes = {
    AGGREGATE: "aggregate",
    DETAIL: "detail",
    PIECHART: "piechart",
};

const NavigationButton = ({children, ...rest}) => {
    return (
        <div
            className="bg-white dark:bg-black dark:text-white dark:border dark:border-white rounded-full m-4 p-3 shadow" {...rest}>
            {children}
        </div>
    );
};

export const StatsView = ({activities}) => {
    const [timeFrame, setTimeFrame] = useState(0);
    const [dateFrame, setDateFrame] = useState(Timeframes.DAY);
    const [isExpanded, setIsExpanded] = useState(false);
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

    const dateFrameName = Object.entries(Timeframes).find(([_key, value]) => value === timeFrame)[0];
    const items = useMemo(() => {
        return viewType === ViewTypes.AGGREGATE ? sortedActivities : unsortedActivities;
    }, [viewType, sortedActivities, unsortedActivities]);

    return (
        <>
            <div className="relative">
                <StatsViewHeader
                    dateFrame={dateFrameName}
                    summedTime={summedTime}
                    timeFrameName={timeFrameName}
                    onExpandViewClick={() => setIsExpanded(!isExpanded)}
                    onChangeTimeFrame={() => setTimeFrame(prev => prev + 1 > Object.values(Timeframes).length - 1 ? 0 : prev + 1)}
                    onChangeView={() => setViewType(viewType === ViewTypes.AGGREGATE ? ViewTypes.DETAIL : ViewTypes.AGGREGATE)}
                    setShouldFilterSleep={setShouldFilterSleep}
                    shouldFilterSleep={shouldFilterSleep}/>
                <div className="overflow-y-auto h-[76vh]">
                    <div className={classNames("flex-col w-screen justify-center px-2", {
                            "flex h-full": !isExpanded,
                            "h-screen": isExpanded,
                        })}>
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
                <div className="flex justify-between items-center">
                    <NavigationButton onClick={() => setDateFrame(prev => prev + 1)}>
                        <ArrowFatLeft/>
                    </NavigationButton>
                    <DateFrame 
                        value={dateFrameName} 
                        onClick={() => setTimeFrame(prev => prev + 1 > Object.values(Timeframes).length - 1 ? 0 : prev + 1)}
                        />
                    <NavigationButton onClick={() => setDateFrame(prev => prev - 1)}>
                        <ArrowFatRight/>
                    </NavigationButton>
                </div>
            </div>
        </>
    )
};