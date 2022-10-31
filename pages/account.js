import { signOut } from "next-auth/react";
import { getSession } from "next-auth/react";
import { useRouter } from 'next/router'
import Footer from "../components/Footer";
import { fetch_db, savePref } from "../fb/Firebase";
import { collection, doc, addDoc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getDate, getSanitizedDate } from "../utils/utils";
import { useState } from 'react';
import Bar from "../components/Bar";
import toast, { Toaster } from "react-hot-toast";

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
			<div><Toaster /></div>
			<div className="flex flex-col max-w-[500px] m-auto h-full min-h-screen bg-[#F8FAFF] justify-between">
				<div className="">
					<div className="text-center text-black font-bold">
						<div className={`${session ? "text-lg py-3" : "text-2xl py-5"} bg-blue-700 text-white px-1`}>
							Digital Addiction Tracker App
						</div>
					</div>
					<div className="text-center font-bold text-gray-800">
						<div className="bg-white mx-14 mb-6 mt-6 py-2 rounded-xl shadow-md">
							<div className="pt-2 pb-4">
								<div className="mt-2 mb-2 text-xl">Change Daily Limits</div>

								<div className="text-gray-600">
									<div className="mx-[15%] flex">
										<span className="mr-auto">TV/Movies:</span>
										<span>
											<input
												type={"number"}
												className="text-blue-600 p-1 w-10 text-center border-b-2 border-blue-600"
												value={movieLimit}
												onChange={editMovie}
											/>
											hrs
										</span>
									</div>
									<div className="mx-[15%] flex">
										<span className="mr-auto">Videos/Shorts:</span>
										<span>
											<input
												type={"number"}
												className="text-blue-600 p-1 w-10 text-center border-b-2 border-blue-600"
												value={videoLimit}
												onChange={editVideo}
											/>
											hrs
										</span>
									</div>
									<div className="mx-[15%] flex">
										<span className="mr-auto">Social Media:</span>
										<span>
											<input
												type={"number"}
												className="text-blue-600 p-1 w-10 text-center border-b-2 border-blue-600"
												value={mediaLimit}
												onChange={editMedia}
											/>
											hrs
										</span>
									</div>
									<div className="mx-[15%] flex">
										<span className="mr-auto">Video Games:</span>
										<span>
											<input
												type={"number"}
												className="text-blue-600 p-1 w-10 text-center border-b-2 border-blue-600"
												value={gamesLimit}
												onChange={editGames}
											/>
											hrs
										</span>
									</div>
								</div>
								<button onClick={async () => {
									await setData().then(
										toast.success("Saved")
									)
								}}
									className="ml-3 px-2 py-1.5 my-2 text-white rounded bg-blue-600 shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
								>
									Save
								</button>
							</div>
						</div>
						<div className="bg-white mx-14 mb-6 mt-6 py-5 px-5 rounded-xl shadow-md">
							<div className="mb-2 text-xl">Today's Total Usage</div>
							<Bar
								curValue={
									data[`${getSanitizedDate()}movie`] +
									data[`${getSanitizedDate()}video`] +
									data[`${getSanitizedDate()}media`] +
									data[`${getSanitizedDate()}games`]
								}
								max={
									(
										data[`movieLimit`] +
										data[`videoLimit`] +
										data[`mediaLimit`] +
										data[`gamesLimit`]
									) * 60
								}
							/>
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
			movieLimit: 1,
			videoLimit: 1,
			mediaLimit: 1,
			gamesLimit: 1,
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