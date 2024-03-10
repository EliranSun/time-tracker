import { Activities } from "../constants/activities";
import classNames from "classnames";
import { Icon } from "./Icon";

const GOLD = "#FFBF00";

export const ActivitiesDungeonMap = ({ activePage, isZenMode, goldenActivity }) => {
    if (isZenMode) {
        return null;
    }

    return (
        <div className="flex justify-center w-screen">
            <div className="grid grid-cols-4 grid-rows-3 gap-2">
                {Activities.map(activity => {
                    const isActive = activePage?.toLowerCase() === activity.name?.toLowerCase();
                    const isGolden = goldenActivity === activity.name;
                    
                    return (
                        <span
                            key={activity.name}
                            style={{ backgroundColor: isActive ? activity.color : "" }}
                            className={classNames("w-4 h-4 flex items-center justify-center", {
                                "bg-gray-500 text-white dark:bg-white dark:text-black opacity-80": isActive,
                                "opacity-30": !isActive && !isGolden,
                                "rounded-full border border-yellow-400": isGolden,
                            })}>
                            <Icon 
                                color={isGolden && GOLD}
                                weight={isGolden ? "fill" : "regular"}
                                name={activity.icon}/>
                        </span>
                    );
                })}
            </div>
        </div>
    )
};