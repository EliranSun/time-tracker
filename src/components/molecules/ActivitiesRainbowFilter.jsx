import classNames from "classnames";
import {useMemo, useState} from "react";
import {Activities} from "../../constants/activities";

export const ActivitiesRainbowFilter = ({items = []}) => {
    const [inactiveColors, setInactiveColors] = useState([]);
    const rainbowFilterIcons = useMemo(() => {
        return [...Activities]
            .sort((a, b) => a.order - b.order)
            .filter(activity => {
                if (items.length === 0)
                    return false;

                return items.find(item => item.activity?.name?.toLowerCase() === activity.name?.toLowerCase());
            });
    }, [inactiveColors]);

    return (
        <div className="absolute top-0 right-5 flex justify-center my-2">
            {rainbowFilterIcons.map(activity => {
                const Icon = activity.icon;
                return (
                    <span
                        style={{backgroundColor: activity.color}}
                        className={classNames("w-5 h-5 flex items-center justify-center", {
                            "grayscale": inactiveColors.includes(activity.color),
                        })}
                        onClick={() => {
                            setInactiveColors(inactiveColors.includes(activity.color)
                                ? inactiveColors.filter(color => color !== activity.color)
                                : [...inactiveColors, activity.color]);
                        }}>
                    <Icon/>
                </span>
                );
            })}
        </div>
    );
};
