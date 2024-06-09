import './App.css';
import {useEffect, useState} from 'react';
import {ActivityView} from "./components/views/ActivityView";
import {ActivitiesStatisticsPage} from "./components/views/ActivitiesStatisticsPage";
import {useCounter} from "./hooks/useCounter";
import {Activities, PageMazeMap} from "./constants/activities";
import {Navbar} from "./components/Navbar";
import {ActivitiesProvider} from "./context/ActivitiesContext";
import {ActivityCalendarView} from "./components/views/ActivityCalendarView";
import GravitySimulationView from "./components/views/GravitySimulationView";
import {ActivitiesFilterProvider} from "./context/ActivitiesFilterContext";
import {getAppBackgroundColor} from "./utils/colors";
import {readableColor} from "polished";

// TODO: Enum for page names + change the mapping to be something like: Unity: { name: "Unity", direction: { ... }}
export const Views = {
    HOMEPAGE: "activities",
    STATS: "stats",
    ACTIVITY: "activity",
    GRAVITY: "gravity"
}

function App() {
    const [view, setView] = useState(Views.HOMEPAGE);
    // TODO: zen mode should be in context
    const [isZenMode, setIsZenMode] = useState(false);
    const [currentActivity, setCurrentActivity] = useState(JSON.parse(localStorage.getItem('currentActivity')) || {});
    const [isLocked, setIsLocked] = useState(false);
    const {counter} = useCounter(currentActivity.name);
    const [activePage, setActivePage] = useState(Object.keys(PageMazeMap).find(page => page === "Unity"));
    const activity = Activities.find(activity => activity.name.toLowerCase() === activePage.toLowerCase());
    const [isEditEntryView, setIsEditEntryView] = useState(false);

    useEffect(() => {
        switch (true) {
            default:
            case document.location.pathname === "/":
                setView(Views.HOMEPAGE);
                break;

            case document.location.pathname === "/stats":
                setView(Views.STATS);
                break;

            case document.location.pathname === "/gravity":
                setView(Views.GRAVITY);
                break;

            case document.location.pathname.includes("/stats/activity"):
                setView(Views.ACTIVITY);
                setActivePage(document.location.pathname.split("/").pop());
                break;
        }

        window.addEventListener("popstate", (event) => {
            const path = document.location.pathname;
            if (path === "/gravity") {
                setView(Views.GRAVITY);
            }

            if (path === "/") {
                setView(Views.HOMEPAGE);
            }

            if (path === "/stats") {
                setView(Views.STATS);
            }

            if (path.includes("/stats/activity")) {
                setView(Views.ACTIVITY);
                setActivePage(path.split("/").pop());
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
                }

                if (path === "/") {
                    setView(Views.HOMEPAGE);
                }

                if (path === "/stats") {
                    setView(Views.STATS);
                }

                return target.apply(thisArg, argArray);
            },
        });
    }, []);

    return (
        <ActivitiesProvider>
            <section
                className="text-black dark:text-white md:h-screen md:overflow-hidden"
                style={{
                    color: readableColor(currentActivity.name === activity.name ? activity.color : getAppBackgroundColor()),
                    backgroundColor: getAppBackgroundColor()
                }}>
                <div id="dialog-root"/>
                {view === Views.GRAVITY
                    ? <GravitySimulationView counter={counter}/> : null}
                {view === Views.HOMEPAGE ? (
                    <div className="m-auto flex flex-col items-center justify-start">
                        <ActivityView
                            activity={activity}
                            counter={counter}
                            activePage={activePage}
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
                    <ActivitiesFilterProvider>
                        <ActivitiesStatisticsPage
                            activities={Activities}
                            onChangePage={() => setView(Views.HOMEPAGE)}/>
                    </ActivitiesFilterProvider>
                    : null}
                {view === Views.ACTIVITY
                    ? <ActivityCalendarView isZenMode={isZenMode} activity={activity}/> : null}
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
