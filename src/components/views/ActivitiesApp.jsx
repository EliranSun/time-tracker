// TODO: Enum for page names + change the mapping to be something like: Unity: { name: "Unity", direction: { ... }}
import {useState} from "react";
import {useCounter} from "../../hooks/useCounter";
import {Activities, ActivitiesColorsMazeMap} from "../../constants/activities";
import {useNavigation} from "../../hooks/useNavigation";
import GravitySimulationView from "./GravitySimulationView";
import {ActivityView} from "./ActivityView";
import {ActivitiesFilterProvider} from "../../context/ActivitiesFilterContext";
import {ActivitiesStatisticsPage} from "./ActivitiesStatisticsPage";
import {ActivityCalendarView} from "./ActivityCalendarView";
import {Navbar} from "../Navbar";

export const Views = {
    HOMEPAGE: "activities",
    STATS: "stats",
    ACTIVITY: "activity",
    GRAVITY: "gravity"
}

export const ActivitiesApp = ({activity}) => {
    // const [view, setView] = useState(Views.HOMEPAGE);
    // TODO: zen mode should be in context
    const [isZenMode, setIsZenMode] = useState(false);
    const [currentActivity, setCurrentActivity] = useState(JSON.parse(localStorage.getItem('currentActivity')) || {});
    const [isLocked, setIsLocked] = useState(false);
    const {counter} = useCounter(currentActivity.name);
    const [activePage, setActivePage] = useState(Object.keys(ActivitiesColorsMazeMap).find(page => page === "Unity"));
    // const activity = Activities.find(activity => activity.name.toLowerCase() === activePage.toLowerCase());
    const [isEditEntryView, setIsEditEntryView] = useState(false);
    const [view, setView] = useNavigation();

    return (
        <>
            <div id="dialog-root"/>
            <section className="overflow-hidden text-black dark:text-white">
                {view === Views.GRAVITY ? <GravitySimulationView/> : null}
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
                    ? <ActivityCalendarView
                        activity={activity}
                        isZenMode={isZenMode}
                    /> : null}
            </section>
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
        </>
    )
}
