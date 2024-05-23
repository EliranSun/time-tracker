import classNames from "classnames";
import {Icon} from "./Icon";
import {getAppBackgroundColor} from "../utils/colors";
import {readableColor} from "polished";
import {useOldestActivity} from "../hooks/useOldestActivity";

export const ActivitiesDungeonMap = ({activities = [], activePage, isZenMode}) => {
    const oldestActivityName = useOldestActivity();
    const backgroundColor = getAppBackgroundColor();

    if (isZenMode) {
        return null;
    }

    return (
        <div className="relative z-20 flex justify-center w-screen">
            <div className="grid grid-cols-4 grid-rows-3 gap-1">
                {activities.map(activity => {
                    const isActive = activePage?.toLowerCase() === activity.name?.toLowerCase();
                    const isHighlighted = oldestActivityName === activity.name;
                    const textColor = readableColor(isActive ? activity.color : backgroundColor);

                    return (
                        <span
                            key={activity.name}
                            style={{
                                color: textColor,
                                backgroundColor: isActive ? activity.color : ""
                            }}
                            className={classNames("size-5 flex items-center justify-center p-px", {
                                "bg-gray-500 text-white dark:bg-white opacity-80": isActive,
                                "opacity-30": !isActive && !isHighlighted,
                            })}>
                            <Icon
                                name={activity.icon}
                                weight={isHighlighted ? "fill" : "regular"}
                                className={classNames({
                                    "animate-ping-slow": isHighlighted,
                                })}/>
                            {isHighlighted ?
                                // duplicate icon for highlight animation
                                <div className="absolute">
                                    <Icon
                                        weight={isHighlighted ? "fill" : "regular"}
                                        name={activity.icon}/>
                                </div>
                                : null}
                        </span>
                    );
                })}
            </div>
        </div>
    )
};