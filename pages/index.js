import Link from "next/link";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE;

export default function Home() {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    fetch(`${API}/posts`)
      .then(res => res.json())
      .then(data => setFeed(data.slice(0, 6)))
      .catch(() => {});
  }, []);

  return (
    <div style={container}>
      {/* HEADER */}
      <header style={header}>
        <h1 style={logo}>NewsTrack</h1>
        <nav>
          <Link href="/feed" style={navLink}>Feed</Link>
          <Link href="/login" style={navButton}>Login</Link>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section style={hero}>
        <h2 style={heroTitle}>Independent Journalism. Transparent Revenue.</h2>
        <p style={heroText}>
          NewsTrack empowers journalists with fair revenue sharing and real audience engagement.
        </p>
        <Link href="/feed" style={primaryButton}>
          View Latest News
        </Link>
      </section>

      {/* LATEST NEWS PREVIEW */}
      <section>
        <h3 style={sectionTitle}>Latest Stories</h3>
        <div style={grid}>
          {feed.map(post => (
            <div key={post.id} style={card}>
              <h4>{post.headline}</h4>
              <p style={{ color: "#666" }}>
                {post.description?.slice(0, 100)}...
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={cta}>
        <h3>Are you a journalist?</h3>
        <p>Join NewsTrack and monetise your reporting.</p>
        <Link href="/login" style={primaryButton}>
          Start Publishing
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={footer}>
        © {new Date().getFullYear()} NewsTrack
      </footer>
    </div>
  );
}

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

const logo = {
  fontSize: 28,
  fontWeight: 700
};

const navLink = {
  marginRight: 16,
  textDecoration: "none",
  color: "#333"
};

const navButton = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "1px solid #ddd",
  textDecoration: "none",
  color: "#000"
};

const hero = {
  textAlign: "center",
  marginBottom: 50
};

const heroTitle = {
  fontSize: 32,
  marginBottom: 10
};

const heroText = {
  color: "#666",
  marginBottom: 20
};

const primaryButton = {
  padding: "12px 20px",
  borderRadius: 8,
  background: "#000",
  color: "#fff",
  textDecoration: "none",
  display: "inline-block"
};

const sectionTitle = {
  fontSize: 22,
  marginBottom: 20
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: 20
};

const card = {
  border: "1px solid #eee",
  borderRadius: 12,
  padding: 16,
  background: "#fafafa"
};

const cta = {
  marginTop: 60,
  textAlign: "center",
  padding: 40,
  background: "#f5f5f5",
  borderRadius: 16
};

const footer = {
  marginTop: 60,
  textAlign: "center",
  color: "#777"
};
