import {roundToNearestMinutes} from "date-fns";
import {formatDuration} from "../utils/session";
import {EditableDateTimeEntry} from "./EditableDateTimeEntry";
import {useRef, useState} from "react";
import {useClickAway} from 'react-use';
import {X} from "@phosphor-icons/react";

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
            <div className="h-16 text-xs text-white font-mono overflow-y-auto">
                {activitiesData
                    .filter(item => {
                        return (
                            item.end > 0 &&
                            (item.end - item.start) > 60 * 1000
                        );
                    })
                    .sort((a, b) => b.start - a.start)
                    .map(item => {
                        const starTimeDateParts = formatDateTimeParts(item.start);
                        // const endDate = new Intl.DateTimeFormat('en-GB', {
                        //     hour: 'numeric',
                        //     minute: 'numeric',
                        // }).format(new Date(roundToNearestMinutes(item.end, {nearestTo: 5})));

                        return (
                            <div
                                key={item.start}
                                onClick={() => setSessionDialogData({
                                    start: item.start,
                                    end: item.end,
                                })}
                                className="flex justify-between m-auto">
                                <span>{starTimeDateParts[0]}</span>
                                <span>{formatDuration(item.end - item.start)}</span>
                            </div>
                        )
                    })}
            </div>
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