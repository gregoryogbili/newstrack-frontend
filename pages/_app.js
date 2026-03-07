import "../styles/globals.css";
import Head from "next/head";
import CookieConsent from "react-cookie-consent";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />

        <meta charSet="UTF-8" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="NewsTrac" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <style jsx global>{`
        html,
        body {
          overflow-x: hidden;
        }
      `}</style>

      {/* PAGE CONTENT */}
      <Component {...pageProps} />

      {/* COOKIE CONSENT */}
      <CookieConsent
        location="bottom"
        buttonText="Accept"
        cookieName="newstrac_cookie_consent"
        style={{
          background: "#08121c",
          fontSize: "14px",
        }}
        buttonStyle={{
          background: "#c40000",
          color: "#fff",
          fontSize: "14px",
          borderRadius: "6px",
          padding: "8px 16px",
        }}
        expires={365}
      >
        NewsTrac uses cookies to improve platform performance and user
        experience. See our{" "}
        <a href="/cookies" style={{ color: "#ff4d4d" }}>
          Cookie Policy
        </a>.
      </CookieConsent>
    </>
  );
}