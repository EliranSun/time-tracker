import {ArrowsOutCardinal} from "@phosphor-icons/react";
import {useState} from "react";
import classNames from "classnames";

const CardinalButton = ({children, isHidden}) => {
    return (
        <span
            className={classNames("cursor-pointer", {
                "flex items-center justify-center": true,
                "bg-black/40 w-28 h-10 overflow-hidden text-sm": true,
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
                "fixed flex flex-col text-white select-none gap-2 items-center justify-center inset-x-0 bottom-5 m-auto": true,
                "opacity-30": !isNavigationPressed,
                "opacity-100": isNavigationPressed,
            })}>
            <CardinalButton isHidden={!isNavigationPressed}>
                {adjacentTimeframes.higher}
            </CardinalButton>
            <div className="flex items-center gap-2">
                <CardinalButton isHidden={!isNavigationPressed}>
                    {adjacentTimeframes.previous}
                </CardinalButton>
                <button
                    className={classNames({
                        "text-white font-mono": true,
                        "bg-black/80 p-4 w-20 h-20": true,
                        "flex items-center justify-center flex-col": true,
                    })}>
                    <span className="flex items-center justify-center">{timeFrameName}</span>
                    {/*<ArrowsOutCardinal size={50}/>*/}
                </button>
                <CardinalButton isHidden={!isNavigationPressed}>
                    {adjacentTimeframes.next}
                </CardinalButton>
            </div>
            <CardinalButton isHidden={!isNavigationPressed}>
                {adjacentTimeframes.lower}
            </CardinalButton>
        </div>
    )
}