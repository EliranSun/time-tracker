import {collection, getDocs} from "firebase/firestore";
import {db} from "./db";

export const getAllDocsInActivity = async (activityName) => {
    // TODO: This is O(n) and should be O(1)
    const querySnapshot = await getDocs(collection(db, `activities/${activityName}/data`));
    console.count("getAllDocsInActivity - expensive");
    const data = [];
    querySnapshot.forEach((doc) => {
        data.push(doc.data());
    });

    return data;
};

