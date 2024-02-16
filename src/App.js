import './App.css';
import classNames from 'classnames';
import { useEffect, useState } from 'react';

const Activities = [
    { name: "Unity", icon: "", color: "red", data: [] },
    { name: "Atly", icon: "", color: "blue", data: [] },
    { name: "Gym", icon: "", color: "green", data: [] },
    { name: "Reading", icon: "", color: "yellow", data: [] },
    { name: "One Piece", icon: "", color: "purple", data: [] },
    { name: "Creative Project", icon: "", color: "pink", data: [] },
    { name: "Pets", icon: "", color: "indigo", data: [] },
    { name: "Friends & Family", icon: "", color: "gray", data: [] },
    { name: "TV & YouTube", icon: "", color: "teal", data: [] },
    { name: "Sleep", icon: "", color: "orange", data: [] },
    { name: "Games", icon: "", color: "blue", data: [] },
];

function App() {
    const [updatedActivities, setUpdatedActivities] = useState(Activities);
    const [currentActivity, setCurrentActivity] = useState({});
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        if (currentActivity.name) {
            setCounter(0);

            const interval = setInterval(() => {
                setCounter(prev => prev + 1);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [currentActivity.name]);

    return (
        <section className="App">
            <div className="h-screen flex flex-wrap gap-1">
                {Activities.map((activity, index) => {
                    return (
                        <div
                            key={activity.name}
                            className={classNames("w-[calc(50%-4px)] text-white flex flex-col items-center justify-center border", {
                                [`bg-${activity.color}-500`]: currentActivity.name === activity.name,
                                [`border-${activity.color}-500`]: currentActivity.name === activity.name,
                            })}
                            onMouseDown={() => {
                                if (currentActivity.name === activity.name) {
                                    setCounter(0);
                                    setCurrentActivity({});
                                    Activities[index].data[Activities[index].data.length - 1].end = new Date().getTime();
                                    return;
                                }

                                setCurrentActivity(activity);
                                Activities[index].data.push({
                                    start: new Date().getTime(),
                                    end: 0
                                });
                            }}>
                            <p>{activity.name}</p>
                            <p className="h-4">{currentActivity.name === activity.name ? `${Math.floor(counter / 60)}:${counter % 60}` : ""}</p>
                            {activity.data.length > 0 && activity.data[activity.data.length - 1].end > 0 && (
                                <p>{Math.floor((activity.data[activity.data.length - 1].end - activity.data[activity.data.length - 1].start))}</p>
                            )}
                            {JSON.stringify(activity.data, null, 2)}
                        </div>
                    )
                })}
            </div>
        </section>
    );
}

export default App;
