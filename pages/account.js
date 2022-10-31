import { signOut } from "next-auth/react";
import { getSession } from "next-auth/react";
import { useRouter } from 'next/router'
import Footer from "../components/Footer";
import { fetch_db, savePref } from "../fb/Firebase";
import { collection, doc, addDoc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getDate } from "../utils/utils";
import { useState } from 'react';

export default function Account(props) {
	const { session, data } = props;
	const router = useRouter();
	const [movieLimit, setMovieLimit] = useState(data["movieLimit"]);
	const [videoLimit, setVideoLimit] = useState(data["videoLimit"]);
	const [mediaLimit, setMediaLimit] = useState(data["mediaLimit"]);
	const [gamesLimit, setGamesLimit] = useState(data["gamesLimit"]);

	const editMovie = async (e) => {
		let time = e.target.value;
		setMovieLimit(time);
	}
	const editVideo = async (e) => {
		let time = e.target.value;
		setVideoLimit(time);
	}
	const editMedia = async (e) => {
		let time = e.target.value;
		setMediaLimit(time);
	}
	const editGames = async (e) => {
		let time = e.target.value;
		setGamesLimit(time);
	}
	const setData = async () => {
		const uid = session.user.id.toString();
		// something
		await fetch("./api/update", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: uid,
        update: {
          key: "movieLimit",
          value: parseFloat(movieLimit)
        }
      })
    });
		await fetch("./api/update", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: uid,
        update: {
          key: "videoLimit",
          value: parseFloat(videoLimit)
        }
      })
    });
		await fetch("./api/update", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: uid,
        update: {
          key: "mediaLimit",
          value: parseFloat(mediaLimit)
        }
      })
    });
		await fetch("./api/update", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: uid,
        update: {
          key: "gamesLimit",
          value: parseFloat(gamesLimit)
        }
      })
    });
	}
	return (
		<div>
			<div className="flex flex-col max-w-2xl m-auto h-full min-h-screen bg-blue-100 justify-between">
				<div className="">
					<div className="text-center text-black font-bold">
						<div className={`${session ? "text-lg py-3" : "text-2xl py-5"} bg-blue-700 px-1`}>
							Digital Addiction Tracker App
						</div>
						<div className="pt-2 pb-4 bg-blue-200">
							<div className="mt-2 mb-1 text-lg">Change Daily Limits</div>
							<div className="my-2">TV/Movies:&nbsp;&nbsp;&nbsp;<input type={"number"} className="text-black p-1 w-10 text-center border-b-2 border-slate-700" value={movieLimit} onChange={editMovie} /> hrs</div>
							<div className="my-2">Videos:&nbsp;&nbsp;&nbsp;<input type={"number"} className="text-black p-1 w-10 text-center border-b-2 border-slate-700" value={videoLimit} onChange={editVideo} /> hrs</div>
							<div className="my-2">Social Media:&nbsp;&nbsp;&nbsp;<input type={"number"} className="text-black p-1 w-10 text-center border-b-2 border-slate-700" value={mediaLimit} onChange={editMedia} /> hrs</div>
							<div className="my-2">Video Games:&nbsp;&nbsp;&nbsp;<input type={"number"} className="text-black p-1 w-10 text-center border-b-2 border-slate-700" value={gamesLimit} onChange={editGames} /> hrs</div>
							<button onClick={async () => { await setData() }} className="ml-3 px-2 py-1.5 my-2 text-white rounded bg-blue-600 shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Save</button>
						</div>
					</div>
				</div>
				<div className="text-center text-white font-bold">
					<button onClick={signOut} className="ml-3 px-2 py-1.5 my-2 text-white rounded bg-blue-600 shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Sign Out</button>
					<Footer />
				</div>
			</div>
		</div>
	)
}

export async function getServerSideProps(context) {
	const session = await getSession(context);
	if (!session) {
		return {
			redirect: {
				destination: './',
				permanent: false,
			}
		}
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
	if (!("movieLimit" in data)) {
		await updateDoc(docRef, {
			movieLimit: 0,
			videoLimit: 0,
			mediaLimit: 0,
			gamesLimit: 0,
			movieCleanSince: getDate(),
			videoCleanSince: getDate(),
			mediaCleanSince: getDate(),
			gamesCleanSince: getDate(),
		});
	}

	return {
		props: {
			session,
			data
		},
	};
};