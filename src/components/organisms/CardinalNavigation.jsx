import {ArrowsOutCardinal} from "@phosphor-icons/react";
import {useState} from "react";
import classNames from "classnames";

const CardinalButton = ({children, isHidden }) => {
    return (
        <span className={classNames("bg-black", { 
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
            onTouchStart={() => !isNavigationPressed && setIsNavigationPressed(true)}
            onTouchEnd={() => isNavigationPressed && setIsNavigationPressed(false)}
            className="fixed flex flex-col text-white select-none gap-2 items-center justify-center inset-x-0 bottom-5 m-auto">
                <CardinalButton isHidden={isHidden}>
                    {adjacentTimeframes.higher}
                </CardinalButton>
            <div className="flex gap-2">
                    <CardinalButton isHidden={isHidden}>
                        {adjacentTimeframes.previous}
                    </CardinalButton>
                <button
                    className="relative bg-black w-fit p-4 flex items-center justify-center flex-col text-white font-mono w-16">
                    <span className="absolute top-0 inset-x-0">{timeFrameName.slice(0, 4)}</span>
                    <ArrowsOutCardinal size={50}/>
                </button>
                    <CardinalButton isHidden={isHidden}>
                        {adjacentTimeframes.next}
                    </CardinalButton>
            </div>
                <CardinalButton isHidden={isHidden}>
                    {adjacentTimeframes.lower}
                </CardinalButton>
        </div>
    )
}