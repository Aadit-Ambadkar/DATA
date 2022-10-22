import { signOut } from "next-auth/react";
import { getSession } from "next-auth/react";
import { useRouter } from 'next/router'
import Footer from "../components/Footer";

export default function Account(props) {
	const { session } = props;
	const router = useRouter();

	return (
		<div>
			<div className="flex flex-col max-w-2xl m-auto h-full min-h-screen bg-[#38a6b5] justify-between">
				<div className="">
					<div className="text-center text-white font-bold">
						<div className="text-2xl py-5 bg-[#3285a1] px-1">
							Digital Addiction Tracker App
						</div>
						<div className="mt-2 mb-10">
							<div className="mt-2 mb-1 text-lg">Change Daily Limits</div>
							<div className="my-2">TV/Movies:&nbsp;&nbsp;&nbsp;<input type={"text"} className="text-black p-1 w-8"/> hrs</div>
							<div className="my-2">Videos:&nbsp;&nbsp;&nbsp;<input type={"text"} className="text-black p-1 w-8"/> hrs</div>
							<div className="my-2">Social Media:&nbsp;&nbsp;&nbsp;<input type={"text"} className="text-black p-1 w-8"/> hrs</div>
							<div className="my-2">Video Games:&nbsp;&nbsp;&nbsp;<input type={"text"} className="text-black p-1 w-8"/> hrs</div>
						</div>
						<button onClick={signOut} className="border-2 rounded p-1 my-2">Sign Out</button>
					</div>
				</div>
				<Footer />
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
	return {
		props: {
			session,
		},
	};
};