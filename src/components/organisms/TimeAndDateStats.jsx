import {ViewTypes} from "../../constants/views";
import {ActivitiesPieChart} from "./ActivitiesPieChart";
import {Activities} from "../../constants/activities";
import {ActivityTotalTime} from "../molecules/ActivityTotalTime";

const MARGINS = 16;
const MAX_ACTIVITY_HEIGHT = 150;

export const TimeAndDateStats = ({
                                     fitScreen,
                                     totalHeight = 0,
                                     items = [],
                                     sortedActivities = [],
                                     timeFrame,
                                     totalTime,
                                     type
                                 }) => {
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
                    <div className="relative" key={activity.name + index}>
                        <ActivityTotalTime
                            activity={activity}
                            timeFrame={timeFrame}
                            isFirst={index === 0}
                            isLast={index === items.length - 1}
                            activityTotalTime={activityTotalTime}
                            height={
                                fitScreen
                                    ? activityTotalTime / totalTime * (totalHeight - MARGINS * items.length)
                                    : activityTotalTime / totalTime * items.length * MAX_ACTIVITY_HEIGHT
                            }/>
                    </div>
                )
            })}
        </div>
    );
}