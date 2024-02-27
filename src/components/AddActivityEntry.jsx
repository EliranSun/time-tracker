import classNames from "classnames";
import { TimeInput } from "./TimeInput";
import { DateInput } from "./DateInput";
import { AddActivityTimeEntryButton } from "./AddActivityTimeEntryButton";

export const AddActivityEntry = ({ activity, setIsAddEntryView, isDiscrete }) => {
    return (
        <div className="flex flex-col items-center">
            <p className={classNames("font-mono", isDiscrete ? "text-xs" : "text-6xl")}>
                <TimeInput name="time-hours" value="0"/>:
                <TimeInput name="time-minutes" value="0"/>:
                <TimeInput name="time-seconds" value="0"/>
            </p>
            <label>Start date:</label>
            <div>
                <div className="flex gap-4">
                    <div className="flex justify-center">
                        <DateInput name="date-day"/>
                        <span>/</span>
                        <DateInput name="date-month"/>
                        <span>/</span>
                        <DateInput name="date-year"/>
                    </div>
                    <div className="flex justify-center">
                        <DateInput name="date-hours"/>:
                        <DateInput name="date-minutes"/>
                    </div>
                </div>
                <AddActivityTimeEntryButton
                    onSuccess={() => setIsAddEntryView(false)}
                    activityName={activity.name}/>
            </div>
        </div>
    );
};