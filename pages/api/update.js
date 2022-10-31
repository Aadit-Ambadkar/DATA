import { doc, getDoc, updateDoc } from "firebase/firestore";
import { fetch_db } from "../../fb/Firebase";
let db = fetch_db();

export default async function handler(req, res) {
    const docRef = doc(db, "users", req.body.user);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        res.status(406).end();
    }
    let upd = {}
    upd[req.body.update.key] = req.body.update.value;
    await updateDoc(docRef, upd);
    console.log(req.body);
    res.status(200).end();
}