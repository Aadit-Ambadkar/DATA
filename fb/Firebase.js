import { initializeApp, getApps, getApp } from 'firebase/app'
import { collection, getFirestore, addDoc, setDoc, doc } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.BUCKET,
    messagingSenderId: process.env.SENDID,
    appId: process.env.APPID
};

const app = (getApps().length > 0 ? getApp() : initializeApp(firebaseConfig));

const fetch_db = () => {
    return getFirestore(app);
}

const savePref = async (data, uid) => {
    let db = fetch_db();
    let docRef = doc(db, "users", uid)
    console.log("hi");
    await setDoc(docRef, data);
    console.log("hi");

}

export { fetch_db, savePref };