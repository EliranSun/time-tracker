import {addDoc, collection, doc, getDoc, getFirestore, setDoc, updateDoc} from "firebase/firestore";
import {initializeApp} from "firebase/app";

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

export const addActivityData = async (activity) => {
    return await addDoc(collection(db, `activities/${activity.name}/data`), activity);
};
export const updateActivityData = async (ref, activity) => {
    return await updateDoc(ref, activity);
}
export const setCurrentActivityDoc = async (activity) => {
    return await setDoc(doc(db, 'currentActivity', 'activity'), activity);
};

export const getCurrentActivityDoc = () => {
    return getDoc(doc(db, 'currentActivity', 'activity'));
};

export const getRefByPath = (path) => {
    return doc(db, path);
}