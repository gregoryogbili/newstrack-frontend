import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";

import BreakingStrip from "../components/BreakingStrip";
import HeroSplit from "../components/HeroSplit";
import JournalistCallout from "../components/JournalistCallout";
import SiteFooter from "../components/SiteFooter";
import he from "he";
import TopNav from "../components/TopNav";

import OwnershipPanel from "../components/OwnershipPanel";

const API = process.env.NEXT_PUBLIC_API;

function detectNarrative(item) {
  const text = `${item.headline || ""} ${item.summary || ""}`.toLowerCase();

  if (
    text.includes("ukraine") ||
    text.includes("russia") ||
    text.includes("gaza") ||
    text.includes("israel") ||
    text.includes("iran") ||
    text.includes("missile") ||
    text.includes("military") ||
    text.includes("war") ||
    text.includes("conflict")
  ) {
    return "Geopolitical Conflict";
  }

  if (
    text.includes("inflation") ||
    text.includes("interest rate") ||
    text.includes("recession") ||
    text.includes("economy") ||
    text.includes("economic") ||
    text.includes("market") ||
    text.includes("stocks") ||
    text.includes("oil") ||
    text.includes("trade") ||
    text.includes("tariff")
  ) {
    return "Economic Risk";
  }

  if (
    text.includes("ai") ||
    text.includes("artificial intelligence") ||
    text.includes("openai") ||
    text.includes("chip") ||
    text.includes("nvidia") ||
    text.includes("technology") ||
    text.includes("tech") ||
    text.includes("cyber") ||
    text.includes("software")
  ) {
    return "Technology Shift";
  }

  if (
    text.includes("election") ||
    text.includes("government") ||
    text.includes("president") ||
    text.includes("prime minister") ||
    text.includes("parliament") ||
    text.includes("policy") ||
    text.includes("labour") ||
    text.includes("conservative")
  ) {
    return "Political Power";
  }

  if (
    text.includes("storm") ||
    text.includes("flood") ||
    text.includes("earthquake") ||
    text.includes("wildfire") ||
    text.includes("climate") ||
    text.includes("weather")
  ) {
    return "Climate / Disaster";
  }

  return "General Global News";
}

export default function Home() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  async function runSearch() {
    const term = (q || "").trim();
    if (!term) {
      setSearchResults(null);
      return;
    }

    setSearchLoading(true);
    try {
      const res = await fetch(`${API}/search?q=${encodeURIComponent(term)}`);
      const data = await res.json();
      setSearchResults(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      console.error(e);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    fetch(`${API}/feed`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        setFeed(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.warn("Feed timed out — backend waking up, retrying...");
          setTimeout(() => {
            fetch(`${API}/feed`)
              .then((r) => r.json())
              .then((data) => setFeed(Array.isArray(data) ? data : []))
              .finally(() => setLoading(false));
          }, 5000);
        } else {
          setLoading(false);
        }
      })
      .finally(() => clearTimeout(timeout));

    return () => controller.abort();
  }, []);

  const sorted = useMemo(() => {
    const unique = [];
    const seen = new Set();

    for (const item of feed) {
      const key = item.cluster_key || item.headline;

      if (!seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
    }

    const score = (item) => {
      const cluster = item.clusterCount || 1;

      const published = new Date(item.published_at || Date.now());
      const hoursAgo = (Date.now() - published.getTime()) / (1000 * 60 * 60);

      // 🧠 1. Freshness (decays over time)
      const freshness = Math.max(0, 24 - hoursAgo);

      // ⚡ 2. Velocity (fast spread = big signal)
      const velocity = cluster / Math.max(1, hoursAgo);

      // 🏛️ 3. Source credibility boost
      let credibility = 0;

      if (
        item.source_name &&
        ["BBC", "Reuters", "Financial Times", "Bloomberg"].some((s) =>
          item.source_name.includes(s),
        )
      ) {
        credibility += 15;
      }

      if (item.source_name?.includes("Reddit")) {
        credibility -= 10;
      }

      // 🔥 4. Keyword impact (real-world intensity)
      const text = `${item.headline || ""} ${item.summary || ""}`.toLowerCase();

      let impact = 0;

      if (/war|attack|missile|killed|explosion/.test(text)) impact += 25;
      if (/election|government|president/.test(text)) impact += 15;
      if (/economy|inflation|market|stocks/.test(text)) impact += 10;

      // 🎯 FINAL SCORE
      return (
        cluster * 15 + // base signal
        velocity * 20 + // how fast it spreads
        freshness + // how recent
        credibility + // trusted sources
        impact // real-world importance
      );
    };

    const enriched = unique.map((item) => ({
      ...item,
      signalStrength: Math.round(score(item)),
    }));

    return enriched.sort((a, b) => b.signalStrength - a.signalStrength);
  }, [feed]);

  const breakingItems = sorted.slice(0, 10); // top 10
  const heroItems = sorted.slice(10, 16); // next 6
  const redditItems = sorted
    .filter((i) => i.source_name.includes("Reddit"))
    .slice(0, 2);
  const normalTrending = sorted
    .filter((i) => !i.source_name.includes("Reddit"))
    .slice(16, 22);
  const trending = [...normalTrending, ...redditItems];

  const latest = sorted.slice(24, 120);

  const narratives = useMemo(() => {
    const map = {};

    for (const item of sorted.slice(0, 40)) {
      const label = detectNarrative(item);

      if (!map[label]) {
        map[label] = {
          label,
          count: 0,
          totalSignal: 0,
        };
      }

      map[label].count += 1;
      map[label].totalSignal += item.signalStrength || 0;
    }

    return Object.values(map)
      .sort((a, b) => b.totalSignal - a.totalSignal || b.count - a.count)
      .slice(0, 3);
  }, [sorted]);

  return (
    <div style={container}>
      <Head>
        <title>
          NewsTrac – Real-Time Global News, Geopolitics & Economic Risk
          Intelligence
        </title>

        <meta
          name="description"
          content="NewsTrac delivers real-time global news, geopolitical analysis, economic risk signals and AI-powered narrative intelligence across world regions."
        />

        <meta
          name="keywords"
          content="global news, geopolitical risk, economic risk, breaking news, world politics, narrative intelligence, news analytics, AI news platform"
        />

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="canonical" href="https://newstrac.org/" />
      </Head>

      <TopNav
        active="/"
        logoImg={
          <Image
            src="/logo.png"
            alt="NewsTrac Logo"
            width={40}
            height={40}
            priority
          />
        }
      />

      <BreakingStrip items={breakingItems} />

      <div style={{ marginBottom: 34 }}>
        <HeroSplit items={heroItems} loading={loading} />
      </div>

      <div style={searchRow}>
        <input
          style={searchInput}
          placeholder="Search NewsTrac (headlines, topics, places...)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") runSearch();
          }}
        />
        <button style={searchBtn} onClick={runSearch}>
          Search
        </button>
      </div>

      {searchResults && (
        <div style={{ marginTop: 18 }}>
          <div style={searchHeader}>
            Search results for: <b>{q}</b>{" "}
            {searchLoading ? " (loading...)" : ""}
            <button
              style={clearBtn}
              onClick={() => {
                setSearchResults(null);
                setQ("");
              }}
            >
              Clear
            </button>
          </div>

          <div className="newsGrid">
            {searchResults.map((item, index) => (
              <ArticleCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* LATEST */}
      <h2 style={sectionTitle}>Latest News</h2>
      <div className="newsGrid">
        {trending.map((item, index) => (
          <ArticleCard key={item.id} item={item} index={index} />
        ))}
      </div>

      {/* TRENDING */}
      <h2 style={sectionTitle}>Trending</h2>
      <div className="newsGrid">
        {latest.slice(0, 20).map((item, index) => (
          <>
            <ArticleCard key={item.id} item={item} index={index} />
            {index === 7 && <AdCard key="ad-1" />}
          </>
        ))}
      </div>

      <JournalistCallout />

      <div className="newsGrid">
        {latest.slice(20).map((item, index) => (
          <>
            <ArticleCard key={item.id} item={item} index={index} />
            {index === 3 && <AdCard key="ad-2" />}
          </>
        ))}
      </div>

      <SiteFooter />

      <style jsx global>{`
        .newsGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: 1fr;
          gap: 22px;
          margin-bottom: 30px;
          align-items: stretch;
        }

        @media (max-width: 900px) {
          .narrativeResponsive {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 1000px) {
          .newsGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 650px) {
          .newsGrid {
            grid-template-columns: 1fr;
          }
        }

        @keyframes pulse {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

/* ARTICLE CARD */

function ArticleCard({ item, index }) {
  const openFull = () => {
    const url =
      item?.source_url ||
      item?.url ||
      item?.link ||
      item?.sourceUrl ||
      item?.original_url;

    if (!url) {
      alert("Article link not available.");
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const signal = item.signalStrength || 0;
  const cluster = item.clusterCount || 1;

  const published = new Date(item.published_at || Date.now());
  const hoursAgo = (Date.now() - published.getTime()) / (1000 * 60 * 60);

  const velocity = cluster / Math.max(1, hoursAgo);

  let signalState = "NOISE";

  // 🔥 EXPLODING (fast spread)
  if (velocity > 5 && signal > 60) {
    signalState = "EXPLODING";
  }

  // 🔴 BREAKING
  else if (signal >= 80) {
    signalState = "BREAKING";
  }

  // 🟠 RISING
  else if (signal >= 60) {
    signalState = "RISING";
  }

  // ⚪ STABLE
  else if (signal >= 40) {
    signalState = "STABLE";
  }

  // 🔘 EARLY
  else if (signal >= 20) {
    signalState = "EARLY";
  }

  // 📉 COOLING (old but still visible)
  if (hoursAgo > 12 && signal < 50) {
    signalState = "COOLING";
  }

  return (
    <div
      style={{
        ...card,
        position: "relative",
      }}
    >
      <OwnershipPanel
        source={item.source_name}
        sourceUrl={
          item.source_url ||
          item.url ||
          item.link ||
          item.sourceUrl ||
          item.original_url
        }
      />

      <h3 style={cardTitle}>{he.decode(item.headline)}</h3>

      <div
        style={{
          fontSize: "11px",
          fontWeight: "700",
          color: "#c40000",
          marginBottom: "4px",
          textTransform: "uppercase",
          letterSpacing: "0.4px",
        }}
      >
        {detectNarrative(item)}
      </div>

      <div
        style={{
          fontSize: "11px",
          fontWeight: "800",
          marginBottom: "6px",
          color:
            signalState === "EXPLODING"
              ? "#ff0000"
              : signalState === "BREAKING"
                ? "#c40000"
                : signalState === "RISING"
                  ? "#ff8800"
                  : signalState === "STABLE"
                    ? "#999"
                    : signalState === "EARLY"
                      ? "#777"
                      : signalState === "COOLING"
                        ? "#555"
                        : "#bbb",
          animation: signalState === "EXPLODING" ? "pulse 1s infinite" : "none",
        }}
      >
        {signalState}
      </div>

      <div
        style={{
          fontSize: "12px",
          fontWeight: "800",
          marginBottom: "6px",
          color:
            (item.signalStrength || 0) >= 70
              ? "#c40000"
              : (item.signalStrength || 0) >= 40
                ? "#ff8800"
                : "#555",
        }}
      >
        Signal: {item.signalStrength || 0}
      </div>

      <p style={cardSnippet}>
        {item.summary
          ? he.decode(item.summary).slice(0, 130) + "..."
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
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "20px",
  fontFamily: "'Inter', sans-serif",
  position: "relative",
  zIndex: 0,
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
};

const logoWrap = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const logoText = {
  fontSize: 24,
  fontWeight: 800,
  margin: 0,
};

const navButton = {
  padding: "8px 14px",
  border: "1px solid #ccc",
  borderRadius: 8,
  textDecoration: "none",
  color: "#000",
  fontWeight: 600,
};

/* CATEGORY TABS */

const categoryWrap = {
  display: "flex",
  gap: "16px",
  marginTop: 20,
  marginBottom: 30,
  flexWrap: "wrap",
};

const categoryTab = {
  padding: "6px 14px",
  minWidth: "90px",
  textAlign: "center",
  background: "#f3f3f3",
  border: "1px solid #ddd",
  borderRadius: 8,
  textDecoration: "none",
  color: "#111",
  fontWeight: 700,
  transition: "all 0.2s ease",
  cursor: "pointer",
};

const liveTab = {
  padding: "6px 14px",
  minWidth: "90px",
  textAlign: "center",
  background: "#c40000",
  border: "1px solid #a00000",
  borderRadius: 8,
  textDecoration: "none",
  color: "#ffffff",
  fontWeight: 800,
  letterSpacing: 0.5,
};

/* GRID */

const sectionTitle = {
  marginTop: 0,
  marginBottom: 22,
  fontSize: 24,
  fontWeight: 800,
  fontFamily: "'Playfair Display', serif",
  borderLeft: "4px solid #c40000",
  paddingLeft: "10px",
};

const narrativeWrap = {
  marginBottom: 28,
  padding: "18px",
  border: "1px solid #e2d6d6",
  borderRadius: 12,
  background: "linear-gradient(to right, #fff7f7, #ffffff)",
};

const narrativeLead = {
  marginBottom: 16,
};

const narrativeKicker = {
  fontSize: 11,
  fontWeight: 800,
  color: "#c40000",
  letterSpacing: "0.8px",
  marginBottom: 6,
};

const narrativeMain = {
  fontSize: 28,
  fontWeight: 800,
  lineHeight: 1.15,
  color: "#111",
  fontFamily: "'Playfair Display', serif",
  marginBottom: 6,
};

const narrativeSub = {
  fontSize: 13,
  color: "#666",
};

const narrativeGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 14,
};

const narrativeCard = {
  border: "1px solid #ecd0d0",
  borderRadius: 10,
  padding: 14,
  background: "#fff",
};

const narrativeLabel = {
  fontSize: 15,
  fontWeight: 800,
  color: "#111",
  marginBottom: 8,
};

const narrativeMeta = {
  fontSize: 12,
  color: "#666",
  marginBottom: 4,
};

/* CARD */

const card = {
  border: "1px solid #d6d6d6",
  borderRadius: 8,
  padding: 14,
  background: "#f5f5f5",
  minHeight: 160,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  boxSizing: "border-box",
  transform: "scale(1)",
  transition: "all 0.2s ease",
};

const cardTitle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: 20,
  fontWeight: 800,
  marginBottom: 6,
  lineHeight: 1.25,
};

const cardSnippet = {
  fontSize: 14,
  lineHeight: 1.5,
  color: "#444",
  marginBottom: 14,
};

const readMore = {
  border: "none",
  background: "transparent",
  fontWeight: 700,
  cursor: "pointer",
  textAlign: "left",
  padding: 0,
  marginTop: "auto",
};

/* AD */

const adCard = {
  border: "1px dashed #ccc",
  borderRadius: 14,
  padding: 14,
  background: "#f7f7f7",
  minHeight: 210,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  boxSizing: "border-box",
};

const adLabel = {
  fontSize: 12,
  fontWeight: 700,
  color: "#777",
  marginBottom: 10,
};

const adContent = {
  fontSize: 16,
  fontWeight: 600,
  color: "#333",
};

const searchRow = {
  maxWidth: 600,
  margin: "0 0 8px auto",
  padding: "0 18px",
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: 10,
  alignItems: "center",
};

const searchInput = {
  height: 36,
  borderRadius: 8,
  border: "1px solid #d9d9d9",
  padding: "0 14px",
  fontSize: 14,
  outline: "none",
  background: "#fff",
};

const searchBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: 36,
  padding: "0 16px",
  borderRadius: 8,
  border: "1px solid #cfcfcf",
  background: "#fff",
  color: "#111",
  fontWeight: 800,
  fontSize: 14,
  fontFamily: "'Inter', sans-serif", // 🔴 IMPORTANT
  lineHeight: "1", // 🔴 prevents vertical shift
  letterSpacing: "0", // 🔴 prevents subtle difference
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const searchHeader = {
  maxWidth: 1180,
  margin: "0 auto",
  padding: "0 18px",
  display: "flex",
  gap: 10,
  alignItems: "center",
  color: "#111",
};

const clearBtn = {
  marginLeft: "auto",
  height: 34,
  padding: "0 12px",
  borderRadius: 8,
  border: "1px solid #d9d9d9",
  background: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};
