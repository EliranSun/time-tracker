import './App.css';
import { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { ActivitiesView } from "./ActivitiesView";
import { StatsView } from "./Stats";
import { ArrowCounterClockwise, Briefcase, ChartBar, Circle, PaintBrush, PuzzlePiece } from "@phosphor-icons/react";
import { useSwipeable } from "react-swipeable";

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

export const Activities = [
    { name: "Unity", icon: PuzzlePiece, color: "#f94144", page: 1, orientationAngle: 0, data: [] },
    { name: "Creative", icon: PaintBrush, color: "#f3722c", page: 1, orientationAngle: 90, data: [] },
    { name: "Atly", icon: Briefcase, color: "#f8961e", page: 1, orientationAngle: 270, data: [] },

    { name: "Gym", icon: "", color: "#f9844a", page: 2, orientationAngle: 0, data: [] },
    { name: "Pets", icon: "", color: "#f9c74f", page: 3, orientationAngle: 90, data: [] },
    { name: "People", icon: "", color: "#90be6d", page: 3, orientationAngle: 270, data: [] },

    { name: "Reading", icon: "", color: "#43aa8b", page: 3, orientationAngle: 0, data: [] },
    { name: "One Piece", icon: "", color: "#4d908e", page: 3, orientationAngle: 90, data: [] },
    { name: "Media", icon: "", color: "#577590", page: 3, orientationAngle: 270, data: [] },

    { name: "Sleep", icon: "", color: "#277da1", page: 4, orientationAngle: 0, data: [] },
    { name: "Games", icon: "", color: "#9400D3", page: 4, orientationAngle: 90, data: [] },
    { name: "Dates", icon: "", color: "#C71585", page: 4, orientationAngle: 270, data: [] },
];

// github client id: 9697f565df42fcd784fb
// GITHUB_CLIENT_SECRET: f8bb097cac89439b4af3f00e373b401b56017207
// NEXTAUTH_SECRET: 3c5465409b54b819d682c9606bd3bfb9

const pages = [1, 2, 3, 4];

function App() {
    const [isActivityView, setIsActivityView] = useState(true);
    const [activePageNumber, setActivePageNumber] = useState(1);
    const handlers = useSwipeable({
        onSwipedLeft: () => setActivePageNumber(activePageNumber === 4 ? 1 : activePageNumber + 1),
        onSwipedRight: () => setActivePageNumber(activePageNumber === 1 ? 4 : activePageNumber - 1)
    });

    return (
        <section className="App overflow-y-hidden h-screen" {...handlers}>
            <div className="absolute top-4 left-4 flex gap-8">
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
            {isActivityView
                ? (
                    <>
                        <ActivitiesView
                            activities={Activities.filter(activity => activity.page === activePageNumber)}
                            onChangePage={() => setIsActivityView(false)}/>

                        <div className="text-white absolute bottom-10 flex gap-2 justify-center w-full">
                            {pages.map(page =>
                                <span><Circle weight={activePageNumber === page ? "fill" : "regular"}/></span>)}
                        </div>
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
