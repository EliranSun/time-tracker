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
    updateDoc,
    deleteDoc
} from "firebase/firestore";
import {initializeApp} from "firebase/app";
import {Activities} from "../constants/activities";
import allActivitiesMock from "../mocks/all-activities.json";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const addActivityData = async (activity) => {
    return await addDoc(collection(db, `activities/${activity.name}/data`), activity);
};

const mockTime = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}

export const updateActivityData = async (ref, activity) => {
    if (process.env.REACT_APP_ENABLE_MOCK === "true") {
        console.warn("updateActivityData - mock enabled");
        return await mockTime();
    }

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
    const newestActivitiesData = [];

    for (const activity of Activities) {
        const dataCollectionRef = collection(db, `activities/${activity.name}/data`);
        const q = query(dataCollectionRef, orderBy("end", "desc"), limit(1));
        const dataSnapshot = await getDocs(q);

        if (!dataSnapshot.empty) {
            const newestDataDoc = dataSnapshot.docs[0];
            const data = newestDataDoc.data();
            newestActivitiesData.push({
                name: activity.name,
                lastEntryTimestamp: data?.end,
                timeSpent: data?.end - data?.start,
            });
        }
    }

    return newestActivitiesData;
}

export const getAllDocsInActivity = async (activityName) => {
    const data = [];

    if (localStorage.getItem('mock') === 'true' || process.env.REACT_APP_ENABLE_MOCK === "true") {
        console.log("Mock fetch!");
        const activities = allActivitiesMock
            .find(activity => activity.find(a => a.name === activityName)) || [];

        return activities.map(activity => ({
            ...activity,
            id: `${activity.start}-${activity.end}-${activity.name}-${Math.random()}`
        }));
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

    return data || [];
};

export const updateActivityTimeById = async (activityName, docId, data) => {
    if (!activityName || !docId || (!data.start && !data.end)) {
        throw new Error("missing data");
    }

    return await updateDoc(doc(db, `activities/${activityName}/data/${docId}`), {
        start: data.start,
        end: data.end,
    });
};

export const deleteActivityById = async (activityName, docId) => {
    return await deleteDoc(doc(db, `activities/${activityName}/data/${docId}`));
}