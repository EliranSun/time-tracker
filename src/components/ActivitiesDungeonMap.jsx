import { Activities } from "../constants/activities";
import classNames from "classnames";
import { Icon } from "./Icon";
import {useOldestActivity} from "../hooks/useOldestActivity";

const GOLD = "#FFBF00";

export const ActivitiesDungeonMap = ({ activePage, isZenMode }) => {
    const oldestActivityName = useOldestActivity();

    console.log({oldestActivityName});

    if (isZenMode) {
        return null;
    }

    return (
        <div className="flex justify-center w-screen">
            <div className="grid grid-cols-4 grid-rows-3 gap-1">
                {Activities.map(activity => {
                    const isActive = activePage?.toLowerCase() === activity.name?.toLowerCase();
                    const isGolden = oldestActivityName === activity.name;
                    
                    return (
                        <span
                            key={activity.name}
                            style={{ backgroundColor: isActive ? activity.color : "" }}
                            className={classNames("size-5 flex items-center justify-center p-px", {
                                "bg-gray-500 text-white dark:bg-white dark:text-black opacity-80": isActive,
                                "opacity-30": !isActive && !isGolden,
                                "outline outline-2 outline-offset-2 outline-yellow-400": isGolden,
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