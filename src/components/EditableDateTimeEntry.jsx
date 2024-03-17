import {ArrowDown, Check} from "@phosphor-icons/react";
import {formatDuration} from "../utils/session";
import {useMemo, useState} from "react";
import {addActivityData, updateActivityTimeById} from "../utils/db";
import {Button} from "./atoms/Button";
import {Toast} from "./atoms/Toast";

export const EditableDateTimeEntry = ({id, activityName, start, end}) => {
    const [startDate, setStartDate] = useState(new Date(start).toISOString().slice(0, 10));
    const [endDate, setEndDate] = useState(new Date(end).toISOString().slice(0, 10));
    const [startTime, setStartTime] = useState(new Date(start).toString().slice(16, 21));
    const [endTime, setEndTime] = useState(new Date(end).toString().slice(16, 21));
    const [inputUpdateResultString, setInputUpdateResultString] = useState("");
    const durationTimeString = useMemo(() => {
        return formatDuration(new Date(endDate + "T" + endTime + ":00").getTime() - new Date(startDate + "T" + startTime + ":00").getTime());
    }, [endDate, endTime, startDate, startTime]);

    const updateActivity = (newStart, newEnd) => {
        updateActivityTimeById(activityName, id, {
            start: newStart,
            end: newEnd,
        })
            .then(() => setInputUpdateResultString("success"))
            .catch(() => setInputUpdateResultString("error"));
    };

    return (
        <>
            <div
                className="flex justify-between w-full flex flex-col justify-between w-full items-center text-black dark:text-white h-full">
                <div className="flex flex-col items-center gap-4 justify-between mb-16">
                    <input
                        type="date"
                        className="text-base bg-transparent"
                        onChange={event => setStartDate(event.target.value)}
                        defaultValue={startDate}/>
                    <input
                        type="time"
                        className="text-6xl bg-transparent"
                        defaultValue={startTime}
                        onChange={event => setStartTime(event.target.value)}
                        onBlur={() => {
                            if (!id) {
                                return;
                            }

                            const newStartTimestamp = new Date(startDate + "T" + startTime + ":00").getTime();
                            if (newStartTimestamp === start || (newStartTimestamp > end)) {
                                setInputUpdateResultString("error");
                                return;
                            }

                            updateActivity(newStartTimestamp, end);
                        }}/>
                    <ArrowDown size={42} className="dark:text-white"/>
                    <input
                        type="date"
                        className="text-base bg-transparent"
                        onChange={event => setEndDate(event.target.value)}
                        defaultValue={endDate}/>
                    <input
                        type="time"
                        className="text-6xl bg-transparent"
                        defaultValue={endTime}
                        onChange={event => setEndTime(event.target.value)}
                        onBlur={() => {
                            if (!id) {
                                return;
                            }

                            const newEndTimestamp = new Date(endDate + "T" + endTime + ":00").getTime();
                            if (newEndTimestamp === end || (start > newEndTimestamp)) {
                                setInputUpdateResultString("error");
                                return;
                            }

                            updateActivity(start, newEndTimestamp);
                        }}
                    />
                </div>
                <div className="text-3xl mb-16">
                    {durationTimeString}~
                </div>
                {id ? null :
                    <Button>
                        <Check
                            size={52}
                            className="dark:text-white hover:text-black"
                            onClick={async () => {
                                if (id) {
                                    return;
                                }

                                const newStartTimestamp = new Date(startDate + "T" + startTime + ":00").getTime();
                                const newEndTimestamp = new Date(endDate + "T" + endTime + ":00").getTime();
                                if (newStartTimestamp > newEndTimestamp) {
                                    setInputUpdateResultString("error");
                                    return;
                                }

                                console.log({
                                    start: new Date(newStartTimestamp).toString(),
                                    end: new Date(newEndTimestamp).toString(),
                                    name: activityName,
                                })

                                await addActivityData({
                                    start: newStartTimestamp,
                                    end: newEndTimestamp,
                                    name: activityName,
                                });
                                setInputUpdateResultString("success");
                            }}/>
                    </Button>}
            </div>
            <Toast type={inputUpdateResultString}/>
        </>
    );
}