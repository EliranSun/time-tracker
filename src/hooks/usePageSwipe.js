import { useSwipeable } from "react-swipeable";
import { PageMazeMap } from "../constants/activities";
import { useEffect } from "react";
import {noop} from "lodash";

export const usePageSwipe = (onSwipe = noop) => {
    const handlers = useSwipeable({
        // left/right swapped to mimic "natural" scrolling direction
        onSwipedLeft: () => onSwipe(prevPage => PageMazeMap[prevPage].Left),
        onSwipedRight: () => onSwipe(prevPage => PageMazeMap[prevPage].Right),
        onSwipedUp: () => onSwipe(prevPage => PageMazeMap[prevPage].Up),
        onSwipedDown: () => onSwipe(prevPage => PageMazeMap[prevPage].Down),
    });

    useEffect(() => {
        const listener = (e) => {
            switch (e.key) {
                case "ArrowLeft":
                    onSwipe(prevPage => PageMazeMap[prevPage].Left);
                    break;
                case "ArrowRight":
                    onSwipe(prevPage => PageMazeMap[prevPage].Right);
                    break;
                case "ArrowUp":
                    onSwipe(prevPage => PageMazeMap[prevPage].Up);
                    break;
                case "ArrowDown":
                    onSwipe(prevPage => PageMazeMap[prevPage].Down);
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