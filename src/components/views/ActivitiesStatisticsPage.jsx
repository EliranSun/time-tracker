import {useContext, useState} from "react";
import {ActivitiesContext} from "../../context/ActivitiesContext";
import {useTimeAndDateFrame} from "../../hooks/useTimeAndDateFrame";
import {Timeframes} from "../../constants/time";
import {StatsViewHeader} from "../molecules/StatsViewHeader";
import {ArrowFatLeft, ArrowFatRight} from "@phosphor-icons/react";
import {ViewTypes} from "../../constants/views";
import {DateNavigation} from "../atoms/DateNavigation";
import {NavigationButton} from "../atoms/NavigationButton";
import {ActivitiesStatisticsView} from "../organisms/ActivitiesStatisticsView";
import {useTimeSum} from "../../hooks/useActivitiesByView";

export const ActivitiesStatisticsPage = () => {
    const [timeFrame, setTimeFrame] = useState(0);
    const [dateFrame, setDateFrame] = useState(Timeframes.DAY);
    const {activities} = useContext(ActivitiesContext);
    const {timeFrameName} = useTimeAndDateFrame(timeFrame, dateFrame);
    const [viewName, setViewName] = useState(ViewTypes.AGGREGATE);
    const totalTime = useTimeSum({data: activities, timeFrame, dateFrame});

    return (
        <>
            <div className="relative w-screen">
                <StatsViewHeader
                    timeFrameName={timeFrameName}
                    viewName={viewName}
                    totalTime={totalTime}
                    onChangeView={setViewName}/>
                <div className="h-[84vh] flex flex-col justify-between">
                    <ActivitiesStatisticsView
                        items={activities}
                        timeFrame={timeFrame}
                        dateFrame={dateFrame}
                        viewName={viewName}/>
                    <div className="flex justify-between items-center">
                        <NavigationButton onClick={() => setDateFrame(prev => prev + 1)}>
                            <ArrowFatLeft/>
                        </NavigationButton>
                        <DateNavigation
                            value={Object.entries(Timeframes).find(([_key, value]) => value === timeFrame)[0]}
                            onClick={() => setTimeFrame(prev => prev + 1 > Object.values(Timeframes).length - 1 ? 0 : prev + 1)}/>
                        <NavigationButton onClick={() => setDateFrame(prev => prev - 1)}>
                            <ArrowFatRight/>
                        </NavigationButton>
                    </div>
                </div>
            </div>
        </>
    )
};