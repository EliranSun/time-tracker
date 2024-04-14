import {CaretDown, CaretUp} from "@phosphor-icons/react";

export const DateNavigation = ({value, onClick}) => {
    return (
        <div className="flex gap-2" onClick={onClick}>
            <div className="flex flex-col items-center justify-center">
                <CaretUp size={13}/>
                <CaretDown size={13}/>
            </div>
            <div className="flex items-center gap-2">
                {value}
            </div>
        </div>
    )
};