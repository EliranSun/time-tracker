import { CaretLeft, CaretRight, CaretUp, CaretDown } from "@phosphor-icons/react";
import { useState } from "react";
import classNames from "classnames";

const CardinalButton = ({ children, isHidden }) => {
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

export const CardinalNavigation = ({ timeFrameName, swipeHandlers, adjacentTimeframes, setAdjacentTimeframes }) => {
    const [isNavigationPressed, setIsNavigationPressed] = useState(false);

    return (
        <div className={classNames({
                "flex text-white text-xs select-none gap-2 items-center justify-center p-2 w-full": true,
            })}>
            <div className="w-full justify-center gap-2 flex items-center text-black dark:text-white">
                <CaretLeft size={24}/>
                {adjacentTimeframes.previous}
                <CaretRight size={24}/>
                {adjacentTimeframes.next}
            </div>
            <div className="w-full justify-center flex items-center gap-2 text-black dark:text-white">
                <CaretUp size={24}/>
                {adjacentTimeframes.higher}
                <CaretDown size={24}/>
                {adjacentTimeframes.lower}
            </div>
        </div>
    )
}