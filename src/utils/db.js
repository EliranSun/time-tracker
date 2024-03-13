import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    query,
    setDoc,
    updateDoc
} from "firebase/firestore";
import {initializeApp} from "firebase/app";
import {Activities} from "../constants/activities";
import allActivitiesMock from "../mocks/all-activities.json";

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

export async function getNewestInEachActivity() {
    // const activitiesCollectionRef = collection(db, "activities");
    // const activitiesSnapshot = await getDocs(activitiesCollectionRef);
    // console.log({docs:activitiesSnapshot.docs})
    const newestActivitiesData = [];

    for (const activity of Activities) {
        const dataCollectionRef = collection(db, `activities/${activity.name}/data`);
        const q = query(dataCollectionRef, orderBy("end", "desc"), limit(1));
        const dataSnapshot = await getDocs(q);

        if (!dataSnapshot.empty) {
            const newestDataDoc = dataSnapshot.docs[0];
            newestActivitiesData.push({
                name: activity.name,
                lastEntryTimestamp: newestDataDoc.data()?.end
            });
        }
    }

    return newestActivitiesData;
}

export const getAllDocsInActivity = async (activityName) => {
    const data = [];

    if (localStorage.getItem('mock') === 'true') {
        console.log('saved expensive call');
        return allActivitiesMock;

    }
    // TODO: This is O(n) and should be O(1)
    const querySnapshot = await getDocs(collection(db, `activities/${activityName}/data`));
    console.warn("getAllDocsInActivity - expensive");

    querySnapshot.forEach((doc) => {
        data.push({
            id: doc.id,
            ...doc.data()
        });
    });

    return data;
};

export const updateActivityTimeById = async (activityName, docId, data) => {
    return await updateDoc(doc(db, `activities/${activityName}/data/${docId}`), data);
}