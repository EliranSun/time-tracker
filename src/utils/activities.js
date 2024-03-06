import {collection, getDocs} from "firebase/firestore";
import {db} from "./db";

export const getAllDocsInActivity = async (activityName) => {
    const querySnapshot = await getDocs(collection(db, `activities/${activityName}/data`));
    const data = [];
    querySnapshot.forEach((doc) => {
        data.push(doc.data());
    });

    return data;
};

