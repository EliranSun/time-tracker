import {ArrowsOutCardinal} from "@phosphor-icons/react";
import {useState} from "react";

export const CardinalNavigation = ({timeFrameName, swipeHandlers, adjacentTimeframes, setAdjacentTimeframes}) => {
    const [isNavigationPressed, setIsNavigationPressed] = useState(false);

    return (
        <div
            {...swipeHandlers}
            className="fixed flex flex-col text-white gap-2 items-center justify-center inset-x-0 bottom-5 m-auto">
            {isNavigationPressed ?
                <span className="bg-black">
                    {adjacentTimeframes.higher}
                </span> : null}
            <div className="flex gap-2">
                {isNavigationPressed ?
                    <span className="bg-black">
                        {adjacentTimeframes.previous}
                    </span> : null}
                <button
                    className="relative bg-black w-fit p-4 flex items-center justify-center flex-col text-white font-mono w-16">
                    <span className="absolute top-0 inset-x-0">{timeFrameName.slice(0, 4)}</span>
                    <ArrowsOutCardinal size={50}/>
                </button>
                {isNavigationPressed ?
                    <span className="bg-black">
                        {adjacentTimeframes.next}
                    </span> : null}
            </div>
            {isNavigationPressed ?
                <span className="bg-black">
                    {adjacentTimeframes.lower}
                </span> : null}
        </div>
    )
}