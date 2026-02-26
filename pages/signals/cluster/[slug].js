import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ClusterDetail() {
  const router = useRouter();
  const { slug } = router.query;

  const [cluster, setCluster] = useState(null);

  useEffect(() => {
    if (!slug) return;

    fetch(`${process.env.NEXT_PUBLIC_API}/clusters/${slug}`)
      .then((res) => res.json())
      .then((data) => setCluster(data))
      .catch((err) => console.error("Cluster fetch failed:", err));
  }, [slug]);

  if (!cluster) return <div style={{ padding: 40 }}>Loading...</div>;

  const title = cluster.title;

  return (
    <>
      <Head>
        <title>{title} • NewsTrac Intelligence</title>
      </Head>

      <div style={page}>
        <div style={topBar}>
          <Link href="/signals" style={backLink}>
            ← Back to Signals
          </Link>
        </div>

        <div style={header}>
          <div style={kicker}>STORY CLUSTER</div>
          <h1 style={titleStyle}>{title}</h1>
          {cluster.primaryRegion && (
            <div
              style={{
                marginTop: 10,
                display: "inline-block",
                padding: "4px 10px",
                fontSize: 11,
                letterSpacing: 0.6,
                borderRadius: 6,
                background: "#1e293b",
                color: "#60a5fa",
                textTransform: "uppercase",
              }}
            >
              {cluster.primaryRegion}
            </div>
          )}
          <div style={sub}>
            Aggregated cluster intelligence and cross-source coverage.
          </div>
        </div>

        <div style={panel}>
          <div style={panelTitle}>Cluster Intelligence</div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 20,
              marginTop: 16,
            }}
          >
            <div>
              <div style={label}>Velocity (6h)</div>
              <div style={value}>{cluster.recent}</div>
            </div>

            <div>
              <div style={label}>Baseline</div>
              <div style={value}>{cluster.previous}</div>
            </div>

            <div>
              <div style={label}>Acceleration</div>
              <div style={value}>{cluster.ratio}x</div>
            </div>

            <div>
              <div style={label}>Signal Strength</div>
              <div style={value}>{Math.round(cluster.signalStrength)}</div>
            </div>

            <div>
              <div style={label}>Sources</div>
              <div style={value}>{cluster.sourceCount}</div>
            </div>

            <div>
              <div style={label}>Diversity</div>
              <div style={value}>{cluster.sourceDiversity}%</div>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <span
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.5,
                background:
                  cluster.momentum === "accelerating"
                    ? "#7f1d1d"
                    : cluster.momentum === "rising"
                      ? "#14532d"
                      : cluster.momentum === "falling"
                        ? "#3f1d1d"
                        : "#1e3a8a",
                color: "#fff",
              }}
            >
              {cluster.momentum.toUpperCase()}
            </span>

            <div style={{ marginTop: 20 }}>
              <div style={label}>Misinformation Risk</div>
              <div
                style={{
                  ...value,
                  fontWeight: 700,
                  color:
                    cluster.misinfoRisk <= 30
                      ? "#4ade80"
                      : cluster.misinfoRisk <= 60
                        ? "#facc15"
                        : "#ef4444",
                }}
              >
                {cluster.misinfoRisk}/100
              </div>

              {cluster.misinfoFlags?.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  {cluster.misinfoFlags.map((flag, i) => (
                    <div key={i} style={muted}>
                      • {flag}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={panel}>
          <div style={panelTitle}>Articles</div>

          {cluster.articles.map((article) => (
            <div key={article.id} style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#e6edf3" }}
                >
                  {article.headline}
                </a>
              </div>

              <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
                {article.source} • {formatTime(article.published_at)}
              </div>

              {article.summary && (
                <div style={{ fontSize: 13, opacity: 0.75, marginTop: 6 }}>
                  {article.summary}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* =========================== STYLES =========================== */

const page = {
  backgroundColor: "#0b1117",
  minHeight: "100vh",
  color: "#e6edf3",
  fontFamily: "Inter, system-ui, sans-serif",
  padding: "36px 30px",
  maxWidth: "1200px",
  margin: "0 auto",
};

const topBar = { marginBottom: 18 };

const backLink = {
  color: "#60a5fa",
  textDecoration: "none",
  fontSize: 13,
  letterSpacing: 0.2,
};

const header = { marginBottom: 26 };

const kicker = {
  fontSize: 12,
  letterSpacing: 2,
  color: "#4ea1ff",
  marginBottom: 10,
};

const titleStyle = {
  fontSize: 28,
  fontWeight: 600,
  letterSpacing: 0.4,
  margin: 0,
};

const sub = {
  marginTop: 8,
  fontSize: 13,
  color: "rgba(255,255,255,0.55)",
  maxWidth: 720,
};

const panel = {
  backgroundColor: "#111827",
  padding: 20,
  borderRadius: 10,
  boxShadow: "0 0 20px rgba(0,0,0,0.35)",
  marginBottom: 18,
};

const panelTitle = {
  fontSize: 13,
  textTransform: "uppercase",
  letterSpacing: 1,
  color: "#60a5fa",
  marginBottom: 14,
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 0",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
};

const rowLast = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 0",
};

function formatTime(dateString) {
  if (!dateString) return "--";
  const diff = (Date.now() - new Date(dateString)) / 1000;
  const hours = Math.floor(diff / 3600);
  if (hours < 1) return "Just now";
  if (hours === 1) return "1 hour ago";
  return `${hours} hours ago`;
}

const label = { fontSize: 13, color: "rgba(255,255,255,0.6)" };
const value = { fontSize: 13, color: "#e6edf3" };
const muted = { fontSize: 13, color: "rgba(255,255,255,0.55)" };
