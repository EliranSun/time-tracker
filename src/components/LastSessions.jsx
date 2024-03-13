import {roundToNearestMinutes} from "date-fns";
import {formatDuration} from "../utils/session";
import {EditableDateTimeEntry} from "./EditableDateTimeEntry";
import {useState} from "react";
import {X} from "@phosphor-icons/react";
import {createPortal} from "react-dom/profiling";

const formatDateTimeParts = (timestamp) => {
    return new Intl.DateTimeFormat('en-IL', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: 'numeric',
    })
        .format(new Date(roundToNearestMinutes(timestamp, {nearestTo: 5})))
        .split(" at ");
};

export const LastSessions = ({activitiesData}) => {
    const [sessionDialogData, setSessionDialogData] = useState({
        start: 0,
        end: 0
    });

    return (
        <>
            {createPortal(
                <div
                    style={{bottom: "8rem", left: 0, right: 0}}
                    className="w-40 m-auto absolute z-20 h-16 text-xs text-white font-mono overflow-y-auto"
                    onScroll={event => event.stopPropagation()}>
                    {activitiesData
                        .filter(item => {
                            return (
                                item.end > 0 &&
                                item.start > 0 &&
                                (item.end - item.start) > 60 * 1000
                            );
                        })
                        .sort((a, b) => b.start - a.start)
                        .map(item => {
                            const starTimeDateParts = formatDateTimeParts(item.start);
                            return (
                                <div
                                    key={item.start}
                                    className="flex justify-between m-auto pb-1"
                                    onClick={() => setSessionDialogData({
                                        start: item.start,
                                        end: item.end,
                                    })}>
                                    <span>{starTimeDateParts[0]}</span>
                                    <span>{formatDuration(item.end - item.start)}</span>
                                </div>
                            )
                        })}
                </div>, document.getElementById("scrollable-elements"))}
            {sessionDialogData.start ?
                <dialog
                    onClose={() => setSessionDialogData({start: 0, end: 0})}
                    className="backdrop-blur-xl fixed z-10 flex items-center bg-transparent justify-center w-screen h-screen top-0">
                    <div className="flex items-center font-mono justify-center w-5/6 h-2/3 rounded-xl p-8 pt-16">
                        <span className="absolute top-14 rounded-full border-4 p-4 hover:bg-white hover:text-black">
                            <X
                                size={52}
                                onClick={() => setSessionDialogData({start: 0, end: 0})}
                                className="dark:text-white hover:text-black"/>
                        </span>
                        <EditableDateTimeEntry
                            start={sessionDialogData.start}
                            end={sessionDialogData.end}/>
                    </div>
                </dialog> : null}
        </>
    )
};