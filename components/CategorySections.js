import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const API = process.env.NEXT_PUBLIC_API;

const CATS = [
  { key: "world", label: "WORLD", href: "/world" },
  { key: "politics", label: "POLITICS", href: "/politics" },
  { key: "economy", label: "ECONOMY", href: "/economy" },
  { key: "technology", label: "TECHNOLOGY", href: "/technology" },
  { key: "live", label: "LIVE NEWS", href: "/live", live: true }
];

function openExternal(item) {
  const url = item?.source_url;
  if (url) window.open(url, "_blank", "noopener,noreferrer");
}

export default function CategorySections({ items }) {
  const [active, setActive] = useState("world");
  const [trending, setTrending] = useState([]);

  /* ✅ Only fetch trending here (NOT feed) */
  useEffect(() => {
    fetch(`${API}/posts/trending`)
      .then((r) => r.json())
      .then((d) => setTrending(Array.isArray(d) ? d : []))
      .catch(() => setTrending([]));
  }, []);

  /* ✅ Use homepage-provided items (NO feed refetch) */
  const tabItems = useMemo(() => {
    const list = (items || []).filter(
      (x) => (x.category || "").toLowerCase() === active
    );
    return list.slice(0, 8);
  }, [items, active]);

  const activeTabMeta = CATS.find((c) => c.key === active);

  return (
    <section style={wrap}>
      {/* ---------------- Tabs ---------------- */}
      <div style={tabHeader}>
        <div style={tabs}>
          {CATS.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActive(cat.key)}
              style={{
                ...tabButton,
                ...(active === cat.key ? tabActive : {}),
                ...(cat.live ? tabLive : {})
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <Link href={activeTabMeta?.href || "/world"} style={seeMore}>
          See more →
        </Link>
      </div>

      {/* ---------------- Category Grid ---------------- */}
      <div style={grid}>
        {tabItems.map((item, i) => {
          const isFeatured = i === 0;
          return (
            <article
              key={item.id}
              style={{ ...card, ...(isFeatured ? featured : {}) }}
              onClick={() => openExternal(item)}
              role="button"
              tabIndex={0}
            >
              <h3 style={headline}>{item.headline}</h3>

              <p style={snippet}>
                {(item.summary || "").slice(0, isFeatured ? 160 : 110)}
                {(item.summary || "").length > (isFeatured ? 160 : 110)
                  ? "…"
                  : ""}
              </p>

              <div style={readMore}>Read Full Article →</div>
            </article>
          );
        })}
      </div>

      {/* ---------------- Trending ---------------- */}
      <div style={trendHeader}>
        <div style={trendTitle}>Trending</div>
        <div style={trendNote}>Most read + freshest</div>
      </div>

      <div style={trendGrid}>
        {trending.slice(0, 8).map((p) => (
          <Link key={p.id} href={`/article/${p.id}`} style={trendCard}>
            <div style={trendH}>{p.headline}</div>
            <div style={readMoreSmall}>Read Full Article →</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ============================= */
/* STYLES */
/* ============================= */

const wrap = { marginTop: 10 };

const tabHeader = {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between",
  gap: 12,
  margin: "18px 0 12px"
};

const tabs = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap"
};

const tabButton = {
  background: "none",
  border: "1px solid #eee",
  padding: "10px 12px",
  cursor: "pointer",
  fontWeight: 800,
  borderRadius: 999,
  letterSpacing: 0.2
};

const tabActive = {
  borderColor: "#111",
  background: "#111",
  color: "#fff"
};

const tabLive = {
  borderColor: "#f0c1c1",
  color: "#c40000"
};

const seeMore = {
  textDecoration: "none",
  fontWeight: 800,
  color: "#111"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 18
};

const card = {
  border: "1px solid #eee",
  borderRadius: 14,
  padding: 18,
  background: "#fff",
  cursor: "pointer",
  minHeight: 150,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between"
};

const featured = {
  gridColumn: "span 2",
  minHeight: 190,
  background: "#fbfbfb"
};

const headline = {
  fontSize: 16,
  fontWeight: 900,
  lineHeight: 1.25,
  margin: 0
};

const snippet = {
  color: "#555",
  lineHeight: 1.5,
  marginTop: 10,
  marginBottom: 14,
  fontSize: 13
};

const readMore = {
  fontWeight: 900,
  color: "#111"
};

const trendHeader = {
  marginTop: 24,
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between"
};

const trendTitle = {
  fontSize: 22,
  fontWeight: 900
};

const trendNote = {
  color: "#666",
  fontSize: 13,
  fontWeight: 700
};

const trendGrid = {
  marginTop: 12,
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 18
};

const trendCard = {
  border: "1px solid #eee",
  borderRadius: 14,
  padding: 18,
  background: "#fafafa",
  textDecoration: "none",
  color: "#111"
};

const trendH = {
  fontSize: 15,
  fontWeight: 900,
  lineHeight: 1.25,
  marginBottom: 12
};

const readMoreSmall = {
  fontWeight: 900,
  color: "#111"
};
