import {collection, getDocs} from "firebase/firestore";
import {db} from "./db";
import allActivitiesMock from '../mocks/all-activities.json';

export const getAllDocsInActivity = async (activityName) => {
    if (localStorage.getItem('mock')) {
        console.log('saved expensive call');
        return allActivitiesMock;
    }

    // TODO: This is O(n) and should be O(1)
    const querySnapshot = await getDocs(collection(db, `activities/${activityName}/data`));
    console.warn("getAllDocsInActivity - expensive");
    const data = [];
    querySnapshot.forEach((doc) => {
        data.push(doc.data());
    });
    
    return data;
};

