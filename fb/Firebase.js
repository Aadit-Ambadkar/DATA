import { initializeApp, getApps, getApp } from 'firebase/app'
import { collection, getFirestore, addDoc } from 'firebase/firestore'

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

export { fetch_db };