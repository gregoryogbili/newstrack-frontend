import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE;

export default function Home() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeed() {
      try {
        const res = await fetch(`${API}/feed`);
        const data = await res.json();
        setFeed(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch (err) {
        console.log("Feed error");
      } finally {
        setLoading(false);
      }
    }

    if (API) loadFeed();
  }, []);

  return (
    <div style={container}>
      {/* HEADER */}
      <header style={header}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Image src="/logo.png" alt="Geno Logo" width={40} height={40} />
          <h1 style={logo}>NewsTrack</h1>
        </div>

        <nav style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/feed" style={navLink}>Feed</Link>
          <Link href="/login" style={navButton}>Login</Link>
        </nav>
      </header>

      {/* HERO */}
      <section style={hero}>
        <h2 style={heroTitle}>
          Independent Journalism. Transparent Revenue.
        </h2>
        <p style={heroText}>
          NewsTrack empowers journalists with fair revenue sharing and real audience engagement.
        </p>
        <Link href="/feed" style={primaryButton}>
          View Latest News
        </Link>
      </section>

      {/* LATEST STORIES */}
      <section>
        <h3 style={sectionTitle}>Latest Stories</h3>

        {loading && <p>Loading latest stories...</p>}

        {!loading && feed.length === 0 && (
          <p style={{ color: "#777" }}>
            No stories available yet.
          </p>
        )}

        <div style={grid}>
          {feed.map(post => (
            <div key={post.id} style={card}>
              <h4 style={{ marginBottom: 8 }}>{post.headline}</h4>
              <p style={{ color: "#666", fontSize: 14 }}>
                {post.summary?.slice(0, 120)}...
              </p>
              <div style={{ marginTop: 10, fontSize: 12, color: "#999" }}>
                {post.source_name}
              </div>
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
  padding: 24
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 60
};

const logo = {
  fontSize: 24,
  fontWeight: 700
};

const navLink = {
  textDecoration: "none",
  color: "#333"
};

const navButton = {
  padding: "8px 16px",
  borderRadius: 8,
  border: "1px solid #ddd",
  textDecoration: "none",
  color: "#000"
};

const hero = {
  textAlign: "center",
  marginBottom: 70
};

const heroTitle = {
  fontSize: 36,
  marginBottom: 12
};

const heroText = {
  color: "#666",
  marginBottom: 24,
  fontSize: 18
};

const primaryButton = {
  padding: "14px 24px",
  borderRadius: 10,
  background: "#000",
  color: "#fff",
  textDecoration: "none",
  display: "inline-block"
};

const sectionTitle = {
  fontSize: 24,
  marginBottom: 24
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: 24
};

const card = {
  border: "1px solid #eee",
  borderRadius: 14,
  padding: 18,
  background: "#fafafa",
  transition: "0.2s ease"
};

const cta = {
  marginTop: 80,
  textAlign: "center",
  padding: 50,
  background: "#f5f5f5",
  borderRadius: 18
};

const footer = {
  marginTop: 80,
  textAlign: "center",
  color: "#777"
};
