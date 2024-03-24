import {useSwipeable} from "react-swipeable";
import {PageMazeMap} from "../constants/activities";
import {useEffect} from "react";
import {noop, upperFirst} from "lodash";
import {useNavigate} from "react-router-dom";

const Actions = {
    Up: "Up",
    Down: "Down",
    Left: "Left",
    Right: "Right",
};

const swipeAction = (action, onSwipe, navigate) => {
    onSwipe(prevPage => {
        const nextPage = PageMazeMap[upperFirst(prevPage)][action];
        if (navigate) {
            navigate(`/${nextPage.toLowerCase()}`);
        }

        return nextPage;
    });
};

export const usePageSwipe = (onSwipe = noop, isDisabled = false) => {
    const navigate = useNavigate();
    const handlers = useSwipeable({
        onSwipedLeft: () => swipeAction(Actions.Left, onSwipe),
        onSwipedRight: () => swipeAction(Actions.Right, onSwipe),
        onSwipedUp: () => swipeAction(Actions.Up, onSwipe),
        onSwipedDown: () => swipeAction(Actions.Down, onSwipe),
        preventScrollOnSwipe: isDisabled,
        trackTouch: !isDisabled,
        trackMouse: !isDisabled,
    });

    useEffect(() => {
        const listener = (e) => {
            let action;
            switch (e.key) {
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

            swipeAction(action, onSwipe, navigate);
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