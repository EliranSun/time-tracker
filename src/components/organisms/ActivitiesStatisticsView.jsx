import {ViewTypes} from "../../constants/views";
import {ActivitiesPieChart} from "./ActivitiesPieChart";
import {ActivityTotalTime} from "../molecules/ActivityTotalTime";
import {useActivitiesByColorOrder, useActivitiesByTime, useTotalTime} from "../../hooks/useActivitiesByView";
import {ActivitiesRainbowFilter} from "../molecules/ActivitiesRainbowFilter";

const MARGINS = 16;
const MAX_ACTIVITY_HEIGHT = 150;
const MIN_ACTIVITY_HEIGHT = 20;
const NAV_BAR_HEIGHT = 65;
const CONTROL_STRIP_HEIGHT = 16;
const HEADER_HEIGHT = 56 + CONTROL_STRIP_HEIGHT;
const STATS_NAVIGATION_HEIGHT = 70;
const BOTTOM_MARGIN = 24 + STATS_NAVIGATION_HEIGHT;

const SortedByTimeActivitiesView = ({data, dateFrame, timeFrame}) => {
    const items = useActivitiesByTime({allActivitiesData: data, dateFrame, timeFrame});
    const totalTime = useTotalTime({data, dateframe: dateFrame, timeframe: timeFrame});
    const totalHeight = items * MIN_ACTIVITY_HEIGHT;
    console.log({items});

    return (
        <>
            <ActivitiesRainbowFilter items={items}/>
            <div
                style={{height: totalHeight + "px"}}
                className="overflow-y-auto flex-col w-screen justify-start px-2 rounded-3xl">
                {items.map((item, index) => {
                    const {activity, data, totalTime: thisActivityItemsTotalTime} = item;
                    // const activityTotalTime = item.end - item.start;

                    return (
                        <ActivityTotalTime
                            key={item.name + index}
                            timeFrame={timeFrame}
                            name={activity.name}
                            icon={activity.icon}
                            color={activity.color}
                            start={item.start}
                            end={item.end}
                            totalTime={thisActivityItemsTotalTime}
                            height={thisActivityItemsTotalTime / totalTime * items.length * MAX_ACTIVITY_HEIGHT}/>
                    );
                })}
            </div>
        </>
    )
};

const SortedByColorActivitiesView = ({data, dateFrame, timeFrame}) => {
    const items = useActivitiesByColorOrder({allActivitiesData: data, dateFrame, timeFrame});
    const totalTime = useTotalTime({data, dateframe: dateFrame, timeframe: timeFrame});
    const totalHeight = window.innerHeight - NAV_BAR_HEIGHT - HEADER_HEIGHT - BOTTOM_MARGIN;

    return (
        <>
            <ActivitiesRainbowFilter items={items}/>
            <div
                style={{height: totalHeight + "px"}}
                className="flex flex-col w-screen justify-start px-2 rounded-3xl">
                {items.map((({activity, data, totalTime: thisActivityItemsTotalTime}, index) => {
                    return (
                        <ActivityTotalTime
                            timeFrame={timeFrame}
                            key={activity.name + index}
                            name={activity.name}
                            icon={activity.icon}
                            color={activity.color}
                            totalTime={thisActivityItemsTotalTime}
                            height={thisActivityItemsTotalTime / totalTime * (totalHeight - MARGINS * items.length)}
                        />
                    );
                }))}
            </div>
        </>
    )
};

export const ActivitiesStatisticsView = ({items = [], timeFrame, dateFrame, viewName}) => {
    if (items.length === 0) {
        return (
            <div className="font-mono text-center text-3xl">
                This day is filled with possibilities... <br/><br/>
                Their only masters <br/> are you and time.
            </div>
        );
    }

    switch (viewName) {
        case ViewTypes.PIECHART:
            return <ActivitiesPieChart activities={items}/>;

        case ViewTypes.DETAIL:
            return <SortedByTimeActivitiesView data={items} dateFrame={dateFrame} timeFrame={timeFrame}/>;

        default:
        case ViewTypes.AGGREGATE:
            return <SortedByColorActivitiesView data={items} dateFrame={dateFrame} timeFrame={timeFrame}/>;
    }
}