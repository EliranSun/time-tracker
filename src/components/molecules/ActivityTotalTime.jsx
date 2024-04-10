import {getTimeString} from "../../utils/time";
import classNames from "classnames";
import {readableColor} from 'polished';

export const ActivityTotalTime = ({activityTotalTime, timeFrame, totalTime, activity, isLast, isFirst}) => {
    const normalizedHeight = activityTotalTime / totalTime * 100 + "%";
    const hours = Math.floor(activityTotalTime / 1000 / 60 / 60);
    const minutes = Math.floor(activityTotalTime / 1000 / 60 % 60);
    const timeString = getTimeString(hours, minutes, timeFrame);
    const Icon = activity.icon;
    const onClick = () => window.history.pushState({}, "", `/stats/activity/${activity.name.toLowerCase()}`);
    const textColor = readableColor(activity.color);

    return (
        <div
            className={classNames({
                "flex items-center justify-center text-lg min-h-12 py-4 px-12 font-mono": true,
                "rounded-b-3xl": isLast,
                "rounded-t-3xl": isFirst,
            })}
            style={{
                color: textColor,
                backgroundColor: activity.color,
                height: normalizedHeight
            }}>
            <div className="flex w-40 items-center">
                <Icon onClick={onClick}/>
                <div className="ml-2">
                    {timeString}
                </div>
                {new Date(activity.end).toLocaleTimeString("he-IL")}
            </div>
        </div>
    );
}