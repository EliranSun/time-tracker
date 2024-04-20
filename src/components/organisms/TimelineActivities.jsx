import {useActivitiesByTime} from "../../hooks/useActivitiesByView";
import {useContext} from "react";
import {ActivitiesFilterContext} from "../../context/ActivitiesFilterContext";
import {EmptyView} from "../molecules/ActivitiesEmptyView";
import {ActivitiesRainbowFilter} from "../molecules/ActivitiesRainbowFilter";
import {ActivitiesCardContainer} from "../atoms/ActivitiesCardContainer";
import {HEIGHT_BY_WINDOW, ONE_HOUR_ACTIVITY_HEIGHT} from "../../constants/views";
import {ActivityTotalTime} from "../molecules/ActivityTotalTime";

export const TimelineActivities = ({data, dateFrame, timeFrame}) => {
    const items = useActivitiesByTime({allActivitiesData: data, dateFrame, timeFrame});
    const [filters] = useContext(ActivitiesFilterContext);

    if (items.length === 0) {
        return <EmptyView/>;
    }

    return (
        <>
            <div className="mb-2">
                <ActivitiesRainbowFilter items={items}/>
            </div>
            <ActivitiesCardContainer maxHeight={HEIGHT_BY_WINDOW}>
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