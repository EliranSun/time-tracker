import {getTimeString} from "../../utils/time";
import classNames from "classnames";

export const ActivityTotalTime = ({activityTotalTime, timeFrame, totalTime, activity, isLast, isFirst}) => {
    const normalizedHeight = activityTotalTime / totalTime * 100 + "%";
    const hours = Math.floor(activityTotalTime / 1000 / 60 / 60);
    const minutes = Math.floor(activityTotalTime / 1000 / 60 % 60);
    const timeString = getTimeString(hours, minutes, timeFrame);
    const Icon = activity.icon;
    const onClick = () => window.history.pushState({}, "", `/stats/activity/${activity.name.toLowerCase()}`);

    return (
        <div
            className={classNames({
                "flex text-right items-center justify-between text-[2em] min-h-[20px] py-4 px-12 font-mono": true,
                "rounded-b-3xl": isLast,
                "rounded-t-3xl": isFirst,
            })}
            style={{
                backgroundColor: activity.color,
                height: normalizedHeight
            }}>
            <Icon onClick={onClick}/>
            <div className="flex flex-col items-end">
                {timeString}
            </div>
        </div>
    );
}