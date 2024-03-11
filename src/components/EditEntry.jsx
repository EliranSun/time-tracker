
export const EditEntry = ({ start, end, duration }) => {
    // new Date().toISOString().split("T")[0]
    return (
        <div className="flex justify-between w-full">
            <input type="date" className="bg-transparent" defaultValue={start} />
            {/*<input type="date" className="bg-transparent" defaultValue={end} />*/}
            <input type="time" className="bg-transparent" defaultValue={duration} />
        </div>
    );
}