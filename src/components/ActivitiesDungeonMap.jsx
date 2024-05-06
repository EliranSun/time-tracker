import classNames from "classnames";
import {Icon} from "./Icon";
import {getAppBackgroundColor} from "../utils/colors";
import {readableColor} from "polished";
import {useOldestActivity} from "../hooks/useOldestActivity";
import {Activities} from "../constants/activities";

export const ActivitiesDungeonMap = ({activePage, isZenMode}) => {
    const oldestActivityName = useOldestActivity();
    const backgroundColor = getAppBackgroundColor();

    if (isZenMode) {
        return null;
    }

    return (
        <div className="relative z-20 flex justify-center w-screen">
            <div className="grid grid-cols-4 grid-rows-3 gap-1">
                {Activities
                    .filter(activity => !activity.isArchived)
                    .map(activity => {
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
                                weight={isHighlighted ? "fill" : "regular"}
                                name={activity.icon}
                                className={classNames({
                                    "animate-ping-slow": isHighlighted,
                                })}/>
                            {isHighlighted ? // duplicate icon for highlight animation
                                <span className="absolute">
                                <Icon
                                    weight={isHighlighted ? "fill" : "regular"}
                                    name={activity.icon}/>
                                </span> : null}
                        </span>
                    );
                })}
            </div>
        </div>
    )
};