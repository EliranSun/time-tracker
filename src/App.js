import './App.css';
import {useEffect, useState} from 'react';
import {ActivitiesView} from "./components/views/ActivitiesView";
import {StatsView} from "./components/views/Stats";
import {useSwipeable} from "react-swipeable";
import {useCounter} from "./hooks/useCounter";
import {Activities, PageMazeMap} from "./constants/activities";
import {Header} from "./components/Header";
import {ActivitiesDungeonMap} from "./components/ActivitiesDungeonMap";
import {getAppBackgroundColor, replaceMetaThemeColor} from "./utils/colors";

// TODO: Enum for page names + change the mapping to be something like: Unity: { name: "Unity", direction: { ... }} 
function App() {
    // TODO: zen mode should be in context
    const [isZenMode, setIsZenMode] = useState(false);
    const [isActivityView, setIsActivityView] = useState(true);
    const [currentActivity, setCurrentActivity] = useState(JSON.parse(localStorage.getItem('currentActivity')) || {});
    const [isLocked, setIsLocked] = useState(false);
    const {counter} = useCounter(currentActivity.name);
    const [activePage, setActivePage] = useState(Object.keys(PageMazeMap).find(page => page === "Unity"));

    const activity = Activities.find(activity => activity.name.toLowerCase() === activePage.toLowerCase());

    useEffect(() => {
        window.addEventListener("popstate", (event) => {
            console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
            const path = document.location.pathname;
            if (path === "/activity" || path === "/") {
                setIsActivityView(true);
                replaceMetaThemeColor(getAppBackgroundColor());
            }
        });
    }, []);

    return (
        <section className="App overflow-y-hidden h-screen">
            <Header
                activity={activity}
                isActivityView={isActivityView}
                setIsActivityView={setIsActivityView}
                isLocked={isLocked}
                isZenMode={isZenMode}
                setIsLocked={setIsLocked}
                onZenMode={() => setIsZenMode(prev => !prev)}
                currentActivity={currentActivity}
            />
            {isActivityView
                ? (
                    <div className="w-screen h-screen m-auto flex flex-col items-center justify-center">
                        <ActivitiesDungeonMap
                            isZenMode={isZenMode}
                            activePage={activePage}/>
                        <ActivitiesView
                            activity={activity}
                            counter={counter}
                            setActivePage={setActivePage}
                            onChangePage={() => setIsActivityView(false)}
                            isZenMode={isZenMode}
                            currentActivity={currentActivity}
                            onActivityStart={newActivity => {
                                setIsLocked(true);
                                setCurrentActivity(newActivity);
                            }}
                            onActivityEnd={() => {
                                setIsLocked(false);
                                setCurrentActivity({});
                            }}/>
                    </div>
                )
                : <StatsView
                    activities={Activities}
                    onChangePage={() => setIsActivityView(true)}/>
            }
        </section>
    )
}

export default App;
