import classNames from "classnames";
import { useOrientation } from "react-use";
import { getLastWeekData } from "../utils/activities";
import { useActivityData } from "../hooks/useActivityData";

export const LastWeekDataStrip = ({ activity }) => {
    const orientationState = useOrientation();
    const activitiesData = useActivityData([activity.name]);

    return (
        <div className={classNames("absolute flex justify-center w-fit", {
            "bottom-28 m-auto text-center left-0 right-0": orientationState.angle === 0,
            "top-0 m-auto right-0": orientationState.angle === 90 || orientationState.angle === 270,
        })}>
            {getLastWeekData(activity.name, activitiesData).map((item, index) => {
                return (
                    <div
                        key={item.name}
                        className={classNames("py-1 px-4")}>
                        <p>{item.duration}</p>
                        <p>{item.name.slice(0, 1)}</p>
                    </div>
                )
            })}
        </div>
    );
};
