import { useSwipeable } from "react-swipeable";
import { useEffect } from "react";
import {noop} from "lodash";

const advanceTime = time => time + 1;
const retreatTime = time => time - 1;
const upperTimeFrame = timeFrame => timeFrame + 1;
const lowerTimeFrame = timeFrame => timeFrame - 1;

export const useTimeSwipe = (onDateSwipe = noop, onTimeFrameSwipe = noop) => {

    const handlers = useSwipeable({
        onSwipedLeft: () => onDateSwipe(advanceTime),
        onSwipedRight: () => onDateSwipe(retreatTime),
        onSwipedUp: () => onTimeFrameSwipe(upperTimeFrame),
        onSwipedDown: () => onTimeFrameSwipe(lowerTimeFrame),
    });

    useEffect(() => {
        const listener = (e) => {
            switch (e.key) {
                case "ArrowLeft":
                    onDateSwipe(advanceTime);
                    break;
                case "ArrowRight":
                    onDateSwipe(retreatTime);
                    break;
                case "ArrowUp":
                    onTimeFrameSwipe(upperTimeFrame);
                    break;
                case "ArrowDown":
                    onTimeFrameSwipe(lowerTimeFrame);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', listener);

        return () => window.removeEventListener('keydown', listener);
    }, []);

    return handlers;
};
