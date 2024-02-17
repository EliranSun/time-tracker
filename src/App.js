import './App.css';
import { useState } from 'react';
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { ActivitiesView } from "./ActivitiesView";
import { StatsView } from "./Stats";
import { Briefcase, PaintBrush, PuzzlePiece } from "@phosphor-icons/react";

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
    { name: "Unity", icon: PuzzlePiece, color: "red", page: 1, orientationAngle: 0, data: [] },
    { name: "Creative", icon: PaintBrush, color: "pink", page: 1, orientationAngle: 90, data: [] },
    { name: "Atly", icon: Briefcase, color: "blue", page: 1, orientationAngle: 270, data: [] },
    { name: "Gym", icon: "", color: "green", page: 2, orientationAngle: 0, data: [] },
    { name: "Reading", icon: "", color: "yellow", page: 2, orientationAngle: 90, data: [] },
    { name: "One Piece", icon: "", color: "purple", page: 2, orientationAngle: 270, data: [] },
    { name: "Pets", icon: "", color: "indigo", page: 3, orientationAngle: 0, data: [] },
    { name: "People", icon: "", color: "gray", page: 3, orientationAngle: 90, data: [] },
    { name: "Media", icon: "", color: "teal", page: 3, orientationAngle: 270, data: [] },
    { name: "Sleep", icon: "", color: "orange", page: 4, orientationAngle: 0, data: [] },
    { name: "Games", icon: "", color: "blue", page: 4, orientationAngle: 90, data: [] },
];

// github client id: 9697f565df42fcd784fb
// GITHUB_CLIENT_SECRET: f8bb097cac89439b4af3f00e373b401b56017207
// NEXTAUTH_SECRET: 3c5465409b54b819d682c9606bd3bfb9


function App() {
    const [isActivityView, setIsActivityView] = useState(true);

    return (
        <section className="App">
            {isActivityView
                ? <ActivitiesView
                    activities={Activities.filter(activity => activity.page === 1)}
                    onChangePage={() => setIsActivityView(false)}/>
                : <StatsView onChangePage={() => setIsActivityView(true)}/>}
        </section>
    )
}

export default App;
