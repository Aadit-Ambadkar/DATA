import '../styles/globals.css'
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <div className="bg-gradient-to-r from-[#b1d1e0] via-[#38a6b5] to-[#b1d1e0]">
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  )
}

export default MyApp
