import { getSession } from "next-auth/react";
import { useEffect, useState, } from 'react';
import { signIn } from "next-auth/react"

export default function Home(props) {
  return (
    <>
      <main>hello world!</main>
      <a onClick={signIn} className='cursor-pointer'>
        <span>Sign In</span>
      </a>
    </>
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
