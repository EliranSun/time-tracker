import {CaretLeft, CaretRight} from "@phosphor-icons/react";
import {useState} from "react";
import classNames from "classnames";

const CardinalButton = ({children, isHidden}) => {
    return (
        <span
            className={classNames("cursor-pointer", {
                "flex items-center justify-center": true,
                "text-black dark:text-white h-10 overflow-hidden text-sm font-bold": true,
                "opacity-0": isHidden,
                "opacity-100": !isHidden,
            })}>
            {children}
        </span>
    );
};

export const CardinalNavigation = ({timeFrameName, swipeHandlers, adjacentTimeframes, setAdjacentTimeframes}) => {
    const [isNavigationPressed, setIsNavigationPressed] = useState(false);

    return (
        <div
            {...swipeHandlers}
            onMouseDown={() => !isNavigationPressed && setIsNavigationPressed(true)}
            onMouseUp={() => isNavigationPressed && setIsNavigationPressed(false)}
            onTouchStart={() => !isNavigationPressed && setIsNavigationPressed(true)}
            onTouchEnd={() => isNavigationPressed && setIsNavigationPressed(false)}
            className={classNames({
                "flex flex-col text-white select-none gap-2 items-center justify-center p-2": true,
            })}>
            {/*<CardinalButton isHidden={!isNavigationPressed}>*/}
            {/*    {adjacentTimeframes.higher}*/}
            {/*</CardinalButton>*/}
            <div className="w-full justify-evenly flex items-center gap-2 text-black dark:text-white">
                <CaretLeft size={24}/>
                {/*<CardinalButton isHidden={!isNavigationPressed}>*/}
                {/*    {adjacentTimeframes.previous}*/}
                {/*</CardinalButton>*/}
                <button
                    className={classNames({
                        "bg-black": false,
                        "text-black dark:text-white font-mono": true,
                        "p-4 h-12 rounded-2xl": true,
                        "flex items-center justify-center flex-col": true,
                    })}>
                    <span className="flex items-center justify-center">{timeFrameName}</span>
                </button>
                {/*<CardinalButton isHidden={!isNavigationPressed}>*/}
                {/*    {adjacentTimeframes.next}*/}
                {/*</CardinalButton>*/}
                <CaretRight size={24}/>
            </div>
            {/*<CardinalButton isHidden={!isNavigationPressed}>*/}
            {/*    {adjacentTimeframes.lower}*/}
            {/*</CardinalButton>*/}
        </div>
    )
}