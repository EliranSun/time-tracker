import {CaretDown, CaretUp} from "@phosphor-icons/react";
import {NavigationButton} from "./NavigationButton";

export const DateNavigation = ({value, onClick}) => {
    return (
        <NavigationButton className="flex gap-2 w-32 justify-center" onClick={onClick}>
            <div className="flex flex-col items-center justify-center">
                <CaretUp size={13}/>
                <CaretDown size={13}/>
            </div>
            <div className="flex items-center gap-2">
                {value}
            </div>
        </NavigationButton>
    )
};