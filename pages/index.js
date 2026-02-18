import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";

import BreakingStrip from "../components/BreakingStrip";
import HeroSplit from "../components/HeroSplit";
import JournalistCallout from "../components/JournalistCallout";
import SiteFooter from "../components/SiteFooter";

const API = process.env.NEXT_PUBLIC_API;

export default function Home() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/feed`)
      .then((res) => res.json())
      .then((data) => {
        setFeed(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const sorted = useMemo(() => {
    return [...feed].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [feed]);

  const trending = sorted.slice(0, 4);
  const latest = sorted.slice(4, 24);
  const heroItems = sorted.slice(0, 6);
  const breakingItems = sorted.slice(0, 10);

  return (
    <div style={container}>
      <Head />

      {/* HEADER */}
      <header style={header}>
        <div style={logoWrap}>
          <Image src="/logo.png" alt="NewsTrac Logo" width={40} height={40} priority />
          <h1 style={logoText}>NewsTrac</h1>
        </div>

        <Link href="/login" style={navButton}>Login</Link>
      </header>

      <BreakingStrip items={breakingItems} />
      <HeroSplit items={heroItems} loading={loading} />

      {/* CATEGORY TABS (UNDER HERO) */}
      <div style={categoryWrap}>
        <Link href="/world" style={categoryTab}>World</Link>
        <Link href="/politics" style={categoryTab}>Politics</Link>
        <Link href="/economy" style={categoryTab}>Economy</Link>
        <Link href="/technology" style={categoryTab}>Technology</Link>
        <Link href="/live" style={liveTab}>LIVE</Link>
      </div>

      {/* TRENDING */}
      <h2 style={sectionTitle}>Trending</h2>
      <div style={grid}>
        {trending.map((item) => (
          <ArticleCard key={item.id} item={item} />
        ))}
      </div>

      {/* LATEST */}
      <h2 style={sectionTitle}>Latest News</h2>
      <div style={grid}>
        {latest.slice(0, 12).map((item, index) => (
          <>
            <ArticleCard key={item.id} item={item} />
            {(index === 7) && <AdCard key="ad-1" />}
          </>
        ))}
      </div>

      <JournalistCallout />

      <div style={grid}>
        {latest.slice(12).map((item, index) => (
          <>
            <ArticleCard key={item.id} item={item} />
            {(index === 3) && <AdCard key="ad-2" />}
          </>
        ))}
      </div>

      <SiteFooter />

      <style jsx global>{`
        @media (max-width: 1000px) {
          .grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

/* ARTICLE CARD */
function ArticleCard({ item }) {
  const openFull = () => {
    const url = item?.source_url || item?.url;
    if (url) window.open(url, "_blank");
  };

  return (
    <div style={card}>
      <h3 style={cardTitle}>{item.headline}</h3>
      <p style={cardSnippet}>
        {item.summary
          ? item.summary.slice(0, 170) + "..."
          : "Click to read the full article."}
      </p>
      <button style={readMore} onClick={openFull}>
        Read Full Article →
      </button>
    </div>
  );
}

/* AD CARD */
function AdCard() {
  return (
    <div style={adCard}>
      <div style={adLabel}>Sponsored</div>
      <div style={adContent}>Ad Space</div>
    </div>
  );
}

/* STYLES */

const container = {
  maxWidth: "1150px",
  margin: "0 auto",
  padding: "20px"
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
  fontWeight: 800,
  margin: 0
};

const navButton = {
  padding: "8px 14px",
  border: "1px solid #ccc",
  borderRadius: 8,
  textDecoration: "none",
  color: "#000",
  fontWeight: 600
};

/* CATEGORY TABS */

const categoryWrap = {
  display: "flex",
  gap: "16px",
  marginTop: 20,
  marginBottom: 30,
  flexWrap: "wrap"
};

const categoryTab = {
  padding: "10px 18px",
  background: "#ededed",
  border: "1px solid #d6d6d6",
  borderRadius: 30,
  textDecoration: "none",
  color: "#333",
  fontWeight: 600
};

const liveTab = {
  padding: "10px 18px",
  background: "#fff0f0",
  border: "1px solid #ffb3b3",
  borderRadius: 30,
  textDecoration: "none",
  color: "#c40000",
  fontWeight: 700
};

/* GRID */

const sectionTitle = {
  marginTop: 30,
  marginBottom: 20,
  fontSize: 22,
  fontWeight: 800
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 24,
  marginBottom: 30
};

/* CARD */

const card = {
  border: "1px solid #d6d6d6",
  borderRadius: 14,
  padding: 14,
  background: "#ededed",
  minHeight: 210,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between"
};

const cardTitle = {
  fontSize: 18,
  fontWeight: 800,
  marginBottom: 8
};

const cardSnippet = {
  fontSize: 14,
  lineHeight: 1.5,
  color: "#444",
  marginBottom: 14
};

const readMore = {
  border: "none",
  background: "transparent",
  fontWeight: 700,
  cursor: "pointer",
  textAlign: "left",
  padding: 0
};

/* AD */

const adCard = {
  border: "1px dashed #ccc",
  borderRadius: 14,
  padding: 18,
  background: "#f7f7f7",
  minHeight: 260,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center"
};

const adLabel = {
  fontSize: 12,
  fontWeight: 700,
  color: "#777",
  marginBottom: 10
};

const adContent = {
  fontSize: 16,
  fontWeight: 600,
  color: "#333"
};
