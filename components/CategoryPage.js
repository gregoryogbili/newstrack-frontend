import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SiteFooter from "./SiteFooter";

const API = process.env.NEXT_PUBLIC_API;

const FALLBACK = (key) => `/banners/${key}.jpg`;

function openExternal(item) {
  const url = item?.source_url;
  if (url) window.open(url, "_blank", "noopener,noreferrer");
}

export default function CategoryPage({ categoryKey, title, subtitle }) {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    fetch(`${API}/feed?category=${categoryKey}`)
      .then((r) => r.json())
      .then((d) => setFeed(Array.isArray(d) ? d : []))
      .catch(() => setFeed([]));
  }, []);

  const items = useMemo(() => {
    return (feed || []).slice(0, 40);
  }, [feed]);


  const featured = items[0];
  const rest = items.slice(1, 9);

  return (
    <div style={container}>
      <Head>
        <title>{title} — NewsTrac</title>
        <link rel="preload" as="image" href={FALLBACK(categoryKey)} />
      </Head>

      <header style={top}>
        <Link href="/" style={back}>← Back to Home</Link>
        <div style={brand}>NewsTrac</div>
      </header>

      {/* compact editorial header (NOT full width banner) */}
      <div style={headerTab}>
        <div style={headerTitle}>{title}</div>
        <div style={headerSub}>{subtitle}</div>
      </div>

      {/* Featured */}
      {featured && (
        <div style={featuredWrap} onClick={() => openExternal(featured)} role="button" tabIndex={0}>
          <div style={featuredImg}>
            <Image
              src={FALLBACK(categoryKey)}
              alt={`${title} banner`}
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          <div style={featuredText}>
            <h2 style={featuredH}>{featured.headline}</h2>
            <p style={featuredP}>
              {(featured.summary || "").slice(0, 220)}
              {(featured.summary || "").length > 220 ? "…" : ""}
            </p>
            <div style={readMore}>Read Full Article →</div>
          </div>
        </div>
      )}

      {/* 4-column grid like before. Only featured has image. */}
      <div style={grid}>
        {rest.map((x) => (
          <article key={x.id} style={card} onClick={() => openExternal(x)} role="button" tabIndex={0}>
            <h3 style={h}>{x.headline}</h3>
            <p style={p}>
              {(x.summary || "").slice(0, 140)}
              {(x.summary || "").length > 140 ? "…" : ""}
            </p>
            <div style={readMoreSmall}>Read Full Article →</div>
          </article>
        ))}
      </div>

      <SiteFooter />
    </div>
  );
}

const container = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "20px"
};

const top = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16
};

const back = {
  textDecoration: "none",
  color: "#111",
  fontWeight: 800
};

const brand = {
  fontWeight: 900,
  letterSpacing: 0.4
};

const headerTab = {
  border: "1px solid #eee",
  borderRadius: 14,
  padding: "16px 16px",
  background: "#fff",
  marginBottom: 16,
  width: "fit-content",
  minWidth: 420
};

const headerTitle = {
  fontSize: 22,
  fontWeight: 900,
  marginBottom: 4
};

const headerSub = {
  color: "#555",
  fontWeight: 700
};

const featuredWrap = {
  display: "grid",
  gridTemplateColumns: "1.1fr 1fr",
  gap: 16,
  border: "1px solid #eee",
  borderRadius: 16,
  overflow: "hidden",
  background: "#fbfbfb",
  cursor: "pointer",
  marginBottom: 18
};

const featuredImg = {
  position: "relative",
  minHeight: 220
};

const featuredText = {
  padding: 18,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between"
};

const featuredH = {
  margin: 0,
  fontSize: 22,
  fontWeight: 900,
  lineHeight: 1.2
};

const featuredP = {
  color: "#444",
  lineHeight: 1.6,
  marginTop: 12
};

const readMore = {
  marginTop: 12,
  fontWeight: 900
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 18,
  marginBottom: 28
};

const card = {
  border: "1px solid #eee",
  borderRadius: 14,
  padding: 18,
  background: "#fff",
  cursor: "pointer",
  minHeight: 170,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between"
};

const h = {
  margin: 0,
  fontSize: 16,
  fontWeight: 900,
  lineHeight: 1.25
};

const p = {
  marginTop: 10,
  color: "#555",
  lineHeight: 1.6,
  fontSize: 13
};

const readMoreSmall = {
  fontWeight: 900,
  marginTop: 12
};
