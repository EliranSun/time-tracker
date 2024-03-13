import {ArrowDown} from "@phosphor-icons/react";
import {formatDuration} from "../utils/session";

export const EditableDateTimeEntry = ({start, end}) => {
    const startDate = new Date(start).toISOString().slice(0, 10);
    const startTime = new Date(start).toISOString().slice(11, 16);
    const endDate = new Date(end).toISOString().slice(0, 10);
    const endTime = new Date(end).toISOString().slice(11, 16);

    return (
        <div
            className="flex justify-between w-full flex flex-col justify-between w-full items-center text-white h-full">
            <div className="flex flex-col items-center gap-4 justify-between">
                <input type="date" className="text-base bg-transparent" defaultValue={startDate}/>
                <input type="time" className="text-6xl bg-transparent" defaultValue={startTime}/>
                <ArrowDown size={42} className="dark:text-white"/>
                <input type="date" className="text-base bg-transparent" defaultValue={endDate}/>
                <input type="time" className="text-6xl bg-transparent" defaultValue={endTime}/>
            </div>
            <div className="text-7xl">
                {formatDuration(end - start)}~
            </div>
        </div>
    );
}