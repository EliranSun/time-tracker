import classNames from "classnames";
import {formatCounter} from "../utils/counter";

export const Counter = ({isActive, lastStartTime, isZenMode}) => {
    return (
        <p className={classNames("font-mono", isZenMode ? "text-7xl" : "text-6xl")}>
            {isActive ? formatCounter(lastStartTime || 0) : "00:00:00"}
        </p>
    )
};