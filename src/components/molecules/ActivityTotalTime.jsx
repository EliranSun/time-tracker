import {getTimeString} from "../../utils/time";
import classNames from "classnames";
import {readableColor} from 'polished';

// TODO: Rename. something with color? maybe ActivityColorTotalTime
export const ActivityTotalTime = ({
    totalTime,
    height = 0,
    timeFrame,
    icon: Icon,
    start,
    end,
    name,
    color,
}) => {
    const timeString = getTimeString(totalTime, timeFrame);
    const onClick = () => window.history.pushState({}, "", `/stats/activity/${name.toLowerCase()}`);
    const textColor = readableColor(color);
    const dateString = start ? new Date(start).toLocaleDateString("he-IL") : "";
    const dateTimeString = end ? new Date(end).toLocaleTimeString("he-IL", {
        hour: "2-digit",
        minute: "2-digit"
    }) : "";

    return (
        <div
            className={classNames({
                "flex items-center justify-between text-lg min-h-12 py-4 px-12 font-mono": true,
            })}
            style={{
                height,
                color: textColor,
                backgroundColor: color,
            }}>
            <div className="flex items-center gap-1">
                <Icon onClick={onClick}/>
                <div className="ml-2">
                    {timeString}
                </div>
            </div>

            {(dateString.toString() !== "Invalid Date" && dateTimeString.toString() !== "") ?
                <div className="text-xs">
                    {dateString}, {dateTimeString}
                </div> : ""}
        </div>
    );
}