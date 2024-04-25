import classNames from "classnames";
import {formatCountSince} from "../utils/counter";

export const StartTimeCounter = ({startTime = 0, isZenMode}) => {
        const formattedCounter = formatCountSince(startTime);

        // is active is important because we don't want to show the counter when switching activities, while one is active
        return (
            <p className={classNames("font-mono", {
                "flex flex-col text-[15rem] leading-[11.2rem]": isZenMode,
                "text-6xl": !isZenMode,
            })}>
                {isZenMode ? formattedCounter.split(":").map((time, index) => {
                    return (
                        <span key={index} className={classNames({
                            "opacity-80": index === 0,
                            "opacity-60": index === 1,
                            "opacity-30": index === 2,
                        })}>
                        {time}
                    </span>
                    )
                }) : formattedCounter}
            </p>
        )
    }
;