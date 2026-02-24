"use client";

export default function RegionIntelligencePanel({ regionData, open, onClose }) {
  if (!regionData) return null;

  function buildRegionalBrief(data) {
    if (!data) return "";

    const {
      articleCount,
      acceleratingClusters,
      averageSourceDiversity,
      hourlyTrend,
    } = data;

    // --- Coverage Intensity ---
    let coverageText;
    if (articleCount <= 15) coverageText = "Coverage intensity is limited.";
    else if (articleCount <= 40)
      coverageText = "Coverage intensity is moderate.";
    else if (articleCount <= 80)
      coverageText = "Coverage intensity is elevated.";
    else coverageText = "Coverage concentration is heavy.";

    // --- Narrative Momentum ---
    let momentumText;
    if (acceleratingClusters === 0)
      momentumText = "Narrative momentum remains stable.";
    else if (acceleratingClusters <= 2)
      momentumText = "Early acceleration signals detected.";
    else momentumText = "Active narrative escalation observed.";

    // --- Source Structure ---
    let sourceText;
    if (averageSourceDiversity <= 1)
      sourceText = "Reporting is dominated by a single source.";
    else if (averageSourceDiversity <= 2)
      sourceText = "Source diversity remains low.";
    else if (averageSourceDiversity <= 4)
      sourceText = "Moderate cross-source reporting observed.";
    else sourceText = "Broad multi-source distribution detected.";

    // --- Volatility ---
    let volatilityText = "";
    if (hourlyTrend && hourlyTrend.length) {
      const counts = hourlyTrend.map((h) => h.count);
      const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
      const max = Math.max(...counts);

      if (max > avg * 2)
        volatilityText =
          "Short-term volatility spike detected within the last 24 hours.";
      else
        volatilityText =
          "Narrative flow appears steady without sharp volatility.";
    }

    return `${coverageText} ${momentumText} ${sourceText} ${volatilityText}`;
  }

  function explainRegion(data) {
    if (!data) return "";

    const { articleCount, acceleratingClusters, averageSourceDiversity } = data;

    let explanation = "";

    if (articleCount > 40) {
      explanation += "Media coverage volume is elevated. ";
    } else if (articleCount > 20) {
      explanation += "Coverage levels are moderate. ";
    } else {
      explanation += "Coverage activity remains limited. ";
    }

    if (acceleratingClusters > 0) {
      explanation +=
        "Some narratives are accelerating, indicating increasing attention. ";
    } else {
      explanation += "No accelerating narrative spikes detected. ";
    }

    if (averageSourceDiversity >= 3) {
      explanation +=
        "Reporting is distributed across multiple independent sources.";
    } else {
      explanation +=
        "Coverage appears concentrated among a limited number of sources.";
    }

    return explanation;
  }

  const consolidationRatio =
    regionData.clusterCount > 0
      ? regionData.articleCount / regionData.clusterCount
      : 0;

  let narrativeStructure = "Fragmented";

  if (consolidationRatio >= 3) {
    narrativeStructure = "Highly Consolidated";
  } else if (consolidationRatio >= 1.5) {
    narrativeStructure = "Moderately Consolidated";
  }

  // Trend Direction Analysis (safe)
  const trendData = regionData.hourlyTrend || [];

  const firstHalf = trendData
    .slice(0, 12)
    .reduce((sum, d) => sum + (d.count || 0), 0);

  const secondHalf = trendData
    .slice(12)
    .reduce((sum, d) => sum + (d.count || 0), 0);

  let trendDirection = "Stable";

  if (secondHalf > firstHalf * 1.2) trendDirection = "Rising";
  if (secondHalf < firstHalf * 0.8) trendDirection = "Declining";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        height: "100vh",
        width: "360px",
        maxWidth: "85vw",
        background: "#0b1220",
        boxShadow: "-10px 0 40px rgba(0,0,0,0.6)",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
        zIndex: 9999,
        padding: "30px",
        overflowY: "auto",
        color: "#e6edf3",
      }}
    >
      {/* Close Button */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 style={{ fontSize: 18 }}>
          {regionData.region} — Regional Intelligence Brief
        </h2>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <h4>Signal Interpretation</h4>

        <p>
          Narrative Structure: <strong>{narrativeStructure}</strong>
        </p>

        <p>
          24h Activity:{" "}
          {regionData.articleCount > 50
            ? "High Coverage"
            : regionData.articleCount > 20
              ? "Moderate Coverage"
              : "Low Coverage"}
        </p>
      </div>

      <div style={{ marginTop: 25 }}>
        <h4>Cluster Statistics (24h)</h4>
        <div style={{ marginTop: 25 }}>
          <h4>Regional Intelligence Interpretation</h4>

          <div
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              opacity: 0.9,
            }}
          >
            {buildRegionalBrief(regionData)}
          </div>
        </div>
        <p>Total Articles: {regionData.articleCount}</p>
        <p>Total Clusters: {regionData.clusterCount}</p>
        <p>Accelerating Clusters: {regionData.acceleratingClusters}</p>
        <p>Average Source Diversity: {regionData.averageSourceDiversity}</p>
      </div>

      <div style={{ marginTop: 25 }}>
        <h4>What This Means</h4>

        <div
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            opacity: 0.9,
          }}
        >
          {explainRegion(regionData)}
        </div>
      </div>

      <div style={{ marginTop: 30 }}>
        <h4>24-Hour Narrative Trend</h4>

        <MiniTrendGraph data={trendData} />

        <p style={{ marginTop: 10 }}>
          Short-Term Direction: <strong>{trendDirection}</strong>
        </p>
      </div>
    </div>
  );
}

/* Mini SVG Trend Graph */
function MiniTrendGraph({ data }) {
  const safe = Array.isArray(data) ? data : [];
  const max = Math.max(1, ...safe.map((d) => d.count || 0));
  const width = 350;
  const height = 120;

  const points = safe.map((d, i) => {
    const x = (i / 23) * width;
    const y = height - ((d.count || 0) / max) * height;
    return `${x},${y}`;
  });

  return (
    <svg width={width} height={height}>
      <polyline
        fill="none"
        stroke="#4ea1ff"
        strokeWidth="2"
        points={points.join(" ")}
      />
    </svg>
  );
}

