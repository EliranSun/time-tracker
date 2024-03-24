import {BrowserRouter, Navigate, Route, RouterProvider, Routes} from "react-router-dom";
import App, {Views} from "../App";
import React, {useState} from "react";
import {useCounter} from "../hooks/useCounter";
import {Activities, PageMazeMap} from "../constants/activities";
import {Navbar} from "./Navbar";
import {ActivityView} from "./views/ActivityView";
import {StatsView} from "./views/StatsView";
import {ActivityStatsView} from "./views/ActivityStatsView";
import {ActivitiesProvider} from "../context/ActivitiesContext";


export const AppRouter = () => {
    const [isZenMode, setIsZenMode] = useState(false);
    const [view, setView] = useState(Views.ACTIVITIES);
    const [currentActivity, setCurrentActivity] = useState(JSON.parse(localStorage.getItem('currentActivity')) || {});
    const [isLocked, setIsLocked] = useState(false);
    const {counter} = useCounter(currentActivity.name);
    const [activePage, setActivePage] = useState(Object.keys(PageMazeMap).find(page => page === "Unity"));
    const activity = Activities.find(activity => activity.name.toLowerCase() === activePage.toLowerCase());
    const [isEditEntryView, setIsEditEntryView] = useState(false);

    const navbar = (
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
    );

    return (
        <ActivitiesProvider>
            <section className="overflow-hidden fixed top-0 left-0">
                <div className="w-screen h-screen m-auto flex flex-col items-center justify-center">
                    <BrowserRouter>
                        <Routes>
                            <Route path="/stats" element={
                                <StatsView
                                    activities={Activities}
                                    onChangePage={() => setView(Views.ACTIVITIES)}/>
                            }/>
                            <Route path="/stats/activity/:id" element={
                                <>
                                    <ActivityStatsView
                                        isZenMode={isZenMode}
                                        activity={activity}/>
                                    {navbar}
                                </>
                            }/>
                            <Route path="/:id" element={
                                <>
                                    <ActivityView
                                        activePage={activePage}
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
                                    {navbar}
                                </>
                            }/>
                            <Route path="*" element={<Navigate replace to="/unity"/>}/>
                        </Routes>
                    </BrowserRouter>
                </div>
            </section>
        </ActivitiesProvider>
    );
}