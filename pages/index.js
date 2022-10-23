import { getSession } from "next-auth/react";
import { useEffect, useState, } from 'react';
import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react";
import Footer from "../components/Footer";

export default function Home(props) {
  const { session } = props;

  return (
    <div className="flex flex-col max-w-2xl m-auto h-full min-h-screen bg-[#38a6b5] justify-between">

      <div className="text-center text-white font-bold">
        <div className="text-2xl py-5 bg-[#3285a1] px-1">
          Digital Addiction Tracker App
        </div>

        {session ?
          (
            <div>
              <div>
                Title of thingy, click to change
              </div>

            </div>
          ) : (
            <div>
              <div className="mt-24">
                DATA is the first Tracking App specifically designed for recovering from a Digital Addiction.
              </div>
              <div className="mt-4">
                <ol className="text-left mx-4">
                  <li><span className="text-[#053b4d]">DATA</span> is a Counter App</li>
                  <li><span className="text-[#053b4d]">DATA</span> is a Digital Addiction Recovery Aid</li>
                  <li><span className="text-[#053b4d]">DATA</span> was built by a Recovering Addict</li>
                  <li><span className="text-[#053b4d]">DATA</span> was made <span className="font-bold">for Digital Addiction</span></li>
                  <li><span className="text-[#053b4d]">DATA</span> is your way out.</li>
                </ol>
              </div>
              <div className="mt-16">
                Try DATA today.
              </div>
              <button onClick={signIn} className="border-2 rounded p-1 my-2">Sign In / Create Account</button>
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
  return {
    props: {
      session,
    },
  };
};
