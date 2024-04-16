import {getTimeString} from "../../utils/time";
import classNames from "classnames";
import {readableColor} from 'polished';

const MIN_ACTIVITY_HEIGHT = 20;

export const ActivityTotalTime = ({
                                      activityTotalTime,
                                      height = 0,
                                      timeFrame,
                                      activity,
                                      isLast,
                                      isFirst
                                  }) => {
    const timeString = getTimeString(activityTotalTime, timeFrame);

    const Icon = activity.icon;
    const onClick = () => window.history.pushState({}, "", `/stats/activity/${activity.name.toLowerCase()}`);
    const textColor = readableColor(activity.color);
    const dateString = new Date(activity.start).toLocaleDateString("he-IL");
    const dateTimeString = new Date(activity.start).toLocaleTimeString("he-IL", {
        hour: "2-digit",
        minute: "2-digit"
    });

    return (
        <div
            className={classNames({
                // "shrink": true,
                "flex items-center justify-between text-lg min-h-12 py-4 px-12 font-mono": true,
                "rounded-b-3xl": isLast,
                "rounded-t-3xl": isFirst,
            })}
            style={{
                color: textColor,
                backgroundColor: activity.color,
                height
            }}>
            <div className="flex items-center gap-1">
                <Icon onClick={onClick}/>
                <div className="ml-2">
                    {timeString}
                </div>
            </div>

            {dateString.toString() !== "Invalid Date" ?
                <div className="text-xs">
                    {dateString}, {dateTimeString}
                </div> : ""}
        </div>
    );
}