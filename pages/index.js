import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE;

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
        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }
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

      <h2 style={sectionTitle}>Latest News</h2>

      {loading && <p>Loading latest stories...</p>}
      {error && <p style={{color:"red"}}>{error}</p>}

      {!loading && !error && (
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
      )}

      <footer style={footer}>
        © 2026 Geno Intelligentia Limited, United Kingdom
      </footer>
    </div>
  );
}

/* STYLES */

const container = {
  fontFamily: "system-ui, Arial",
  maxWidth: 1100,
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
