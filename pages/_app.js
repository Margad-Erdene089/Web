import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, ProtectRoute } from "../contexts/auth";
import "../styles/globals.css";
import { useState, useEffect } from "react";
import Head from "next/head";
export default function MyApp({ Component, pageProps }) {
  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  if (typeof window === "undefined") {
    return <></>;
  } else {
    return (
      <div>
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
        <ToastContainer />
      </div>
    );
  }
}
