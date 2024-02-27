import classNames from "classnames";
import { formatCounter } from "../utils/counter";

export const Counter = ({ lastStartTime, isDiscrete }) => {
    return (
        <p className={classNames("font-mono", isDiscrete ? "text-xs" : "text-6xl")}>
            {formatCounter(lastStartTime || 0)}
        </p>
    )
};