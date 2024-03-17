import {roundToNearestMinutes} from "date-fns";
import {formatDuration} from "../utils/session";
import {EditableDateTimeEntry} from "./EditableDateTimeEntry";
import {useState} from "react";
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

export const LastSessions = ({activitiesData, activity}) => {
    const [sessionDialogData, setSessionDialogData] = useState({
        id: "",
        start: 0,
        end: 0
    });

    return (
        <>
            <div
                className="w-32 m-auto z-20 h-16 text-xs font-mono overflow-y-auto"
                onScroll={event => event.stopPropagation()}>
                {activitiesData
                    .filter(item => {
                        return (
                            item.end > 0 &&
                            item.start > 0 &&
                            (item.end - item.start) > 60 * 10000
                        );
                    })
                    .sort((a, b) => b.start - a.start).slice(0,3)
                    .map(item => {
                        const starTimeDateParts = formatDateTimeParts(item.start);
                        return (
                            <div
                                key={item.start}
                                className="flex justify-between m-auto pb-1"
                                onClick={() => setSessionDialogData({
                                    id: item.id,
                                    start: item.start,
                                    end: item.end,
                                })}>
                                <span>{starTimeDateParts[0]}</span>
                                <span>{formatDuration(item.end - item.start)}</span>
                            </div>
                        )
                    })}
                    
            </div>
            {sessionDialogData.start ?
                // TODO: Extract to a component + disable swipe handlers on ActivityView when dialog is open
                <dialog
                    onClose={() => setSessionDialogData({start: 0, end: 0})}
                    className="backdrop-blur-xl fixed z-30 flex items-center bg-transparent justify-center w-screen h-screen top-0">
                    <div className="flex items-center font-mono justify-center w-5/6 h-2/3 rounded-xl p-8 pt-16">
                        <span
                            className="absolute top-14 rounded-full border-4 border-black dark:border-white p-4 hover:bg-white hover:text-black">
                            <X
                                size={52}
                                onClick={() => setSessionDialogData({start: 0, end: 0})}
                                className="dark:text-white hover:text-black"/>
                        </span>
                        <EditableDateTimeEntry
                            id={sessionDialogData.id}
                            activityName={activity.name}
                            start={sessionDialogData.start}
                            end={sessionDialogData.end}/>
                    </div>
                </dialog> : null}
        </>
    )
};