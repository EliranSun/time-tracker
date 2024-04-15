import {ViewTypes} from "../../constants/views";
import {ActivitiesPieChart} from "./ActivitiesPieChart";
import {Activities} from "../../constants/activities";
import {ActivityTotalTime} from "../molecules/ActivityTotalTime";

const MAX_ACTIVITY_HEIGHT = 200;

export const TimeAndDateStats = ({items = [], sortedActivities = [], timeFrame, totalTime, type}) => {
    if (items.length === 0) {
        return (
            <div className="font-mono text-center text-3xl">
                This day is filled with possibilities... <br/><br/>
                Their only masters <br/> are you and time.
            </div>
        );
    }

    if (type === ViewTypes.PIECHART) {
        return <ActivitiesPieChart activities={sortedActivities}/>;
    }

    return (
        <div>
        {items.length * MAX_ACTIVITY_HEIGHT}
    {items.map((item, index) => {
        let activity;
        let activityTotalTime;

        if (type === ViewTypes.DETAIL) {
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
                totalHeight={items.length * MAX_ACTIVITY_HEIGHT}
                activity={activity}
                isLast={index === items.length - 1}
                isFirst={index === 0}/>
        )
    })}
        </div>
        );
}