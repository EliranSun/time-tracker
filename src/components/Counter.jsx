import classNames from "classnames";
import {formatCounter} from "../utils/counter";

export const Counter = ({isActive, lastStartTime, isZenMode}) => {
    return (
        <p className={classNames("font-mono", isZenMode ? "flex flex-col text-[15rem] leading-[10rem]" : "text-6xl")}>
            {formatCounter(lastStartTime || 0).split(":").map((time, index) => {
                return (
                    <span key={index}>
                        {time}
                    </span>
                )
            })}
        </p>
    )
};