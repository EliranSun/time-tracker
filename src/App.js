import './App.css';
import {useEffect, useMemo, useState} from 'react';
import {ActivitiesView} from "./ActivitiesView";
import {StatsView} from "./Stats";
import {ArrowCounterClockwise, ChartBar, Lock, LockOpen} from "@phosphor-icons/react";
import {useSwipeable} from "react-swipeable";
import classNames from "classnames";
import {useCounter} from "./hooks/useCounter";
import {Activities, PageMazeMap} from "./constants/activities";
import {Icon} from "./components/Icon";
import {Header} from "./components/Header";

// TODO: Enum for page names + change the mapping to be something like: Unity: { name: "Unity", direction: { ... }} 
function App() {
    const [isDiscreteMode, setIsDiscreteMode] = useState(false);
    const [isActivityView, setIsActivityView] = useState(true);
    const [currentActivity, setCurrentActivity] = useState(JSON.parse(localStorage.getItem('currentActivity')) || {});
    const [isLocked, setIsLocked] = useState(false);
    const {counter} = useCounter(currentActivity.name);
    const [activePage, setActivePage] = useState(Object.keys(PageMazeMap).find(page => page === "Unity"));
    const handlers = useSwipeable({
        // left/right swapped to mimic "natural" scrolling direction
        onSwipedLeft: () => setActivePage(prevPage => PageMazeMap[prevPage].Left),
        onSwipedRight: () => setActivePage(prevPage => PageMazeMap[prevPage].Right),
        onSwipedUp: () => setActivePage(prevPage => PageMazeMap[prevPage].Up),
        onSwipedDown: () => setActivePage(prevPage => PageMazeMap[prevPage].Down),
    });

    useEffect(() => {
        const listener = (e) => {
            switch (e.key) {
                case "ArrowLeft":
                    setActivePage(prevPage => PageMazeMap[prevPage].Left);
                    break;
                case "ArrowRight":
                    setActivePage(prevPage => PageMazeMap[prevPage].Right);
                    break;
                case "ArrowUp":
                    setActivePage(prevPage => PageMazeMap[prevPage].Up);
                    break;
                case "ArrowDown":
                    setActivePage(prevPage => PageMazeMap[prevPage].Down);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', listener);

        return () => window.removeEventListener('keydown', listener);
    }, []);

    return (
        <section className="App overflow-y-hidden h-screen" {...handlers}>
            <Header
                isDiscreteMode={isDiscreteMode}
                onDiscreteModeChange={() => setIsDiscreteMode(prev => !prev)}
                isLocked={isLocked}
                onLockChange={() => setIsLocked(prev => !prev)}
                activePage={activePage}/>
            {isActivityView
                ? (
                    <>
                        
                        <ActivitiesView
                            activity={activity}
                            counter={counter}
                            onChangePage={() => setIsActivityView(false)}
                            isDiscrete={isDiscreteMode}
                            currentActivity={currentActivity}
                            onActivityStart={newActivity => {
                                setIsLocked(true);
                                setCurrentActivity(newActivity);
                            }}
                            onActivityEnd={() => {
                                setIsLocked(false);
                                setCurrentActivity({});
                            }}/>
                    </>
                )
                : <StatsView
                    activities={Activities}
                    onChangePage={() => setIsActivityView(true)}/>
            }
        </section>
    )
}

export default App;
