import { getSession } from "next-auth/react";
import { useEffect, useRef, useState, } from 'react';
import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react";
import Footer from "../components/Footer";
import { fetch_db } from "../fb/Firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getDate, getSanitizedDate, subtractDates } from "../utils/utils";
import { useRouter } from 'next/router'
import Bar from "../components/Bar";

export default function Home(props) {
  const { session, data } = props;
  const uid = session?.user.id.toString();
  const [index, setIndex] = useState(0);
  const idList = ["movie", "video", "media", "games"];
  const nameList = ["TV/Movies", "Videos/Shorts", "Social Media", "Video Games"];
  const router = useRouter();

  const changeIndex = () => {
    setIndex((index + 1) % 4);
  }

  const getStreak = () => {
    let today = getDate();
    let prev = data[`${idList[index]}CleanSince`];
    return subtractDates(today, prev);
  }

  const [logValue, setLogValue] = useState(0);
  const onUpdateLogValue = (e) => {
    let value = e.target.value;
    setLogValue(value);
  }
  const logTime = async () => {
    data[`${getSanitizedDate()}${idList[index]}`] = parseInt(data[`${getSanitizedDate()}${idList[index]}`]) + parseInt(logValue);
    await fetch("./api/update", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: uid,
        update: {
          key: `${getSanitizedDate()}${idList[index]}`,
          value: data[`${getSanitizedDate()}${idList[index]}`]
        }
      })
    });
    setLogValue(0);
    if (data[`${getSanitizedDate()}${idList[index]}`] > data[`${idList[index]}Limit`] * 60) {
      data[`${idList[index]}CleanSince`] = getDate();
      await fetch("./api/update", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: uid,
          update: {
            key: `${idList[index]}CleanSince`,
            value: data[`${idList[index]}CleanSince`]
          }
        })
      });
    }
    // console.log(logRef.current.value);
  }

  return (
    <div className="flex flex-col max-w-[500px] m-auto h-full min-h-screen bg-[#F8FAFF] justify-between">

      <div className="text-center text-black">

        <div className={`${session ? "text-lg py-3" : "text-2xl py-5"} bg-blue-700 text-white px-1`}>
          Digital Addiction Tracker App
        </div>

        {session ?
          (
            <div>
              <div className="text-blue-800 mb-6 py-2 bg-blue-200">
                <a onClick={changeIndex} className="cursor-pointer">{nameList[index]} (Tap To Change)</a>
              </div>
              <div className="mb-6">
                <Bar curValue={data[`${getSanitizedDate()}${idList[index]}`]} max={data[`${idList[index]}Limit`] * 60}/>
              </div>
              <div className="bg-white mx-14 mb-6 py-2 rounded-xl shadow-md">
                <div className="text-lg font-semibold text-gray-800">
                  Time Spent Today:
                </div>
                <div className="text-xl font-bold text-blue-600">
                  {data[`${getSanitizedDate()}${idList[index]}`]} min / {data[`${idList[index]}Limit`] * 60} min
                </div>
              </div>
              <div className="bg-white mx-14 mb-6 py-6 px-2 rounded-xl shadow-md">
                <div className="text-lg font-semibold text-gray-800">Log Additional Time Spent</div>
                <div className="text-xl font-bold text-blue-600">
                  <input type={"number"} className=" p-1 w-8 text-center border-b-2 border-blue-600" min={0} defaultValue={0} value={logValue} onChange={onUpdateLogValue}/> mins
                  <button onClick={logTime} className="ml-3 px-2 py-1.5 my-2 text-white rounded bg-blue-600 shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Log Time</button>
                </div>
              </div>
              
              <div className="bg-white mx-14 mb-6 py-2 rounded-xl shadow-md">
                <div className="text-lg font-semibold text-gray-800">
                  I've been clean for:
                </div>
                <div className="text-xl font-bold text-blue-600">
                  {getStreak()} day{getStreak() == 1 ? "" : "s"}
                </div>
              </div>
            </div>
          ) : (
            <div className="font-bold px-8">
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
  let docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return {
      props: {
        session: null,
      },
    };
  }
  let data = docSnap.data();
  if (!("movieLimit" in data)) {
    await updateDoc(docRef, {
      movieLimit: 1,
      videoLimit: 1,
      mediaLimit: 1,
      gamesLimit: 1,
      movieCleanSince: getDate(),
      videoCleanSince: getDate(),
      mediaCleanSince: getDate(),
      gamesCleanSince: getDate(),
    });
    docSnap = (await getDoc(docRef));
    data = docSnap.data();
  }
  if (!(`${getSanitizedDate()}movie` in data)) {
    let obj = {};
    obj[`${getSanitizedDate()}movie`] = 0;
    obj[`${getSanitizedDate()}video`] = 0;
    obj[`${getSanitizedDate()}media`] = 0;
    obj[`${getSanitizedDate()}games`] = 0;
    await updateDoc(docRef, obj);
    docSnap = (await getDoc(docRef));
    data = docSnap.data();
  }
  return {
    props: {
      session,
      data,
    }
  }

};
