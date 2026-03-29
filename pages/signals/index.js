import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import TopNav from "../../components/TopNav";
import Image from "next/image";
import dynamic from "next/dynamic";

const GlobalHeatMap = dynamic(() => import("../../components/GlobalHeatMap"), {
  ssr: false,
});

const RegionIntelligencePanel = dynamic(
  () => import("../../components/RegionIntelligencePanel"),
  { ssr: false },
);

const API = process.env.NEXT_PUBLIC_API;

export default function SignalsDashboard() {
  const [showNPIBreakdown, setShowNPIBreakdown] = useState(false);

  const [clusters, setClusters] = useState([]);
  const [overview, setOverview] = useState(null);
  const [windowParam, setWindowParam] = useState("6h");

  const [tooltip, setTooltip] = useState(null);

  const [selectedRegion, setSelectedRegion] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const acceleratingClusters = Array.isArray(clusters)
    ? clusters
        .filter((c) => c.momentum === "accelerating")
        .sort((a, b) => b.signalStrength - a.signalStrength)
        .slice(0, 4)
    : [];

  useEffect(() => {
    fetch(`${API}/clusters`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setClusters(data);
        } else {
          console.error("Clusters API did not return array:", data);
          setClusters([]);
        }
      })
      .catch((err) => console.error("Cluster fetch failed:", err));
  }, []);

  useEffect(() => {
    fetch(`${API}/signals/overview?window=${windowParam}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("OVERVIEW DATA:", data);
        console.log("BREAKDOWN:", data.narrativeBreakdown);

        setOverview(data);
      })
      .catch((err) => console.error("Overview fetch failed:", err));
  }, [windowParam]);

  const getTrendDisplay = (trend) => {
    switch (trend) {
      case "accelerating":
        return { symbol: "⇈", label: "Accelerating", style: acceleratingTrend };
      case "rising":
        return { symbol: "↑", label: "Rising", style: risingTrend };
      case "emerging":
        return { symbol: "↗", label: "Emerging", style: emergingTrend };
      case "stable":
        return { symbol: "→", label: "Stable", style: stableTrend };
      case "cooling":
        return { symbol: "↘", label: "Cooling", style: coolingTrend };
      case "falling":
        return { symbol: "↓", label: "Falling", style: fallingTrend };
      default:
        return { symbol: "•", label: trend, style: stableTrend };
    }
  };

  return (
    <>
      <Head>
        <title>
          NewsTrac Analytics – Geopolitical Pressure & Economic Risk Dashboard
        </title>

        <meta
          name="description"
          content="Monitor global narrative pressure, geopolitical risk, acceleration trends and economic instability in real time using NewsTrac Analytics."
        />

        <link rel="canonical" href="https://newstrac.org/signals" />
      </Head>

      <TopNav
        active="/signals"
        logoImg={
          <Image src="/logo.png" alt="NewsTrac Logo" width={34} height={34} />
        }
      />

      <div style={page} className="pageTight">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 12,
            gap: 8,
          }}
        >
          {["6h", "24h", "72h"].map((w) => (
            <button
              key={w}
              onClick={() => setWindowParam(w)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border:
                  windowParam === w ? "1px solid #60a5fa" : "1px solid #334155",
                background: windowParam === w ? "#1e293b" : "#0f172a",
                color: "#e6edf3",
                fontSize: 12,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {w.toUpperCase()}
            </button>
          ))}
        </div>
        {overview?.narrativeSummary && (
          <div
            style={{
              marginTop: 20,
              padding: 20,
              background: "#0f172a",
              borderRadius: 8,
              fontSize: 15,
              lineHeight: 1.6,
              color: "#f59e0b",
              borderLeft: "3px solid #f59e0b",
              fontWeight: 700,
            }}
          >
            {overview.narrativeSummary}
          </div>
        )}

        <div style={grid}>
          <div style={panelLarge}>
            <div style={panelTitle}>Global Narrative Heat Map</div>

            {!overview?.regionalSpread?.length ? (
              <div style={placeholder}>No regional signal data yet.</div>
            ) : (
              <div style={{ marginTop: 10 }}>
                <div style={{ height: 420, marginTop: 10, width: "100%" }}>
                  <GlobalHeatMap
                    data={
                      overview.regionalSpread
                        ?.sort((a, b) => b.count - a.count)
                        ?.slice(0, 3) || []
                    }
                  />
                </div>
              </div>
            )}
          </div>

          {/* ===== ACCELERATION BAND ===== */}
          <div style={rowBand} className="rowBand">
            <div style={{ ...panel, gridColumn: "span 3" }}>
              <div
                style={{ ...panelTitle, cursor: "help" }}
                onMouseEnter={() =>
                  setTooltip(
                    "Measures acceleration in narrative volume relative to baseline clusters.",
                  )
                }
                onMouseLeave={() => setTooltip(null)}
              >
                Signal Velocity Index ⓘ
              </div>
              <div style={metric}>
                {overview ? overview.velocityIndex : "--"}
              </div>
              {overview?.delta?.velocity !== null &&
                overview?.delta?.velocity !== undefined && (
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      marginTop: 4,
                      color:
                        overview.delta.velocity > 0 ? "#ef4444" : "#22c55e",
                    }}
                  >
                    {overview.delta.velocity > 0 ? "▲" : "▼"}{" "}
                    {Math.abs(overview.delta.velocity)}% vs yesterday
                  </div>
                )}
              <div style={metricLabel}>Change in global narrative activity</div>
              <div style={{ ...metricLabel, fontSize: 11, opacity: 0.6 }}>
                (0–100 scale, {windowParam} window)
              </div>
            </div>

            <div style={{ ...panel, gridColumn: "span 3" }}>
              <div
                style={{ ...panelTitle, cursor: "help" }}
                onMouseEnter={() =>
                  setTooltip(
                    "Blended pressure score combining volume, acceleration density, and geographic dispersion.",
                  )
                }
                onMouseLeave={() => setTooltip(null)}
              >
                Narrative Pressure Index ⓘ
              </div>

              <div style={metric}>{overview ? overview.npi : "--"}</div>

              <div
                style={{
                  fontSize: 11,
                  marginTop: 6,
                  cursor: "pointer",
                  color: "#60a5fa",
                }}
                onClick={() => setShowNPIBreakdown(!showNPIBreakdown)}
              >
                {showNPIBreakdown ? "Hide Drivers ↑" : "View Drivers →"}
              </div>

              <div style={metricLabel}>Structural narrative pressure</div>

              <div style={{ ...metricLabel, fontSize: 11, opacity: 0.6 }}>
                (0–100 scale, {windowParam} window)
              </div>

              {showNPIBreakdown &&
                Array.isArray(overview?.narrativeBreakdown) &&
                overview.narrativeBreakdown.length > 0 &&
                (() => {
                  const total = overview.narrativeBreakdown.reduce(
                    (sum, n) => sum + (n.score || 0),
                    0,
                  );

                  return (
                    <div
                      style={{
                        marginTop: 12,
                        padding: 14,
                        borderRadius: 10,
                        background: "#020617",
                        border: "1px solid rgba(56,189,248,0.25)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          marginBottom: 10,
                          color: "#60a5fa",
                          letterSpacing: 1,
                        }}
                      >
                        Narrative Drivers
                      </div>

                      {overview.narrativeBreakdown.map((n, i) => {
                        const percent = total > 0 ? (n.score / total) * 100 : 0;

                        return (
                          <div key={i} style={{ marginBottom: 10 }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: 10,
                                letterSpacing: "0.3px",
                                marginBottom: 4,
                                color: "#cbd5f5",
                                fontWeight: 500,
                              }}
                            >
                              <span>{n.label}</span>
                              <span
                                style={{ color: "#60a5fa", fontWeight: 600 }}
                              >
                                {Math.round(n.score)} ({Math.round(percent)}%)
                              </span>
                            </div>

                            <div
                              style={{
                                height: 6,
                                background: "#1e293b",
                                borderRadius: 4,
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  width: `${percent}%`,
                                  height: "100%",
                                  background:
                                    "linear-gradient(90deg, #60a5fa, #38bdf8)",
                                  boxShadow: "0 0 8px rgba(56,189,248,0.6)",
                                  transition: "width 0.4s ease",
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
            </div>

            <div style={{ ...panel, gridColumn: "span 3" }}>
              <div
                style={{ ...panelTitle, cursor: "help" }}
                onMouseEnter={() =>
                  setTooltip(
                    "Composite risk derived from velocity, acceleration density, and cluster instability.",
                  )
                }
                onMouseLeave={() => setTooltip(null)}
              >
                Economic Risk Pulse ⓘ
              </div>
              {!overview ? (
                <div style={metric}>--</div>
              ) : (
                <div>
                  <div style={metric}>{overview.economicRisk}</div>
                  {overview?.delta?.econ !== null &&
                    overview?.delta?.econ !== undefined && (
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          marginTop: 4,
                          color:
                            overview.delta.econ > 0 ? "#ef4444" : "#22c55e",
                        }}
                      >
                        {overview.delta.econ > 0 ? "▲" : "▼"}{" "}
                        {Math.abs(overview.delta.econ)}% vs yesterday
                      </div>
                    )}

                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      color:
                        overview.economicRisk >= 70
                          ? "#ef4444"
                          : overview.economicRisk >= 40
                            ? "#f59e0b"
                            : "#22c55e",
                    }}
                  >
                    {overview.economicRisk >= 70
                      ? "HIGH INSTABILITY"
                      : overview.economicRisk >= 40
                        ? "ELEVATED RISK"
                        : "LOW PRESSURE"}
                  </div>
                </div>
              )}
              <div style={metricLabel}>Market & Macro Risk</div>
              <div style={{ ...metricLabel, fontSize: 11, opacity: 0.6 }}>
                (0–100 scale, {windowParam} window)
              </div>
            </div>

            <div style={{ ...panel, gridColumn: "span 3" }}>
              <div style={panelTitle}>Most Divergent Stories</div>

              <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 10 }}>
                Split Narratives
              </div>

              {!clusters.length ? (
                <div style={listItem}>Loading clusters...</div>
              ) : (
                clusters
                  .filter(
                    (c) =>
                      (c.divergenceScore ?? 0) >= 30 &&
                      (c.sourceCount ?? c.sources ?? 0) >= 2,
                  )
                  .sort(
                    (a, b) =>
                      (b.divergenceScore ?? 0) - (a.divergenceScore ?? 0),
                  )
                  .slice(0, 5)
                  .map((c) => (
                    <div key={c.slug} style={listItem}>
                      <strong>{c.title}</strong>
                      <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
                        Divergence:{" "}
                        <strong>{c.divergenceScore ?? 0}/100</strong> • Sources:{" "}
                        {c.sourceCount ?? c.sources ?? "--"}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* ===== PRESSURE BAND ===== */}
          <div style={rowBand} className="rowBand">
            <div style={{ ...panel, gridColumn: "span 6" }}>
              <div
                style={{ ...panelTitle, cursor: "help" }}
                onMouseEnter={() =>
                  setTooltip(
                    "Region-weighted narrative intensity adjusted for acceleration and divergence.",
                  )
                }
                onMouseLeave={() => setTooltip(null)}
              >
                Geopolitical Pressure Index ⓘ
              </div>

              {!overview?.geopoliticalPressure ? (
                <div style={listItem}>Loading pressure index...</div>
              ) : (
                overview.geopoliticalPressure.slice(0, 5).map((r) => (
                  <div
                    key={r.region}
                    style={{ ...listItem, cursor: "pointer" }}
                    onClick={() => {
                      fetch(`${API}/signals/region/${r.region}`)
                        .then((res) => res.json())
                        .then((data) => {
                          setSelectedRegion(data);
                          setPanelOpen(true);
                        });
                    }}
                  >
                    <strong>{r.region}</strong>

                    <div style={{ fontSize: 12, opacity: 0.85, marginTop: 6 }}>
                      Narrative Activity:{" "}
                      {r.narrativePressure > 70
                        ? "High"
                        : r.narrativePressure > 40
                          ? "Elevated"
                          : "Calm"}
                      {" | "}
                      Political Tension:{" "}
                      {r.riskPressure > 70
                        ? "High"
                        : r.riskPressure > 40
                          ? "Elevated"
                          : "Low"}
                      {" | "}
                      Strategic Movement:{" "}
                      {r.strategicPressure > 70
                        ? "Active"
                        : r.strategicPressure > 40
                          ? "Developing"
                          : "Minimal"}
                      {" | "}
                      Market Sensitivity:{" "}
                      {r.marketPressure > 120
                        ? "High"
                        : r.marketPressure > 80
                          ? "Elevated"
                          : "Stable"}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ ...panel, gridColumn: "span 6" }}>
              <div style={panelTitle}>Regional Volume Spread</div>

              {!overview?.regionalSpread ? (
                <div style={listItem}>Loading regional spread...</div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 20,
                  }}
                >
                  <div>
                    <div
                      style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}
                    >
                      Top 10 by Volume
                    </div>
                    {overview.regionalSpread.slice(0, 10).map((r) => (
                      <div key={r.region} style={listItem}>
                        • {r.region}{" "}
                        <span style={{ opacity: 0.65 }}>({r.count})</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div
                      style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}
                    >
                      Top 10 by Acceleration
                    </div>
                    {overview.geopoliticalPressure?.slice(0, 10).map((r) => (
                      <div key={r.region} style={listItem}>
                        • {r.region}{" "}
                        <span style={{ opacity: 0.65 }}>
                          ({r.narrativePressure})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={rowBand}>
            {/* LEFT PANEL — GEOSTRATEGIC */}
            <div style={{ ...panel, gridColumn: "span 6" }}>
              <div style={panelTitle}>
                Geostrategic Narrative Intensity Ranking
              </div>

              {!overview?.strategicIntensityRanking ? (
                <div style={listItem}>Loading strategic intensity...</div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    fontSize: 13,
                  }}
                >
                  {overview.strategicIntensityRanking.map((c, i) => {
                    const maxScore =
                      overview.strategicIntensityRanking[0]?.score || 1;
                    const widthPercent = (c.score / maxScore) * 100;

                    return (
                      <div key={c.country} style={{ padding: "6px 0" }}>
                        <div style={{ fontWeight: 600 }}>
                          {i + 1}. {c.country}
                        </div>
                        <div
                          style={{
                            height: 6,
                            background: "#1f2937",
                            borderRadius: 4,
                            marginTop: 4,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${widthPercent}%`,
                              height: "100%",
                              background: "#ef4444",
                            }}
                          />
                        </div>
                        <div style={{ fontSize: 11, opacity: 0.6 }}>
                          Score: {c.score}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RIGHT PANEL — REGIONAL VOLUME SPREAD */}

            <div style={{ ...panel, gridColumn: "span 6" }}>
              <div style={panelTitle}>Top Accelerating Topics</div>

              {acceleratingClusters.length === 0 ? (
                <div style={listItem}>No strong acceleration detected</div>
              ) : (
                acceleratingClusters.map((c) => (
                  <div key={c.slug} style={listItem}>
                    • {c.title}
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={clusterSection}>
            <div style={sectionHeader}>EMERGING STORY CLUSTERS</div>

            <div style={clusterGrid}>
              {clusters.map((cluster) => {
                const trendData = getTrendDisplay(cluster.momentum);

                return (
                  <Link
                    key={cluster.title}
                    href={`/signals/cluster/${cluster.slug}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div
                      style={{
                        ...clusterCard,
                        borderLeft:
                          cluster.momentum === "accelerating"
                            ? "3px solid #ff2b2b"
                            : cluster.momentum === "rising"
                              ? "3px solid #4ade80"
                              : cluster.momentum === "falling"
                                ? "3px solid #ef4444"
                                : "3px solid #60a5fa",
                      }}
                      className="cluster-card"
                      data-momentum={cluster.momentum}
                    >
                      <div style={clusterTitle}>{cluster.title}</div>
                      <div style={clusterMeta}>
                        {cluster.sources} Sources • {cluster.articles} Articles
                      </div>

                      <div
                        style={{ fontSize: 10, marginTop: 6, opacity: 0.65 }}
                      >
                        Velocity: {cluster.recent} | Baseline:{" "}
                        {cluster.previous}
                      </div>

                      <div
                        style={{ fontSize: 10, marginTop: 4, opacity: 0.65 }}
                      >
                        Acceleration: {Number(cluster.ratio).toFixed(2)}x
                      </div>

                      <div style={{ marginTop: 8, fontSize: 12 }}>
                        <span style={{ ...trendData.style, fontWeight: 700 }}>
                          {trendData.symbol} {trendData.label}
                        </span>
                      </div>

                      {cluster.hasDivergence && (
                        <div
                          style={{
                            marginTop: 6,
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#f59e0b",
                            letterSpacing: 0.4,
                          }}
                        >
                          ⚠ Narrative Divergence Detected
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {tooltip && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            left: 20,
            background: "#111827",
            padding: "10px 14px",
            borderRadius: 6,
            fontSize: 12,
            color: "#e5e7eb",
            border: "1px solid #334155",
            boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
            maxWidth: 300,
            zIndex: 99999,
          }}
        >
          {tooltip}
        </div>
      )}

      <style jsx>{`
        .cluster-card:hover {
          transform: translateY(-4px);
        }

        .cluster-card[data-momentum="accelerating"]:hover {
          border: 1px solid rgba(255, 0, 0, 0.6);
          box-shadow: 0 0 18px rgba(255, 0, 0, 0.35);
        }

        .cluster-card[data-momentum="rising"]:hover {
          border: 1px solid rgba(74, 222, 128, 0.5);
          box-shadow: 0 0 14px rgba(74, 222, 128, 0.25);
        }

        .cluster-card:not([data-momentum]):hover {
          border: 1px solid rgba(78, 161, 255, 0.35);
          box-shadow: 0 0 14px rgba(78, 161, 255, 0.2);
        }

        /* ---------------- MOBILE: make analytics readable ---------------- */
        @media (max-width: 900px) {
          .rowBand {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
            padding: 0 !important;
          }

          /* Force all panels to full-width (override inline span 3/span 6) */
          .rowBand > div {
            grid-column: span 12 !important;
            min-height: auto !important;
          }
        }

        @media (max-width: 650px) {
          /* tighten page padding on small phones */
          .pageTight {
            padding: 18px 14px !important;
          }
        }

        @media (max-width: 768px) {
          .cluster-card {
            padding: 14px !important;
          }

          .cluster-card div {
            font-size: 12px !important;
          }
        }
      `}</style>

      <RegionIntelligencePanel
        regionData={selectedRegion}
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
      />
    </>
  );
}

/* =========================== STYLES =========================== */

const page = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "20px",
  backgroundColor: "#0b1117",
  minHeight: "100vh",
  color: "#e6edf3",
  fontFamily: "Inter, system-ui, sans-serif",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(12, 1fr)",
  gap: 20,
};

const rowBand = {
  display: "grid",
  gridTemplateColumns: "repeat(12, 1fr)",
  gap: 20,
  padding: 10,
  gridColumn: "span 12",
};

const gridRow = {
  display: "grid",
  gridTemplateColumns: "repeat(12, 1fr)",
  gap: 20,
};

const panel = {
  gridColumn: "span 12",
  backgroundColor: "#111827",
  padding: 20,
  borderRadius: 8,
  boxShadow: "0 0 20px rgba(0,0,0,0.4)",
  minHeight: 200,
};

const panelLarge = {
  gridColumn: "span 12",
  backgroundColor: "#111827",
  padding: 20,
  borderRadius: 8,
  boxShadow: "0 0 20px rgba(0,0,0,0.4)",
};

const panelTitle = {
  fontSize: 13,
  textTransform: "uppercase",
  letterSpacing: "1px",
  color: "#60a5fa",
  marginBottom: 15,
};

const metric = {
  fontSize: 32,
  fontWeight: 300,
  color: "#38bdf8",
};

const metricLabel = {
  fontSize: 12,
  color: "#94a3b8",
  marginTop: 5,
};

const listItem = {
  fontSize: 14,
  marginBottom: 8,
  color: "#f59e0b",
};

const placeholder = {
  height: 180,
  backgroundColor: "#0f172a",
  borderRadius: 6,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#475569",
  fontSize: 13,
};

const placeholderSmall = {
  height: 120,
  backgroundColor: "#0f172a",
  borderRadius: 6,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#475569",
  fontSize: 13,
};

const clusterSection = {
  gridColumn: "span 12",
  marginTop: 10,
};

const sectionHeader = {
  fontSize: 13,
  letterSpacing: 2,
  color: "#4ea1ff",
  marginBottom: 25,
};

const clusterGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 20,
};

const clusterCard = {
  background: "linear-gradient(145deg, #0c1a2b, #08121d)",
  border: "1px solid rgba(78,161,255,0.15)",
  borderLeft: "3px solid transparent",
  padding: 18,
  borderRadius: 8,
  transition: "all 0.25s ease",
  cursor: "pointer",
  position: "relative",
  boxShadow: "0 0 10px rgba(255, 0, 0, 0.15)",
};

const clusterTitle = {
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: 1,
  marginBottom: 8,
};

const clusterMeta = {
  fontSize: 12,
  color: "rgba(203,213,225,0.65)",
};

const clusterScore = {
  fontSize: 12,
  marginTop: 6,
  color: "rgba(203,213,225,0.85)",
};

const emergingTrend = { color: "#4ea1ff", fontWeight: 600 };
const risingTrend = { color: "#4ade80", fontWeight: 600 };
const acceleratingTrend = {
  color: "#ff2b2b",
  fontWeight: 700,
  textShadow: "0 0 8px rgba(255, 0, 0, 0.7)",
};
const stableTrend = { color: "#60a5fa", fontWeight: 600 };
const coolingTrend = { color: "#9ca3af", fontWeight: 600 };
const fallingTrend = { color: "#ef4444", fontWeight: 600 };
