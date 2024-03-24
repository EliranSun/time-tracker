import './App.css';
import {useEffect, useState} from 'react';
import {ActivityView} from "./components/views/ActivityView";
import {StatsView} from "./components/views/StatsView";
import {useCounter} from "./hooks/useCounter";
import {Activities, PageMazeMap} from "./constants/activities";
import {Header} from "./components/Header";
import {ActivitiesDungeonMap} from "./components/ActivitiesDungeonMap";
import {getAppBackgroundColor, replaceMetaThemeColor} from "./utils/colors";
import {ActivitiesProvider} from "./context/ActivitiesContext";
import {ActivityStatsView} from "./components/views/ActivityStatsView";

// TODO: Enum for page names + change the mapping to be something like: Unity: { name: "Unity", direction: { ... }}
export const Views = {
    ACTIVITIES: "activities", STATS: "stats", ACTIVITY: "activity",
}

function App() {
    const [view, setView] = useState(Views.ACTIVITIES);
    // TODO: zen mode should be in context
    const [isZenMode, setIsZenMode] = useState(false);
    const [currentActivity, setCurrentActivity] = useState(JSON.parse(localStorage.getItem('currentActivity')) || {});
    const [isLocked, setIsLocked] = useState(false);
    const {counter} = useCounter(currentActivity.name);
    const [activePage, setActivePage] = useState(Object.keys(PageMazeMap).find(page => page === "Unity"));
    const activity = Activities.find(activity => activity.name.toLowerCase() === activePage.toLowerCase());

    useEffect(() => {
        window.addEventListener("popstate", (event) => {
            console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
            const path = document.location.pathname;
            if (path === "/") {
                setView(Views.ACTIVITIES);
                replaceMetaThemeColor(getAppBackgroundColor());
            }

            if (path === "/stats") {
                setView(Views.STATS);
                replaceMetaThemeColor(getAppBackgroundColor());
            }

            if (path.includes("/stats/activity")) {
                setView(Views.ACTIVITY);
                setActivePage(path.split("/").pop());
                replaceMetaThemeColor(getAppBackgroundColor());
            }
        });

        window.history.pushState = new Proxy(window.history.pushState, {
            apply: (target, thisArg, argArray) => {
                // trigger here what you need
                const path = argArray[2];
                if (path.includes("/stats/activity")) {
                    setView(Views.ACTIVITY);
                    setActivePage(path.split("/").pop());
                    replaceMetaThemeColor(getAppBackgroundColor());
                }

                if (path === "/") {
                    setView(Views.ACTIVITIES);
                    replaceMetaThemeColor(getAppBackgroundColor());
                }

                if (path === "/stats") {
                    setView(Views.STATS);
                    replaceMetaThemeColor(getAppBackgroundColor());
                }
                return target.apply(thisArg, argArray);
            },
        });
    }, []);

    return (
        <ActivitiesProvider>
            <section className="overflow-hidden fixed top-0 left-0">
                {view === Views.ACTIVITIES ? (
                    <div className="w-screen mt-16 m-auto flex flex-col items-center justify-center">
                        <ActivitiesDungeonMap
                            isZenMode={isZenMode}
                            activePage={activePage}/>
                        <ActivityView
                            activity={activity}
                            counter={counter}
                            setActivePage={setActivePage}
                            onChangePage={() => setView(Views.STATS)}
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
                    </div>) : null}
                {view === Views.STATS ?
                    <StatsView
                        activities={Activities}
                        onChangePage={() => setView(Views.ACTIVITIES)}/> : null}
                {view === Views.ACTIVITY ? <ActivityStatsView isZenMode={isZenMode} activity={activity}/> : null}
                <Header
                    activity={activity}
                    view={view}
                    setView={setView}
                    isLocked={isLocked}
                    isZenMode={isZenMode}
                    setIsLocked={setIsLocked}
                    onZenMode={() => setIsZenMode(prev => !prev)}
                    currentActivity={currentActivity}
                />
            </section>
        </ActivitiesProvider>
    )
}

export default App;
