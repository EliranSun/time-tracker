import './App.css';
import { useState } from 'react';
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { ActivitiesView } from "./ActivitiesView";
import { StatsView } from "./Stats";

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
    { name: "Unity", icon: "", color: "red", data: [] },
    { name: "Atly", icon: "", color: "blue", data: [] },
    { name: "Gym", icon: "", color: "green", data: [] },
    { name: "Reading", icon: "", color: "yellow", data: [] },
    { name: "One Piece", icon: "", color: "purple", data: [] },
    { name: "Creative Project", icon: "", color: "pink", data: [] },
    { name: "Pets", icon: "", color: "indigo", data: [] },
    { name: "Friends & Family", icon: "", color: "gray", data: [] },
    { name: "TV & YouTube", icon: "", color: "teal", data: [] },
    { name: "Sleep", icon: "", color: "orange", data: [] },
    { name: "Games", icon: "", color: "blue", data: [] },
];

// github client id: 9697f565df42fcd784fb
// GITHUB_CLIENT_SECRET: f8bb097cac89439b4af3f00e373b401b56017207
// NEXTAUTH_SECRET: 3c5465409b54b819d682c9606bd3bfb9


function App() {
    const [isActivityView, setIsActivityView] = useState(true);

    return (
        <section className="App">
            {isActivityView
                ? <ActivitiesView onChangePage={() => setIsActivityView(false)}/>
                : <StatsView onChangePage={() => setIsActivityView(true)}/>}
        </section>
    )
}

export default App;
