import "../styles/globals.css";
import Head from "next/head";

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

      <Component {...pageProps} />
    </>
  );
}
