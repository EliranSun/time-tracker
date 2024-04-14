import {useContext, useEffect, useMemo, useState} from "react";
import {ActivitiesContext} from "../../context/ActivitiesContext";
import {getAllDocsInActivity} from "../../utils/db";
import {formatTimestamp} from "../../utils/time";
import {useTimeAndDateFrame} from "../../hooks/useTimeAndDateFrame";
import {useTotalTime} from "../../hooks/useTotalTime";
import {Timeframes} from "../../constants/time";
import {StatsViewHeader} from "../molecules/StatsViewHeader";
import {ArrowFatLeft, ArrowFatRight} from "@phosphor-icons/react";
import classNames from "classnames";
import {ViewNav, ViewTypes} from "../../constants/views";
import {DateNavigation} from "../atoms/DateNavigation";
import {NavigationButton} from "../atoms/NavigationButton";
import {TimeAndDateStats} from "../organisms/TimeAndDateStats";

export const StatsView = ({activities}) => {
    const [timeFrame, setTimeFrame] = useState(0);
    const [dateFrame, setDateFrame] = useState(Timeframes.DAY);
    const [isExpanded, setIsExpanded] = useState(false);
    const [allActivitiesData, setAllActivitiesData] = useContext(ActivitiesContext);
    const {timeFrameName} = useTimeAndDateFrame(timeFrame, dateFrame);
    const [viewType, setViewType] = useState(ViewTypes.AGGREGATE);
    const [inactiveColors, setInactiveColors] = useState([]);
    const {totalTime, sortedActivities, unsortedActivities} = useTotalTime({
        activities,
        allActivitiesData,
        dateFrame,
        timeFrame,
        inactiveColors
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
                    isExpanded={isExpanded}
                    onExpandViewClick={() => setIsExpanded(!isExpanded)}
                    onChangeTimeFrame={() => setTimeFrame(prev => prev + 1 > Object.values(Timeframes).length - 1 ? 0 : prev + 1)}
                    onChangeView={() => setViewType(ViewNav[viewType])}
                    inactiveColors={inactiveColors}
                    setInactiveColors={setInactiveColors}/>
                <div className="overflow-y-auto h-[73vh]">
                    <div className={classNames("flex-col w-screen justify-center px-2", {
                        "flex flex-col h-fit": !isExpanded,
                        "flex flex-col h-max": isExpanded,
                    })}>
                        <TimeAndDateStats
                            items={items}
                            sortedActivities={sortedActivities}
                            timeFrame={timeFrame}
                            totalTime={totalTime}
                            type={viewType}/>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <NavigationButton onClick={() => setDateFrame(prev => prev + 1)}>
                        <ArrowFatLeft/>
                    </NavigationButton>
                    <DateNavigation
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