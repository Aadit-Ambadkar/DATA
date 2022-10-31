import '../styles/globals.css'
import { SessionProvider } from "next-auth/react";
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>DATA</title>
      </Head>
      <div className="">
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  )
}

export default MyApp
