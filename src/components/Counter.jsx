import classNames from "classnames";
import {formatCounter} from "../utils/counter";

export const Counter = ({isActive, lastStartTime, isZenMode}) => {
    // is active is important because we don't want to show the counter when switching activities, while one is active
    return (
        <p className={classNames("font-mono", isZenMode ? "flex flex-col text-[15rem] leading-[10rem]" : "text-6xl")}>
            {isActive ? formatCounter(lastStartTime || 0).split(isZenMode ? ":" : "").map((time, index) => {
                return (
                    <span key={index}>
                        {time}
                    </span>
                )
            }) : "00:00:00"}
        </p>
    )
};