import {ViewTypes} from "../../constants/views";
import {ActivitiesPieChart} from "./ActivitiesPieChart";
import {ActivityTotalTime} from "../molecules/ActivityTotalTime";
import {useActivitiesByColorOrder, useActivitiesByTime, useTotalTime} from "../../hooks/useActivitiesByView";
import {ActivitiesRainbowFilter} from "../molecules/ActivitiesRainbowFilter";
import classNames from "classnames";
import {useContext} from "react";
import {ActivitiesFilterContext} from "../../context/ActivitiesFilterContext";

const MARGINS = 16;
const MAX_ACTIVITY_HEIGHT = 150;
const ONE_HOUR_ACTIVITY_HEIGHT = 50;
const NAV_BAR_HEIGHT = 65;
const CONTROL_STRIP_HEIGHT = 16;
const HEADER_HEIGHT = 56 + CONTROL_STRIP_HEIGHT;
const STATS_NAVIGATION_HEIGHT = 70;
const BOTTOM_MARGIN = 24 + STATS_NAVIGATION_HEIGHT;

const heightByWindow = window.innerHeight - NAV_BAR_HEIGHT - HEADER_HEIGHT - BOTTOM_MARGIN;

const ActivitiesCardContainer = ({children, isFit, maxHeight}) => {
    return (
        <div
            style={{maxHeight}}
            className={classNames("w-[96vw] mx-auto rounded-2xl", {
                "flex flex-col justify-start overflow-hidden": isFit,
                "overflow-y-auto": !isFit,
            })}>
            {children}
        </div>
    );
};

const TimelineActivities = ({data, dateFrame, timeFrame}) => {
    const items = useActivitiesByTime({allActivitiesData: data, dateFrame, timeFrame});
    const [filters] = useContext(ActivitiesFilterContext);

    if (items.length === 0) {
        return <EmptyView/>;
    }

    return (
        <>
            <ActivitiesRainbowFilter items={items}/>
            <ActivitiesCardContainer maxHeight={heightByWindow}>
                {items
                    .filter(({activity}) => {
                        return !filters.includes(activity.name);
                    })
                    .map((item, index) => {
                        const {activity, start, end, totalTime: thisActivityItemsTotalTime} = item;
                        const height = thisActivityItemsTotalTime / 60 / 60 / 1000 * ONE_HOUR_ACTIVITY_HEIGHT;

                        return (
                            <ActivityTotalTime
                                key={item.name + index}
                                timeFrame={timeFrame}
                                isBordered
                                name={activity.name}
                                icon={activity.icon}
                                color={activity.color}
                                start={start}
                                end={end}
                                totalTime={thisActivityItemsTotalTime}
                                height={height}/>
                        );
                    })}
            </ActivitiesCardContainer>
        </>
    )
};

const EmptyView = ({isPast}) => {
    return (
        <div className="flex items-center h-full font-mono px-4 text-3xl">
            {isPast
                ? (
                    <p>
                        It is gone - but not forgotten... <br/><br/>
                        It is a part of you now, <br/> carved as your present.
                    </p>
                )
                : (
                    <p>
                        Filled with possibilities and potential... <br/><br/>
                        Their only masters, <br/> are you and time.
                    </p>
                )}
        </div>
    );
}

const AggregatedActivities = ({data, dateFrame, timeFrame}) => {
    const items = useActivitiesByColorOrder({allActivitiesData: data, dateFrame, timeFrame});
    const totalTime = useTotalTime({data, dateframe: dateFrame, timeframe: timeFrame});
    const [filters] = useContext(ActivitiesFilterContext);

    if (items.length === 0) {
        return <EmptyView isPast={dateFrame > 0}/>;
    }

    return (
        <>
            <ActivitiesRainbowFilter items={items}/>
            <ActivitiesCardContainer isFit>
                {items
                    .filter(({activity}) => {
                        return !filters.includes(activity.name);
                    })
                    .map((({activity, data, totalTime: thisActivityItemsTotalTime}, index) => {
                        return (
                            <ActivityTotalTime
                                timeFrame={timeFrame}
                                key={activity.name + index}
                                name={activity.name}
                                icon={activity.icon}
                                color={activity.color}
                                totalTime={thisActivityItemsTotalTime}
                                height={thisActivityItemsTotalTime / totalTime * (heightByWindow - MARGINS * items.length)}
                            />
                        );
                    }))}
            </ActivitiesCardContainer>
        </>
    )
};

export const ActivitiesStatisticsView = ({items = [], timeFrame, dateFrame, viewName}) => {
    if (items.length === 0) {
        return (
            <div className="font-mono text-center text-3xl">
                Fetching your history...
            </div>
        );
    }

    switch (viewName) {
        case ViewTypes.PIE:
            return (
                <ActivitiesPieChart
                    dateFrame={dateFrame}
                    timeFrame={timeFrame}
                    activities={items}/>
            );

        case ViewTypes.DETAIL:
            return (
                <TimelineActivities
                    data={items}
                    dateFrame={dateFrame}
                    timeFrame={timeFrame}/>
            );

        default:
        case ViewTypes.AGGREGATE:
            return (
                <AggregatedActivities
                    data={items}
                    dateFrame={dateFrame}
                    timeFrame={timeFrame}/>
            );
    }
}