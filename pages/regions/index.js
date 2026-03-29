import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Head from "next/head";
import TopNav from "../../components/TopNav";
import he from "he";

const API = process.env.NEXT_PUBLIC_API;

export default function Regions() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/regions`)
      .then((res) => res.json())
      .then((data) => {
        setRegions(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={container}>
      <Head>
        <title>Global Regions | NewsTrac</title>
      </Head>

      <TopNav
        active="/regions"
        logoImg={
          <Image src="/logo.png" alt="NewsTrac Logo" width={34} height={34} />
        }
      />

      {regions.map((region) => (
        <RegionBlock key={region.region} regionData={region} />
      ))}
    </div>
  );
}

/* ---------------- REGION BLOCK ---------------- */

function RegionBlock({ regionData }) {
  const { region, clusters, momentum, narrativeStructure } = regionData;

  const [stage, setStage] = useState(1);

  // Flatten clusters into article flow (high scoring first)
  const sortedClusters = [...clusters].sort(
    (a, b) => (b.signalStrength || 0) - (a.signalStrength || 0),
  );

  // Top intelligence clusters (first few)
  const topClusters = sortedClusters.slice(0, 3);

  // Remaining clusters
  const remainingClusters = sortedClusters.slice(3);

  // Flatten in stages
  const stageOneArticles = topClusters.flatMap((c) => c.articles);
  const stageTwoArticles = [
    ...topClusters.flatMap((c) => c.articles),
    ...remainingClusters.flatMap((c) => c.articles.slice(0, 2)),
  ];

  const fullArticles = sortedClusters
    .flatMap((c) => c.articles)
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  let visible;

  if (stage === 1) {
    visible = fullArticles.slice(0, 4);
  } else if (stage === 2) {
    visible = stageTwoArticles.slice(0, 12);
  } else {
    visible = fullArticles;
  }

  return (
    <div style={{ marginBottom: 18 }}>
      <h2 style={sectionTitle}>
        {region === "Other" ? "Global / Unclassified" : region}
      </h2>
      <div style={regionSub}>
        {region === "Other"
          ? "Stories without specific regional focus"
          : "Dominant Regional Signals"}
      </div>

      <div style={regionMeta}>
        Momentum: {momentum} · Narrative Structure: {narrativeStructure} ·
        {clusters.length} Active Clusters · {fullArticles.length} Articles
      </div>

      <div className="newsGrid">
        {visible.map((item, index) => (
          <ArticleCard key={item.id} item={item} />
        ))}

        <style jsx global>{`
          .newsGrid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 22px;
            margin-bottom: 12px;
            align-items: stretch;
          }

          @media (max-width: 1000px) {
            .newsGrid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (max-width: 650px) {
            .newsGrid {
              grid-template-columns: 1fr;
              gap: 16px;
            }
          }
        `}</style>
      </div>

      <div style={{ textAlign: "center", marginTop: 10, marginBottom: 20 }}>
        {stage < 3 && (
          <button style={expandBtn} onClick={() => setStage(stage + 1)}>
            {stage === 1 ? "Expand Signal Field" : "View Full Regional Dump"}
          </button>
        )}

        {stage > 1 && (
          <button
            style={{ ...expandBtn, marginLeft: 10 }}
            onClick={() => setStage(1)}
          >
            Collapse
          </button>
        )}
      </div>
      <div style={regionDivider}></div>
    </div>
  );
}

/* ---------------- ARTICLE CARD (same as landing) ---------------- */

function ArticleCard({ item }) {
  const openFull = () => {
    const url = item?.source_url || item?.url;
    if (url) window.open(url, "_blank");
  };

  return (
    <div style={card}>
      <h3 style={cardTitle}>{he.decode(item.headline)}</h3>
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

/* ---------------- SIMPLE ANALYTICS ---------------- */

function calcMomentum(items) {
  const avgScore =
    items.reduce((sum, i) => sum + (i.score || 0), 0) / items.length;

  if (avgScore > 70) return "Rising";
  if (avgScore > 40) return "Active";
  return "Calm";
}

/* ---------------- STYLES (reuse landing style) ---------------- */

const container = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "20px",
  fontFamily: "'Inter', sans-serif",
  boxSizing: "border-box",
  width: "100%",
};

const sectionTitle = {
  marginTop: 0,
  marginBottom: 6,
  fontSize: 26,
  fontWeight: 800,
  fontFamily: "'Playfair Display', serif",
  letterSpacing: 0.5,
  borderLeft: "4px solid #c40000",
  paddingLeft: "10px",
};

const regionMeta = {
  fontSize: 11,
  opacity: 0.6,
  marginBottom: 22,
};

const regionSub = {
  fontSize: 11,
  letterSpacing: 1,
  textTransform: "uppercase",
  opacity: 0.5,
  marginBottom: 6,
};

const expandBtn = {
  padding: "10px 18px",
  borderRadius: 8,
  border: "1px solid #ccc",
  background: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const regionDivider = {
  height: 1,
  background: "#e5e5e5",
  marginTop: 10,
};

const card = {
  border: "1px solid #d6d6d6",
  borderRadius: 8,
  padding: 14,
  background: "#f5f5f5",
  minHeight: 210,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  boxSizing: "border-box",
};

const cardTitle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: 18,
  fontWeight: 700,
  marginBottom: 8,
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

const clusterDivider = {
  gridColumn: "1 / -1",
  marginTop: 20,
  marginBottom: 10,
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: 1,
  opacity: 0.5,
};
