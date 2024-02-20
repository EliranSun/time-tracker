import {Activities} from "../constants/activities";
import classNames from "classnames";
import {Icon} from "./Icon";

export const ActivitiesDungeonMap = ({activePage}) => {
    return (
        <div className="absolute top-40 flex justify-center w-screen">
            <div className="grid grid-cols-4 grid-rows-3 gap-2">
                {Activities.map(activity => {
                    const isActive = activePage?.toLowerCase() === activity.name?.toLowerCase();
                    return (
                        <span
                            key={activity.name}
                            className={classNames("w-4 h-4", {
                                "bg-white text-black opacity-50": isActive,
                                "opacity-40": !isActive,
                            })}>
                                            <Icon name={activity.icon}/>
                                        </span>
                    );
                })}
            </div>
        </div>
    )
};