import './App.css';
import { useEffect, useMemo, useState } from 'react';
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { ActivitiesView } from "./ActivitiesView";
import { StatsView } from "./Stats";
import {
    ArrowCounterClockwise,
    Barbell,
    BookOpen,
    Briefcase,
    ChartBar,
    Circle,
    GameController,
    Heart, Lock, LockOpen,
    MoonStars,
    PaintBrush,
    PawPrint,
    PuzzlePiece,
    Skull,
    Television,
    Users
} from "@phosphor-icons/react";
import { useSwipeable } from "react-swipeable";
import classNames from "classnames";

const firebaseConfig = {
    apiKey: "AIzaSyAfmw8BBbYUxPwXwP8kkLqsHihNScUmz4A",
    authDomain: "logger-fe3bd.firebaseapp.com",
    databaseURL: "https://logger-fe3bd.firebaseio.com",
    projectId: "logger-fe3bd",
    storageBucket: "logger-fe3bd.appspot.com",
    messagingSenderId: "119768735200",
    appId: "1:119768735200:web:65700d37504d4ec03edf85"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

/*
*  |   Atly  | = | People | = | OP | = | Gym |
*       ||          ||         ||         ||
*  | Unity    | = | Dates | = | Read | = | Sleep |
*      ||           ||           ||           ||
*  | Creative | = | Pets | = | Media | = | Games |
* */
export const Activities = [
    { order: 3, name: "Atly", icon: Briefcase, color: "#f8961e", page: 1, orientationAngle: 270, data: [] },
    { order: 6, name: "People", icon: Users, color: "#90be6d", page: 2, orientationAngle: 270, data: [] },
    { order: 8, name: "OP", icon: Skull, color: "#4d908e", page: 3, orientationAngle: 90, data: [] },
    { order: 11, name: "Gym", icon: Barbell, color: "#C71585", page: 4, orientationAngle: 270, data: [] },

    { order: 1, name: "Unity", icon: PuzzlePiece, color: "#f94144", page: 1, orientationAngle: 0, data: [] },
    { order: 4, name: "Dates", icon: Heart, color: "#f9844a", page: 2, orientationAngle: 0, data: [] },
    { order: 7, name: "Read", icon: BookOpen, color: "#43aa8b", page: 3, orientationAngle: 0, data: [] },
    { order: 10, name: "Sleep", icon: MoonStars, color: "#277da1", page: 4, orientationAngle: 0, data: [] },

    { order: 2, name: "Creative", icon: PaintBrush, color: "#f3722c", page: 1, orientationAngle: 90, data: [] },
    { order: 5, name: "Pets", icon: PawPrint, color: "#f9c74f", page: 2, orientationAngle: 90, data: [] },
    { order: 9, name: "Media", icon: Television, color: "#577590", page: 3, orientationAngle: 270, data: [] },
    { order: 12, name: "Games", icon: GameController, color: "#9400D3", page: 4, orientationAngle: 90, data: [] },
];

const ActivitiesEnum = {
    Unity: "Unity",
    Creative: "Creative",
    Atly: "Atly",
    Dates: "Dates",
    Pets: "Pets",
    People: "People",
    Read: "Read",
    OP: "OP",
    Media: "Media",
    Sleep: "Sleep",
    Games: "Games",
    Gym: "Gym",
}

// four directional "map"
const PageMazeMap = {
    Unity: {
        Up: ActivitiesEnum.Atly,
        Down: ActivitiesEnum.Creative,
        Left: ActivitiesEnum.Sleep,
        Right: ActivitiesEnum.Dates
    },
    Creative: {
        Up: ActivitiesEnum.Unity,
        Down: ActivitiesEnum.Atly,
        Left: ActivitiesEnum.Games,
        Right: ActivitiesEnum.Pets
    },
    Atly: {
        Up: ActivitiesEnum.Creative,
        Down: ActivitiesEnum.Unity,
        Left: ActivitiesEnum.Gym,
        Right: ActivitiesEnum.People
    },
    Dates: {
        Up: ActivitiesEnum.People,
        Down: ActivitiesEnum.Pets,
        Left: ActivitiesEnum.Unity,
        Right: ActivitiesEnum.Read,
    },
    Pets: {
        Up: ActivitiesEnum.Dates,
        Down: ActivitiesEnum.People,
        Left: ActivitiesEnum.Creative,
        Right: ActivitiesEnum.Media,
    },
    People: {
        Up: ActivitiesEnum.Pets,
        Down: ActivitiesEnum.Dates,
        Left: ActivitiesEnum.Atly,
        Right: ActivitiesEnum.OP,
    },
    Read: {
        Up: ActivitiesEnum.OP,
        Down: ActivitiesEnum.Media,
        Left: ActivitiesEnum.Dates,
        Right: ActivitiesEnum.Sleep,
    },
    OP: {
        Up: ActivitiesEnum.Media,
        Down: ActivitiesEnum.Read,
        Left: ActivitiesEnum.People,
        Right: ActivitiesEnum.Gym,
    },
    Media: {
        Up: ActivitiesEnum.Read,
        Down: ActivitiesEnum.OP,
        Left: ActivitiesEnum.Pets,
        Right: ActivitiesEnum.Games,
    },
    Sleep: {
        Up: ActivitiesEnum.Gym,
        Down: ActivitiesEnum.Games,
        Left: ActivitiesEnum.Read,
        Right: ActivitiesEnum.Unity,
    },
    Games: {
        Up: ActivitiesEnum.Sleep,
        Down: ActivitiesEnum.Gym,
        Left: ActivitiesEnum.Media,
        Right: ActivitiesEnum.Creative,
    },
    Gym: {
        Up: ActivitiesEnum.Games,
        Down: ActivitiesEnum.Sleep,
        Left: ActivitiesEnum.OP,
        Right: ActivitiesEnum.Atly,
    },
};

const Icon = ({ name, ...rest }) => {
    const Icon = name;
    return <Icon {...rest}/>
}

// TODO: Enum for page names + change the mapping to be something like: Unity: { name: "Unity", direction: { ... }} 
function App() {
    const [isDiscreteMode, setIsDiscreteMode] = useState(false);
    const [isActivityView, setIsActivityView] = useState(true);
    const [currentActivity, setCurrentActivity] = useState({});
    const [isLocked, setIsLocked] = useState(false);
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

    const LockIcon = useMemo(() =>
        isLocked ? Lock : LockOpen, [isLocked]);
    const activity = Activities.find(activity => activity.name.toLowerCase() === activePage.toLowerCase());
    const hasBackgroundActivity = useMemo(() => {
        return currentActivity.name && activity.name !== currentActivity.name;
    }, [currentActivity, activity]);

    return (
        <section className="App overflow-y-hidden h-screen" {...handlers}>
            <div className="absolute top-4 left-0 flex justify-between w-screen px-8">
                <div className="flex gap-8">
                    <span>
                        <ArrowCounterClockwise
                            color="white"
                            size={32}
                            className="cursor-pointer"
                            onClick={() => window.location.reload()}/>
                    </span>
                    <span>
                        <ChartBar
                            color="white"
                            size={32}
                            className="cursor-pointer"
                            onClick={() => setIsActivityView(!isActivityView)}/>
                    </span>
                </div>
                <div
                    style={{
                        backgroundColor: hasBackgroundActivity ? currentActivity.color : "transparent"
                    }}
                    className={classNames("flex items-center justify-end gap-2", {
                        "text-xl px-4 py-2 rounded-2xl": hasBackgroundActivity,
                    })}>
                    <LockIcon
                        size={32}
                        className="cursor-pointer"
                        onClick={() => setIsLocked(!isLocked)}/>
                    {hasBackgroundActivity ? `${currentActivity.name}` : ""}
                </div>
            </div>
            {isActivityView
                ? (
                    <>
                        <div className="absolute top-40 flex justify-center w-screen">
                            <div className="grid grid-cols-4 grid-rows-3 gap-2">
                                {Activities.map(activity => {
                                    const isActive = activePage?.toLowerCase() === activity.name?.toLowerCase();
                                    return (
                                        <span
                                            key={activity.name}
                                            className={classNames("w-4 h-4", {
                                                "bg-white text-black opacity-50": isActive,
                                                "opacity-40": !isActive,
                                            })}>
                                            <Icon name={activity.icon}/>
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                        <ActivitiesView
                            isDiscrete={isDiscreteMode}
                            currentActivity={currentActivity}
                            onActivityChange={newActivity => {
                                setIsLocked(Boolean(newActivity));
                                setCurrentActivity(newActivity || {});
                            }}
                            activity={activity}
                            onChangePage={() => setIsActivityView(false)}/>
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
