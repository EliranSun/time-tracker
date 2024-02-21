import './App.css';
import {useEffect, useState} from 'react';
import {ActivitiesView} from "./ActivitiesView";
import {StatsView} from "./Stats";
import {useSwipeable} from "react-swipeable";
import {useCounter} from "./hooks/useCounter";
import {Activities, PageMazeMap} from "./constants/activities";
import {Header} from "./components/Header";
import {ActivitiesDungeonMap} from "./components/ActivitiesDungeonMap";
import {replaceMetaThemeColor} from "./utils/colors";

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

    const activity = Activities.find(activity => activity.name.toLowerCase() === activePage.toLowerCase());

    useEffect(() => {
        window.addEventListener("popstate", (event) => {
            console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
            const path = document.location.pathname;
            if (path === "/activity" || path === "/") {
                setIsActivityView(true);
                replaceMetaThemeColor("#282c34");
            }
        });
    }, []);

    return (
        <section className="App overflow-y-hidden h-screen" {...handlers}>
            <Header
                activity={activity}
                isActivityView={isActivityView}
                setIsActivityView={setIsActivityView}
                isLocked={isLocked}
                setIsLocked={setIsLocked}
                currentActivity={currentActivity}
            />
            {isActivityView
                ? (
                    <>
                        <ActivitiesDungeonMap activePage={activePage}/>
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
