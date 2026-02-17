import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE;

console.log("API BASE:", API);

/* 🔥 Inject Scroll Animation Once (Safe for Next.js) */
if (typeof window !== "undefined" && !document.getElementById("global-scroll-style")) {
  const style = document.createElement("style");
  style.id = "global-scroll-style";
  style.innerHTML = `
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `;
  document.head.appendChild(style);
}

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

      {/* 🎩 Rolling Tech Banner */}
      <div style={techBanner}>
        Built with: • Node.js • PostgreSQL • RSS Automation • AI Ranking Pipeline • Render + Vercel Deployment
      </div>

      {/* 🔴 BREAKING SECTION */}
      {!loading && !error && feed.length > 0 && (
        <div style={breakingContainer}>
          <div style={breakingTitle}>BREAKING</div>

          <div style={breakingSlider}>
            {feed.slice(0, 5).map(item => (
              <div key={item.id} style={breakingItem}>
                {item.headline}
              </div>
            ))}
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
        </>
      )}

      {/* 📰 Journalist Section */}
      <div style={journalistSection}>
        <h2>Are You a Journalist?</h2>
        <p>
          Publish your stories on Newstrac and earn revenue tied directly to your readership. No editorial bias, just
          AI-ranked visibility.
        </p>
        <a href="/submit" style={journalistButton}>
          Submit Your Story →
        </a>
      </div>

      <footer style={footer}>
        © 2026 Geno Intelligentia Limited, United Kingdom
      </footer>

    </div>
  );
}

/* =========================
   STYLES
========================= */

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
  marginBottom: 20
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

/* 🎩 Rolling Tech Banner */

const techBanner = {
  marginBottom: 30,
  fontSize: 14,
  color: "#555",
  overflow: "hidden",
  whiteSpace: "nowrap",
  animation: "scroll 25s linear infinite"
};

/* 🔴 Breaking Section */

const breakingContainer = {
  display: "flex",
  alignItems: "center",
  overflow: "hidden",
  borderRadius: 10,
  marginBottom: 30,
  background: "#111",
  color: "#fff"
};

const breakingTitle = {
  padding: "10px 16px",
  fontWeight: "bold",
  background: "#e10600"
};

const breakingSlider = {
  display: "flex",
  gap: 40,
  padding: "10px 20px",
  whiteSpace: "nowrap",
  animation: "scroll 20s linear infinite"
};

const breakingItem = {
  fontSize: 14
};

/* 📱 Responsive Grid Upgrade */

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 20
};

const sectionTitle = {
  fontSize: 26,
  marginBottom: 20
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

/* 📰 Journalist Section */

const journalistSection = {
  marginTop: 80,
  padding: 40,
  borderRadius: 14,
  background: "#f4f6f8",
  textAlign: "center"
};

const journalistButton = {
  display: "inline-block",
  marginTop: 20,
  padding: "12px 24px",
  background: "#000",
  color: "#fff",
  borderRadius: 8,
  textDecoration: "none",
  fontWeight: 600
};

const footer = {
  marginTop: 60,
  textAlign: "center",
  color: "#777"
};
