import { Activities } from "../constants/activities";
import classNames from "classnames";
import { Icon } from "./Icon";

export const ActivitiesDungeonMap = ({ activePage, isZenMode }) => {
    if (isZenMode) {
        return null;
    }

    return (
        <div className="flex justify-center w-screen">
            <div className="grid grid-cols-4 grid-rows-3 gap-2">
                {Activities.map(activity => {
                    const isActive = activePage?.toLowerCase() === activity.name?.toLowerCase();
                    return (
                        <span
                            key={activity.name}
                            style={{ backgroundColor: isActive ? activity.color : "" }}
                            className={classNames("w-4 h-4 flex items-center justify-center", {
                                "bg-gray-500 text-white dark:bg-white dark:text-black opacity-80": isActive,
                                "opacity-30": !isActive,
                            })}>
                            <Icon name={activity.icon}/>
                        </span>
                    );
                })}
            </div>
        </div>
    )
};