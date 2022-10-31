import '../styles/globals.css'
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <div className="">
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  )
}

export default MyApp
