import {ArrowDown} from "@phosphor-icons/react";
import {formatDuration} from "../utils/session";
import {useState} from "react";
import {updateActivityTimeById} from "../utils/db";
import classNames from "classnames";

const onDateTimeChange = (event) => {
    const value = event.target.value;
};

const Toast = ({type}) => {
    return (<div className={classNames({
            "opacity-0": !type,
            "opacity-100": type,
            "transition-all fixed rounded flex items-center justify-center left-0 right-0": true,
            "m-auto bottom-20 bg-black text-white w-fit px-4 text-lg h-10": true,
        })}>
            {type === "success" ? "alright!" : "something got entangled"}
        </div>);
};

export const EditableDateTimeEntry = ({id, activityName, start, end}) => {
    const [startDate, setStartDate] = useState(new Date(start).toISOString().slice(0, 10));
    const [endDate, setEndDate] = useState(new Date(end).toISOString().slice(0, 10));
    const [startTime, setStartTime] = useState(new Date(start).toString().slice(16, 21));
    const [endTime, setEndTime] = useState(new Date(end).toString().slice(16, 21));
    const [inputUpdateResultString, setInputUpdateResultString] = useState("");

    return (<>
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
                            const newStartTimestamp = new Date(startDate + "T" + startTime + ":00").getTime();
                            if (newStartTimestamp === start || (newStartTimestamp > end)) {
                                setInputUpdateResultString("error");
                                return;
                            }


                            updateActivityTimeById(activityName, id, {
                                start: newStartTimestamp,
                                end,
                            })
                                .then(() => setInputUpdateResultString("success"))
                                .catch((error) => setInputUpdateResultString("error"));
                        }}/>
                    <ArrowDown size={42} className="dark:text-white"/>
                    <input type="date" className="text-base bg-transparent" defaultValue={endDate}/>
                    <input
                        type="time"
                        className="text-6xl bg-transparent"
                        defaultValue={endTime}
                        onChange={event => setEndTime(event.target.value)}
                        onBlur={() => {
                            const newEndTimestamp = new Date(endDate + "T" + endTime + ":00").getTime();
                            if (newEndTimestamp === end || (start > newEndTimestamp)) {
                                setInputUpdateResultString("error");
                                return;
                            }

                            updateActivityTimeById(activityName, id, {
                                end: newEndTimestamp,
                                start,
                            })
                                .then(() => setInputUpdateResultString("success"))
                                .catch((error) => setInputUpdateResultString("error"));
                        }}
                    />
                </div>
                <div className="text-7xl">
                    {formatDuration(end - start)}~
                </div>
            </div>
            <Toast type={inputUpdateResultString}/>
        </>);
}