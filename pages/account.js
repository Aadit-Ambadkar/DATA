import { signOut } from "next-auth/react";
import { getSession } from "next-auth/react";
import { useRouter } from 'next/router'
import Footer from "../components/Footer";
import { fetch_db, savePref } from "../fb/Firebase";
import { collection, doc, addDoc, getDoc, setDoc } from 'firebase/firestore';
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
	const setData = () => {
		const uid = session.user.id.toString();
		data.movie = movie;
		data.video = video;
		data.media = media;
		data.games = games;
		let db = fetch_db();
		let docRef = doc(db, "users", uid);
		setDoc(docRef, data).then(() => {
			alert('Sent');
		}).catch((err) => {
			console.error(err);
		})
	}
	return (
		<div>
			<div className="flex flex-col max-w-2xl m-auto h-full min-h-screen bg-[#38a6b5] justify-between">
				<div className="">
					<div className="text-center text-white font-bold">
						<div className="text-2xl py-5 bg-[#3285a1] px-1">
							Digital Addiction Tracker App
						</div>
						<div className="pt-2 pb-4 bg-gray-800">
							<div className="mt-2 mb-1 text-lg">Change Daily Limits</div>
							<div className="my-2">TV/Movies:&nbsp;&nbsp;&nbsp;<input type={"number"} className="text-black p-1 w-8" value={movie} onChange={editMovie} /> hrs</div>
							<div className="my-2">Videos:&nbsp;&nbsp;&nbsp;<input type={"number"} className="text-black p-1 w-8" value={video} onChange={editVideo} /> hrs</div>
							<div className="my-2">Social Media:&nbsp;&nbsp;&nbsp;<input type={"number"} className="text-black p-1 w-8" value={media} onChange={editMedia} /> hrs</div>
							<div className="my-2">Video Games:&nbsp;&nbsp;&nbsp;<input type={"number"} className="text-black p-1 w-8" value={games} onChange={editGames} /> hrs</div>
							<button onClick={setData} className="border-2 rounded p-1 my-2">Save</button>
						</div>
					</div>
				</div>
				<div className="text-center text-white font-bold">
					<button onClick={signOut} className="border-2 rounded p-1 my-2">Sign Out</button>
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
	let data = docSnap.data();
	if (!("movie" in data)) {
		data["movie"] = 0;
		data["video"] = 0;
		data["media"] = 0;
		data["games"] = 0;
		await setDoc(docRef, data);
	}

	return {
		props: {
			session,
			data
		},
	};
};