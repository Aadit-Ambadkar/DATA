import { getSession } from "next-auth/react";
import { useEffect, useRef, useState, } from 'react';
import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react";
import Footer from "../components/Footer";
import { fetch_db } from "../fb/Firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDate, subtractDates } from "../utils/utils";

export default function Home(props) {
  const { session, data } = props;

  const [index, setIndex] = useState(0);
  const idList = ["movie", "video", "media", "games"];
  const nameList = ["TV/Movies", "Videos/Shorts", "Social Media", "Video Games"];
  
  const changeIndex = () => {
    setIndex((index + 1) % 4);
  }
  
  const getStreak = () => {
    let today = getDate();
    let prev = data[`${idList[index]}CleanSince`];
    return subtractDates(today, prev);
  }

  const logRef = useRef();
  const logTime = () => {
    /* This is really important as a function
     * First update the time spent today, and send that to the api
     * Then check if we have used more than the allotted limit
     * If so, reset the days clean since, otherwise we're good
    */
    console.log(logRef.current.value);
  }

  return (
    <div className="flex flex-col max-w-2xl m-auto h-full min-h-screen bg-blue-100 justify-between">

      <div className="text-center text-black">
        
        <div className={`${session ? "text-lg py-3" : "text-2xl py-5" } bg-blue-700 text-white px-1`}>
          Digital Addiction Tracker App
        </div>

        {session ?
          (
            <div>
              <div className="mb-6 py-2 bg-blue-200">
                <a onClick={changeIndex} className="cursor-pointer">{nameList[index]} (Tap To Change)</a>
              </div>
              <div className="bg-white mx-14 mb-6 py-2 rounded-xl shadow-xl">
                <div>
                  Time Spent Today:
                </div>
                <div className="text-xl font-bold">
                  {data[`${idList[index]}TimeUsed`]} min / {data[idList[index]] * 60} min
                </div>
              </div>

              <div className="bg-white mx-14 mb-6 py-2 rounded-xl shadow-xl">
                <div>
                  I've been clean for:
                </div>
                <div className="text-xl font-bold">
                  {getStreak()} day{getStreak() == 1 ? "" : "s"}
                </div>
              </div>

              <div className="bg-white mx-14 mb-16 py-2 rounded-xl shadow-xl">
                <div>
                  I've been clean since:
                </div>
                <div className="text-xl font-bold">
                  {data[`${idList[index]}CleanSince`]}
                </div>
              </div>

              <div className="bg-white mx-14 py-2 rounded-xl shadow-xl">
                <div>Log Additional Time Spent</div>
                <div className="text-xl font-bold">
                  <input type={"number"} className="text-black p-1 w-8 text-center border-b-2 border-slate-700" min={0} defaultValue={0} ref={logRef}/> mins
                  <button onClick={logTime} className="ml-3 px-2 py-1.5 my-2 text-white rounded bg-blue-600 shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Log Time</button>
                </div>

              </div>
            </div>
          ) : (
            <div className="font-bold px-10">
              <div className="mt-24">
                DATA is the first Tracking App specifically designed for recovering from a Digital Addiction.
              </div>
              <div className="mt-4">
                <ol className="text-left mx-4">
                  <li><span className="text-blue-600">DATA</span> is a Counter App</li>
                  <li><span className="text-blue-600">DATA</span> is a Digital Addiction Recovery Aid</li>
                  <li><span className="text-blue-600">DATA</span> was built by a Recovering Addict</li>
                  <li><span className="text-blue-600">DATA</span> was made <span className="font-bold">for Digital Addiction</span></li>
                  <li><span className="text-blue-600">DATA</span> is your way out.</li>
                </ol>
              </div>
              <div className="mt-16">
                Try DATA today.
              </div>
              <button onClick={signIn} className="ml-3 px-2 py-1.5 my-2 text-white rounded bg-blue-600 shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Sign In / Create Account</button>
            </div>
          )
        }
      </div>
      {session && <Footer />}

    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      props: {
        session,
      },
    };
  }
  const uid = session.user.id.toString();
  let db = fetch_db();
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return {
      props: {
        session: null,
      },
    };
  }
  let data = docSnap.data();
  if (!("movie" in data)) {
    data["movie"] = 0;
    data["video"] = 0;
    data["media"] = 0;
    data["games"] = 0;
    data["movieCleanSince"] = getDate();
    data["videoCleanSince"] = getDate();
    data["mediaCleanSince"] = getDate();
    data["gamesCleanSince"] = getDate();
    data["movieTimeUsed"] = 0;
    data["videoTimeUsed"] = 0;
    data["mediaTimeUsed"] = 0;
    data["gamesTimeUsed"] = 0;
    await setDoc(docRef, data);
  }
  return {
    props: {
      session,
      data,
    }
  }

};
