import { useEffect, useState } from "react";
import { formatDay, formatMonth, formatWeek, formatYear } from "../utils/time";
import { format } from "date-fns";

export function useTimeAndDateFrame(timeFrame, dateFrame) {
    // TODO: Two different hooks
    const [timeFrameName, setTimeFrameName] = useState(format(new Date(), "EEEE"));
    const [adjacentTimeframes, setAdjacentTimeframes] = useState({
        previous: "",
        next: "",
        lower: "",
        higher: ""
    });

    useEffect(() => {
        // TODO: We can refactor to without an effect
        switch (true) {
            default:
            case timeFrame % 5 === 0:
                // day
                setTimeFrameName(formatDay(dateFrame));
                setAdjacentTimeframes({
                    previous: formatDay(dateFrame + 1),
                    next: formatDay(dateFrame - 1),
                    higher: "week",
                    lower: "all"
                });
                break;

            case timeFrame % 5 === 1:
                // week
                setTimeFrameName(formatWeek(dateFrame));
                setAdjacentTimeframes({
                    previous: formatWeek(dateFrame + 1),
                    next: formatWeek(dateFrame - 1),
                    higher: "month",
                    lower: "day"
                });
                break;

            case timeFrame % 5 === 2:
                // month
                setTimeFrameName(formatMonth(dateFrame));
                setAdjacentTimeframes({
                    previous: formatMonth(dateFrame + 1),
                    next: formatMonth(dateFrame - 1),
                    higher: "year",
                    lower: "week"
                });
                break;

            case timeFrame % 5 === 3:
                // year
                setTimeFrameName(formatYear(dateFrame));
                setAdjacentTimeframes({
                    previous: formatYear(dateFrame + 1),
                    next: formatYear(dateFrame - 1),
                    higher: "all",
                    lower: "month"
                });
                break;

            case timeFrame % 5 === 4:
                // all
                setTimeFrameName("all");
                setAdjacentTimeframes({
                    previous: "all",
                    next: "all",
                    higher: "day",
                    lower: "year"
                });
                break;
        }
    }, [dateFrame, timeFrame]);

    return { timeFrameName, adjacentTimeframes, setAdjacentTimeframes };
}