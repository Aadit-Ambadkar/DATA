import { signOut } from "next-auth/react";
import { getSession } from "next-auth/react";
import { useRouter } from 'next/router'
import Footer from "../components/Footer";
import { fetch_db, savePref } from "../fb/Firebase";
import { collection, doc, addDoc, getDoc, setDoc } from 'firebase/firestore';
import { getDate } from "../utils/utils";
import { useState } from 'react';

export default function Account(props) {
	const { session, data } = props;
	const router = useRouter();
	const [movie, setMovie] = useState(data["movie"]);
	const [video, setVideo] = useState(data["video"]);
	const [media, setMedia] = useState(data["media"]);
	const [games, setGames] = useState(data["games"]);

	const editMovie = async (e) => {
		let time = e.target.value;
		setMovie(time);
	}
	const editVideo = async (e) => {
		let time = e.target.value;
		setVideo(time);
	}
	const editMedia = async (e) => {
		let time = e.target.value;
		setMedia(time);
	}
	const editGames = async (e) => {
		let time = e.target.value;
		setGames(time);
	}
	const setData = async () => {
		const uid = session.user.id.toString();
		data.movie = movie;
		data.video = video;
		data.media = media;
		data.games = games;
		let db = fetch_db();
		let docRef = doc(db, "users", uid);
		console.log("asdf");
		await setDoc(docRef, data).then(() => {
			console.log("fdsa");
		}).catch((err) => {
			console.error(err);
		})
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
							<div className="my-2">TV/Movies:&nbsp;&nbsp;&nbsp;<input type={"number"} className="text-black p-1 w-8" value={movie} onChange={editMovie} /> hrs</div>
							<div className="my-2">Videos:&nbsp;&nbsp;&nbsp;<input type={"number"} className="text-black p-1 w-8" value={video} onChange={editVideo} /> hrs</div>
							<div className="my-2">Social Media:&nbsp;&nbsp;&nbsp;<input type={"number"} className="text-black p-1 w-8" value={media} onChange={editMedia} /> hrs</div>
							<div className="my-2">Video Games:&nbsp;&nbsp;&nbsp;<input type={"number"} className="text-black p-1 w-8" value={games} onChange={editGames} /> hrs</div>
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
			data
		},
	};
};