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
import {getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";

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
export const auth = getAuth(app);

export const signInWithGoogle = async () => {
    const userCred = await signInWithPopup(auth, new GoogleAuthProvider())
    return userCred.user;
};

// TODO: This is a global variable and should be refactored
let userId;

export const setUserDoc = async (user) => {
    const userRef = doc(db, `users/${user.uid}`);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        userId = user.uid;
        await setDoc(userRef, {
            email: user.email,
            name: user.displayName,
            photoUrl: user.photoURL,
            uid: user.uid,
        });
    }
};

export const addActivityData = async (activity) => {
    return await addDoc(collection(db, `users/${userId}/activities/${activity.name}/data`), activity);
};
export const updateActivityData = async (ref, activity) => {
    // if (process.env.REACT_APP_ENABLE_MOCK === "true") {
    //     console.warn("updateActivityData - mock enabled");
    //     return;
    // }

    return await updateDoc(ref, activity);
};


export const getRefByPath = (path) => {
    return doc(db, path);
}

export async function getNewestInEachActivity() {
    const newestActivitiesData = [];

    for (const activity of Activities) {
        const dataCollectionRef = collection(db, `users/${userId}/activities/${activity.name}/data`);
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

export const getUserActivities = async () => {
    const activities = [];

    const querySnapshot = await getDocs(collection(db, `users/${userId}/activities`));
    querySnapshot.forEach((doc) => {
        activities.push(doc.data());
    });

    return activities;
};

export const getAllDocsInActivity = async (activityName) => {
    const data = [];

    // if (localStorage.getItem('mock') === 'true' || process.env.REACT_APP_ENABLE_MOCK === "true") {
    //     return allActivitiesMock.find(activity => activity.find(a => a.name === activityName));
    // }

    // TODO: This is O(n) and should be O(1)
    const querySnapshot = await getDocs(collection(db, `users/${userId}/activities/${activityName}/data`));
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
    if (!activityName || !docId || (!data.start && !data.end)) {
        throw new Error("missing data");
    }

    return await updateDoc(doc(db, `users/${userId}/activities/${activityName}/data/${docId}`), {
        start: data.start,
        end: data.end,
    });
}