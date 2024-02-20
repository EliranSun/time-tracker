import {addActivityData} from "../utils/db";

export const AddActivityTimeEntryButton = ({activityName, onSuccess, onFailure}) => {
    return (
        <button
            className="border border-white p-4 my-4"
            onClick={() => {
                const date = new Date();
                const hours = document.querySelector('input[name="date-hours"]').value;
                const minutes = document.querySelector('input[name="date-minutes"]').value;
                const day = document.querySelector('input[name="date-day"]').value;
                const month = document.querySelector('input[name="date-month"]').value;
                const year = document.querySelector('input[name="date-year"]').value;

                const timeHours = document.querySelector('input[name="time-hours"]').value;
                const timeMinutes = document.querySelector('input[name="time-minutes"]').value;
                const timeSeconds = document.querySelector('input[name="time-seconds"]').value;

                if (!hours || !minutes || !day || !month || !year) {
                    alert("Please fill date fields");
                    return;
                }

                if (!timeHours && !timeMinutes && !timeSeconds) {
                    alert("Please fill time fields");
                    return;
                }

                date.setHours(hours);
                date.setMinutes(minutes);
                date.setSeconds(0);
                date.setDate(day);
                date.setMonth(month - 1);
                date.setFullYear(`20${year}`);

                const startTime = date.getTime();
                const endTime = startTime
                    + (timeHours * 60 * 60 * 1000)
                    + (timeMinutes * 60 * 1000)
                    + (timeSeconds * 1000);

                addActivityData({
                    name: activityName,
                    start: startTime,
                    end: endTime
                })
                    .then(() => {
                        onSuccess && onSuccess();
                    })
                    .catch(error => {
                        alert(`Error adding data: ${error.message}`);
                        onFailure && onFailure();
                    });
            }}>

            Add
        </button>
    );
};