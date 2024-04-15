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

const MIN_ACTIVITY_HEIGHT = 20;
const NAV_BAR_HEIGHT = 65;
const CONTROL_STRIP_HEIGHT = 16;
const HEADER_HEIGHT = 56 + CONTROL_STRIP_HEIGHT;
const STATS_NAVIGATION_HEIGHT = 70;
const BOTTOM_MARGIN = 24 + STATS_NAVIGATION_HEIGHT;

export const StatsView = ({activities}) => {
    const [timeFrame, setTimeFrame] = useState(0);
    const [dateFrame, setDateFrame] = useState(Timeframes.DAY);
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

    const isDetailView = ViewNav[viewType] === ViewNav[ViewTypes.DETAIL];
    const dateFrameName = Object.entries(Timeframes).find(([_key, value]) => value === timeFrame)[0];
    const items = useMemo(() => {
        return viewType === ViewTypes.AGGREGATE ? sortedActivities : unsortedActivities;
    }, [viewType, sortedActivities, unsortedActivities]);

    const totalHeight = isDetailView
        ? items * MIN_ACTIVITY_HEIGHT
        : window.innerHeight - NAV_BAR_HEIGHT - HEADER_HEIGHT - BOTTOM_MARGIN;

    return (
        <>
            <div className="relative">
                <StatsViewHeader
                    summedTime={summedTime}
                    timeFrameName={timeFrameName}
                    viewName={viewType}
                    onChangeView={() => setViewType(ViewNav[viewType])}
                    inactiveColors={inactiveColors}
                    setInactiveColors={setInactiveColors}/>
                <div
                    style={{height: totalHeight + "px"}}
                    className={classNames("overflow-y-auto flex-col w-screen justify-start px-2", {
                        "flex": !isDetailView,
                    })}>
                    <TimeAndDateStats
                        items={items}
                        fitScreen={!isDetailView}
                        sortedActivities={sortedActivities}
                        totalHeight={totalHeight}
                        timeFrame={timeFrame}
                        totalTime={totalTime}
                        type={viewType}/>
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