import classNames from "classnames";
import {formatCounter} from "../utils/counter";

export const Counter = ({isActive, lastStartTime, isZenMode}) => {
        // is active is important because we don't want to show the counter when switching activities, while one is active
        return (
            <p className={classNames("font-mono", isZenMode ? "flex flex-col text-[15rem] leading-[11rem]" : "text-6xl")}>
                {formatCounter(isActive ? lastStartTime || 0 : 0).split(isZenMode ? ":" : "").map((time, index) => {
                    return (
                        <span key={index} className={classNames({
                            "opacity-80": index === 0,
                            "opacity-60": index === 1,
                            "opacity-40": index === 2,
                        })}>
                        {time}
                    </span>
                    )
                })}
            </p>
        )
    }
;