import './App.css';
import {useEffect, useState} from 'react';
import {ActivityView} from "./components/views/ActivityView";
import {StatsView} from "./components/views/StatsView";
import {useCounter} from "./hooks/useCounter";
import {Activities, PageMazeMap} from "./constants/activities";
import {Navbar} from "./components/Navbar";
import {ActivitiesDungeonMap} from "./components/ActivitiesDungeonMap";
import {getAppBackgroundColor, replaceMetaThemeColor} from "./utils/colors";
import {ActivitiesProvider} from "./context/ActivitiesContext";
import {ActivityStatsView} from "./components/views/ActivityStatsView";
import GravitySimulationView from "./components/views/GravitySimulationView";

// TODO: Enum for page names + change the mapping to be something like: Unity: { name: "Unity", direction: { ... }}
export const Views = {
    ACTIVITIES: "activities", STATS: "stats", ACTIVITY: "activity", GRAVITY: "gravity"
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
    const [isEditEntryView, setIsEditEntryView] = useState(false);

    console.log({activePage});
    useEffect(() => {
        switch (document.location.pathname) {
            case "/":
                setView(Views.ACTIVITIES);
                break;

            case "/stats":
                setView(Views.STATS);
                break;

            case "/gravity":
                setView(Views.GRAVITY);
                break;

            default:
                setView(Views.GRAVITY);
                break;
        }

        window.addEventListener("popstate", (event) => {
            const path = document.location.pathname;
            if (path === "/gravity") {
                setView(Views.GRAVITY);
            }

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
                if (path === "/gravity") {
                    setView(Views.GRAVITY);
                }

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
                {view === Views.GRAVITY ? <GravitySimulationView/> : null}
                {view === Views.ACTIVITIES ? (
                    <div className="w-screen h-screen m-auto flex flex-col items-center justify-center">
                        <ActivitiesDungeonMap
                            isZenMode={isZenMode}
                            activePage={activePage}/>
                        <ActivityView
                            activity={activity}
                            counter={counter}
                            setActivePage={setActivePage}
                            onChangePage={() => setView(Views.STATS)}
                            isZenMode={isZenMode}
                            isEditEntryView={isEditEntryView}
                            setIsEditEntryView={setIsEditEntryView}
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
                <Navbar
                    activity={activity}
                    view={view}
                    setView={setView}
                    isLocked={isLocked}
                    isZenMode={isZenMode}
                    setIsLocked={setIsLocked}
                    onZenMode={() => setIsZenMode(prev => !prev)}
                    currentActivity={currentActivity}
                    onEntryHistoryClick={() => setIsEditEntryView(true)}
                />
            </section>
        </ActivitiesProvider>
    )
}

export default App;
