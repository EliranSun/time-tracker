import {useContext, useEffect, useState} from "react";
import {ActivitiesContext} from "../../context/ActivitiesContext";
import {getAllDocsInActivity} from "../../utils/db";
import {useTimeAndDateFrame} from "../../hooks/useTimeAndDateFrame";
import {Timeframes} from "../../constants/time";
import {StatsViewHeader} from "../molecules/StatsViewHeader";
import {ArrowFatLeft, ArrowFatRight} from "@phosphor-icons/react";
import {ViewNav, ViewTypes} from "../../constants/views";
import {DateNavigation} from "../atoms/DateNavigation";
import {NavigationButton} from "../atoms/NavigationButton";
import {ActivitiesStatisticsView} from "../organisms/ActivitiesStatisticsView";

export const ActivitiesStatisticsPage = ({activities}) => {
    const [timeFrame, setTimeFrame] = useState(0);
    const [dateFrame, setDateFrame] = useState(Timeframes.DAY);
    const [allActivitiesData, setAllActivitiesData] = useContext(ActivitiesContext);
    const {timeFrameName} = useTimeAndDateFrame(timeFrame, dateFrame);
    const [viewName, setViewName] = useState(ViewTypes.AGGREGATE);
    const [inactiveColors, setInactiveColors] = useState([]);

    useEffect(() => {
        Promise
            .all(activities.map(activity => getAllDocsInActivity(activity.name)))
            .then(results => {
                setAllActivitiesData(results);
            });
    }, []);
    
    return (
        <>
            <div className="relative">
                <StatsViewHeader
                    timeFrameName={timeFrameName}
                    viewName={viewName}
                    items={allActivitiesData}
                    onChangeView={() => setViewName(ViewNav[viewName])}
                    inactiveColors={inactiveColors}
                    setInactiveColors={setInactiveColors}/>
                <ActivitiesStatisticsView
                    items={allActivitiesData}
                    timeFrame={timeFrame}
                    viewName={viewName}/>
                <div className="flex justify-between items-center">
                    <NavigationButton onClick={() => setDateFrame(prev => prev + 1)}>
                        <ArrowFatLeft/>
                    </NavigationButton>
                    <DateNavigation
                        value={Object.entries(Timeframes).find(([_key, value]) => value === timeFrame)[0]}
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