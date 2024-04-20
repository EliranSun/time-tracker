import classNames from "classnames";
import {useMemo} from "react";
import {Activities} from "../../constants/activities";
import {useContext} from "react";
import {ActivitiesFilterContext} from "../../context/ActivitiesFilterContext";

export const ActivitiesRainbowFilter = ({items = []}) => {
    const [filters, setFilters] = useContext(ActivitiesFilterContext);

    const rainbowFilterIcons = useMemo(() => {
        return [...Activities]
            .sort((a, b) => a.order - b.order)
            .filter(activity => {
                if (items.length === 0)
                    return false;

                return items.find(item => item.activity?.name?.toLowerCase() === activity.name?.toLowerCase());
            });
    }, [items]);

    return (
        <div className="flex justify-center">
            {rainbowFilterIcons.map(activity => {
                const Icon = activity.icon;
                return (
                    <span
                        key={activity.name}
                        style={{backgroundColor: activity.color}}
                        className={classNames("size-8 flex items-center justify-center", {
                            "grayscale opacity-30": filters.includes(activity.name),
                        })}
                        onClick={() => {
                            setFilters(filters.includes(activity.name)
                                ? filters.filter(name => name !== activity.name)
                                : [...filters, activity.name]);
                        }}>
                    <Icon/>
                </span>
                );
            })}
        </div>
    );
};
