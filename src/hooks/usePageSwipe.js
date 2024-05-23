import {useSwipeable} from "react-swipeable";
import {PageMazeMap} from "../constants/activities";
import {useEffect} from "react";
import {noop, upperFirst} from "lodash";

const Actions = {
    Up: "Up",
    Down: "Down",
    Left: "Left",
    Right: "Right",
};

const swipeAction = (action, onSwipe, activities = []) => {
    onSwipe(prevPage => {
        const nextPage = PageMazeMap[upperFirst(prevPage)][action];
        const activity = activities.find(activity => activity.name.toLowerCase() === nextPage.toLowerCase());
        debugger;
        if (activity.isBlocked)
            return prevPage;

        return nextPage;
    });
};

export const usePageSwipe = ({
    activities = [],
    onSwipe = noop,
    onEntryToggle,
    isDisabled = false
}) => {
    const handlers = useSwipeable({
        onSwipedLeft: () => swipeAction(Actions.Left, onSwipe, activities),
        onSwipedRight: () => swipeAction(Actions.Right, onSwipe, activities),
        onSwipedUp: () => swipeAction(Actions.Up, onSwipe, activities),
        onSwipedDown: () => swipeAction(Actions.Down, onSwipe, activities),
        preventScrollOnSwipe: isDisabled,
        trackTouch: !isDisabled,
        trackMouse: !isDisabled,
    });

    useEffect(() => {
        const listener = (e) => {
            let action;
            switch (e.key) {
                case "Enter":
                    onEntryToggle();
                    break;

                case "ArrowLeft":
                    action = Actions.Left;
                    break;
                case "ArrowRight":
                    action = Actions.Right;
                    break;
                case "ArrowUp":
                    action = Actions.Up;
                    break;
                case "ArrowDown":
                    action = Actions.Down;
                    break;
                default:
                    break;
            }

            if (!action)
                return;

            swipeAction(action, onSwipe, activities);
        };

        if (isDisabled) {
            window.removeEventListener('keydown', listener);
            return;
        }

        window.addEventListener('keydown', listener);

        return () => window.removeEventListener('keydown', listener);
    }, [isDisabled]);

    return handlers;
};