import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE;

console.log("API BASE:", API);

export default function Home() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!API) {
      setError("API base URL not configured.");
      setLoading(false);
      return;
    }

    fetch(`${API}/posts`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch posts");
        return res.json();
      })
      .then(data => {
        setFeed(data.slice(0, 12));
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError("Unable to load news at the moment.");
        setLoading(false);
      });
  }, []);

  const headlines = feed.slice(0, 5);

  return (
    <div style={container}>

      {/* NAVBAR */}
      <header style={header}>
        <div style={logoWrap}>
          <Image 
            src="/logo.png" 
            alt="NewsTrac Logo" 
            width={40} 
            height={40} 
          />
          <h1 style={logoText}>NewsTrac</h1>
        </div>
        <nav>
          <Link href="/login" style={navButton}>Login</Link>
        </nav>
      </header>

      {/* ELITE BREAKING TICKER */}
      {!loading && !error && headlines.length > 0 && (
        <div style={tickerWrap}>
          <div style={tickerFadeLeft} />
          <div style={tickerFadeRight} />

          <div style={ticker}>
            <div style={tickerInner}>

              {/* First Copy */}
              {headlines.map((post, index) => (
                <span key={`first-${post.id}`} style={tickerItem}>
                  {index === 0 && (
                    <span style={liveWrap}>
                      <span style={liveDot}></span>
                      <span style={liveText}>BREAKING</span>
                    </span>
                  )}

                  {post.source_url ? (
                    <a
                      href={post.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={tickerLink}
                    >
                      {post.headline}
                    </a>
                  ) : (
                    <span>{post.headline}</span>
                  )}
                  <span style={separator}>•</span>
                </span>
              ))}

              {/* Duplicate Copy for Seamless Loop */}
              {headlines.map((post) => (
                <span key={`second-${post.id}`} style={tickerItem}>
                  {post.source_url ? (
                    <a
                      href={post.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={tickerLink}
                    >
                      {post.headline}
                    </a>
                  ) : (
                    <span>{post.headline}</span>
                  )}
                  <span style={separator}>•</span>
                </span>
              ))}

            </div>
          </div>
        </div>
      )}

      <h2 style={sectionTitle}>Latest News</h2>

      {loading && <p>Loading latest stories...</p>}
      {error && <p style={{color:"red"}}>{error}</p>}

      {!loading && !error && (
        <>
          <div style={grid}>
            {feed.map(post => (
              <div key={post.id} style={card}>
                <h3>{post.headline}</h3>

                {post.description && (
                  <p style={desc}>
                    {post.description.slice(0, 150)}...
                  </p>
                )}

                {post.source_url && (
                  <a 
                    href={post.source_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={readMore}
                  >
                    Read Full Article →
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={ctaSection}>
            <h2>Are You a Journalist?</h2>
            <p>
              Submit your stories and reach a growing audience powered by AI ranking.
            </p>
            <button style={ctaButton}>
              Submit Your News
            </button>
          </div>
        </>
      )}

      {/* TECH STRIP */}
      <div style={techSection}>
        <h3>Powered by GENŌ Intelligentia</h3>
        <div style={techTicker}>
          Built with: • Node.js backend • PostgreSQL database • RSS ingestion automation • AI ranking pipeline (planned) • Real-time deployment (Render + Vercel)
        </div>
      </div>

      <footer style={footer}>
        © 2026 Geno Intelligentia Limited, United Kingdom
      </footer>

      {/* ELITE ANIMATIONS */}
      <style jsx>{`
        @keyframes scrollLoop {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
        }

        div[style*="scrollLoop"] {
          animation: scrollLoop 25s linear infinite;
        }
      `}</style>

    </div>
  );
}

/* STYLES */

const container = {
  fontFamily: "system-ui, Arial",
  maxWidth: 1100,
  width: "100%",
  margin: "0 auto",
  padding: 20
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 40
};

const logoWrap = {
  display: "flex",
  alignItems: "center",
  gap: 10
};

const logoText = {
  fontSize: 24,
  fontWeight: 700
};

const navButton = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "1px solid #ddd",
  textDecoration: "none",
  color: "#000"
};

const sectionTitle = {
  fontSize: 26,
  marginBottom: 20
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: 20
};

const card = {
  border: "1px solid #eee",
  borderRadius: 12,
  padding: 18,
  background: "#fafafa"
};

const desc = {
  color: "#666",
  marginTop: 8
};

const readMore = {
  display: "inline-block",
  marginTop: 10,
  color: "#000",
  fontWeight: 600,
  textDecoration: "none"
};

const footer = {
  marginTop: 60,
  textAlign: "center",
  color: "#777"
};

const tickerWrap = {
  position: "relative",
  overflow: "hidden",
  background: "#000",
  color: "#fff",
  padding: "10px 0",
  marginBottom: 30
};

const ticker = {
  overflow: "hidden",
  whiteSpace: "nowrap"
};

const tickerInner = {
  display: "inline-flex",
  animation: "scrollLoop 25s linear infinite"
};

const tickerItem = {
  display: "inline-flex",
  alignItems: "center",
  marginRight: 40
};

const tickerLink = {
  color: "#fff",
  textDecoration: "none",
  fontWeight: 500
};

const separator = {
  marginLeft: 20
};

const tickerFadeLeft = {
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
  width: 60,
  background: "linear-gradient(to right, #000 70%, transparent)"
};

const tickerFadeRight = {
  position: "absolute",
  right: 0,
  top: 0,
  bottom: 0,
  width: 60,
  background: "linear-gradient(to left, #000 70%, transparent)"
};

const liveWrap = {
  display: "inline-flex",
  alignItems: "center",
  marginRight: 12,
  fontWeight: 700
};

const liveDot = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: "red",
  marginRight: 6,
  animation: "pulse 1.5s infinite"
};

const liveText = {
  fontSize: 12,
  letterSpacing: 1
};

const ctaSection = {
  marginTop: 60,
  padding: 40,
  textAlign: "center",
  background: "#f4f4f4",
  borderRadius: 16
};

const ctaButton = {
  marginTop: 20,
  padding: "12px 24px",
  borderRadius: 10,
  border: "none",
  background: "#000",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer"
};

const techSection = {
  marginTop: 60,
  padding: 30,
  background: "#111",
  color: "#fff",
  borderRadius: 16,
  textAlign: "center"
};

const techTicker = {
  marginTop: 10,
  whiteSpace: "nowrap",
  overflow: "hidden"
};
