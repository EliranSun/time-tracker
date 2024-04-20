import {ViewTypes} from "../../constants/views";
import {ActivitiesPieChart} from "./ActivitiesPieChart";
import {TimelineActivities} from "./TimelineActivities";
import {AggregatedActivities} from "./AggregatedActivities";

export const ActivitiesStatisticsView = ({items = [], timeFrame, dateFrame, viewName}) => {
    if (items.length === 0) {
        return (
            <div className="font-mono text-center text-3xl">
                Fetching your history...
            </div>
        );
    }

    switch (viewName) {
        default:
        case ViewTypes.AGGREGATE:
            return (
                <AggregatedActivities
                    data={items}
                    dateFrame={dateFrame}
                    timeFrame={timeFrame}/>
            );

        case ViewTypes.DETAIL:
            return (
                <TimelineActivities
                    data={items}
                    dateFrame={dateFrame}
                    timeFrame={timeFrame}/>
            );

        case ViewTypes.PIE:
            return (
                <ActivitiesPieChart
                    dateFrame={dateFrame}
                    timeFrame={timeFrame}
                    activities={items}/>
            );
    }
}