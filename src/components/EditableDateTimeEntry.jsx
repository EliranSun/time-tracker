import {ArrowDown, ArrowRight, Check} from "@phosphor-icons/react";
import {formatDuration} from "../utils/session";
import {useMemo, useState} from "react";
import {addActivityData, updateActivityTimeById} from "../utils/db";
import {Button} from "./atoms/Button";
import {Toast} from "./atoms/Toast";
import classNames from "classnames";
import {formatDistanceToNow} from "date-fns";
import {Activities} from "../constants/activities";
import {calcAlphaChannelBasedOnOpacity} from "../utils/colors";

export const ApiStatus = {
    SUCCESS: "SUCCESS",
    ERROR: "ERROR",
    NONE: "NONE",
};

export const EditableDateTimeEntry = ({id, activityName, start, end, isListView = false}) => {
    const [startDate, setStartDate] = useState(new Date(start).toISOString().slice(0, 10));
    const [endDate, setEndDate] = useState(new Date(end).toISOString().slice(0, 10));
    const [startTime, setStartTime] = useState(new Date(start).toString().slice(16, 21));
    const [endTime, setEndTime] = useState(new Date(end).toString().slice(16, 21));
    const [updateActivityStatus, setUpdateActivityStatus] = useState(ApiStatus.NONE);
    const durationTimeString = useMemo(() => {
        const startTimestamp = new Date(startDate + "T" + startTime + ":00").getTime();
        const endTimestamp = new Date(endDate + "T" + endTime + ":00").getTime();
        return formatDuration(endTimestamp - startTimestamp);
    }, [endDate, endTime, startDate, startTime]);

    const updateActivity = async (newStart, newEnd) => {
        try {
            await updateActivityTimeById(activityName, id, {
                start: newStart,
                end: newEnd,
            });
            setUpdateActivityStatus(ApiStatus.SUCCESS);
        } catch (error) {
            console.error(error);
            setUpdateActivityStatus(ApiStatus.ERROR);
        }
    };

    return (
        <>
            <div className={classNames("w-full text-black dark:text-white h-full", {
                "flex gap-4 items-center": isListView,
            })}>
                <div
                    className={classNames("flex items-center justify-between", {
                        "flex-col gap-4 mb-16 w-full": !isListView,
                        "flex-row gap-4 justify-between px-5 py-4 w-80 bg-black/20": isListView,
                    })}>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <span className="text-[9px] opacity-70">{formatDistanceToNow(start)} ago</span>
                            <input
                                type="date"
                                className="bg-transparent text-sm"
                                onChange={event => setStartDate(event.target.value)}
                                defaultValue={startDate}/>
                        </div>
                        <input
                            type="time"
                            className={classNames("bg-transparent", {"text-6xl": !isListView, "text-2xl": isListView})}
                            defaultValue={startTime}
                            onChange={event => setStartTime(event.target.value)}
                            onBlur={() => {
                                if (!id) {
                                    return;
                                }

                                const newStartTimestamp = new Date(startDate + "T" + startTime + ":00").getTime();
                                if (newStartTimestamp === start || (newStartTimestamp > end)) {
                                    setUpdateActivityStatus(ApiStatus.ERROR);
                                    return;
                                }

                                updateActivity(newStartTimestamp, end);
                            }}/>
                    </div>
                    {isListView
                        ? <ArrowRight size={15} className="dark:text-white"/>
                        : <ArrowDown size={42} className="dark:text-white"/>}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <span className="text-[9px] opacity-70">{formatDistanceToNow(end)} ago</span>
                            <input
                                type="date"
                                className="bg-transparent text-sm"
                                onChange={event => setEndDate(event.target.value)}
                                defaultValue={endDate}/>
                        </div>
                        <input
                            type="time"
                            className={classNames("bg-transparent", {"text-6xl": !isListView, "text-2xl": isListView})}
                            defaultValue={endTime}
                            onChange={event => setEndTime(event.target.value)}
                            onBlur={() => {
                                if (!id) {
                                    return;
                                }

                                const newEndTimestamp = new Date(endDate + "T" + endTime + ":00").getTime();
                                if (newEndTimestamp === end || (start > newEndTimestamp)) {
                                    setUpdateActivityStatus(ApiStatus.ERROR);
                                    return;
                                }

                                updateActivity(start, newEndTimestamp);
                            }}
                        />
                    </div>
                </div>
                <div className={classNames({"text-3xl mb-16": !isListView, "text-xl": isListView})}>
                    {durationTimeString}~
                </div>
                {id ? null :
                    <div className="w-full absolute flex justify-center items-center bottom-16 left-16">
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
                                        setUpdateActivityStatus(ApiStatus.ERROR);
                                        return;
                                    }

                                    await addActivityData({
                                        start: newStartTimestamp,
                                        end: newEndTimestamp,
                                        name: activityName,
                                    });
                                    setUpdateActivityStatus(ApiStatus.SUCCESS);
                                }}/>
                        </Button>
                    </div>}
            </div>
            <Toast type={updateActivityStatus}/>
        </>
    );
}