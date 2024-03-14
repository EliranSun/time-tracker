import {ArrowDown} from "@phosphor-icons/react";
import {formatDuration} from "../utils/session";
import {useState} from "react";
import {updateActivityTimeById} from "../utils/db";

const onDateTimeChange = (event) => {
    const value = event.target.value;
};

const Toast = () => {
    return (
        <div className="fixed left-0 right-0 m-auto bottom-10 bg-black text-white w-44 text-lg h-20">
            hello
        </div>
    );
};

export const EditableDateTimeEntry = ({id, activityName, start, end}) => {
    const [startDate, setStartDate] = useState(new Date(start).toISOString().slice(0, 10));
    const [endDate, setEndDate] = useState(new Date(end).toISOString().slice(0, 10));
    const [startTime, setStartTime] = useState(new Date(start).toString().slice(16, 21));
    const [endTime, setEndTime] = useState(new Date(end).toString().slice(16, 21));

    return (
        <>
        <div
            className="flex justify-between w-full flex flex-col justify-between w-full items-center text-black dark:text-white h-full">
            <div className="flex flex-col items-center gap-4 justify-between">
                <input type="date" className="text-base bg-transparent" defaultValue={startDate}/>
                <input
                    type="time"
                    className="text-6xl bg-transparent"
                    defaultValue={startTime}
                    onChange={event => setStartTime(event.target.value)}
                    onBlur={() => {
                        const newTimestamp = new Date(startDate + "T" + startTime + ":00").getTime();
                        if (newTimestamp !== start) {
                            updateActivityTimeById(activityName, id, {start: newTimestamp})
                                .then(() => alert("Updated!"))
                                .catch((error) => alert(error));
                        }
                    }}/>
                <ArrowDown size={42} className="dark:text-white"/>
                <input type="date" className="text-base bg-transparent" defaultValue={endDate}/>
                <input
                    type="time"
                    className="text-6xl bg-transparent"
                    defaultValue={endTime}
                    onChange={event => setEndTime(event.target.value)}
                    onBlur={() => {
                        const newTimestamp = new Date(endDate + "T" + endTime + ":00").getTime();
                        if (newTimestamp !== end) {
                            updateActivityTimeById(activityName, id, {end: newTimestamp})
                                .then(() => alert("Updated!"))
                                .catch((error) => alert(error));
                        }
                    }}
                />
            </div>
            <div className="text-7xl">
                {formatDuration(end - start)}~
            </div>
        </div>
        <Toast/>
        </>
    );
}