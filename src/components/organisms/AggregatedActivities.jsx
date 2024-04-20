import {useActivitiesByColorOrder, useTotalTime} from "../../hooks/useActivitiesByView";
import {useContext} from "react";
import {ActivitiesFilterContext} from "../../context/ActivitiesFilterContext";
import {EmptyView} from "../molecules/ActivitiesEmptyView";
import {ActivitiesRainbowFilter} from "../molecules/ActivitiesRainbowFilter";
import {ActivitiesCardContainer} from "../atoms/ActivitiesCardContainer";
import {ActivityTotalTime} from "../molecules/ActivityTotalTime";
import {HEIGHT_BY_WINDOW, MARGINS} from "../../constants/views";

export const AggregatedActivities = ({data, dateFrame, timeFrame}) => {
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
                                height={thisActivityItemsTotalTime / totalTime * (HEIGHT_BY_WINDOW - MARGINS * items.length)}
                            />
                        );
                    }))}
            </ActivitiesCardContainer>
        </>
    )
};