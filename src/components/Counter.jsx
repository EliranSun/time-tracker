import classNames from "classnames";
import { formatCounter } from "../utils/counter";

export const Counter = ({ isActive, lastStartTime, isDiscrete }) => {
    return (
        <p className={classNames("font-mono", isDiscrete ? "text-xs" : "text-6xl")}>
            {isActive ? formatCounter(lastStartTime || 0) : "00:00:00"}
        </p>
    )
};