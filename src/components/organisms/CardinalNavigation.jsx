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
                "flex flex-col text-white select-none gap-2 items-center justify-center p-2 w-full": true,
            })}>
            <div className="w-full justify-center flex items-center text-black dark:text-white">
                   <div className="flex gap-2">
                <CaretLeft size={24}/>
                <CaretRight size={24}/>
                </div>
                <button
                    className={classNames({
                        "bg-black": false,
                        "text-black dark:text-white font-mono": true,
                        "p-4 h-12 rounded-2xl": true,
                        "flex items-center justify-center flex-col": true,
                    })}>
                    <span className="flex items-center justify-center">
                        {timeFrameName}
                    </span>
                </button>
            </div>
            <div className="w-full justify-center flex items-center text-black dark:text-white">
                <CaretUp size={24}/>
                {adjacentTimeframes.higher}
                <CaretDown size={24}/>
                {adjacentTimeframes.lower}
            </div>
        </div>
    )
}