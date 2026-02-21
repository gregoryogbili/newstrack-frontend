import Head from "next/head";

export default function SignalsDashboard() {
  return (
    <>
      <Head>
        <title>NewsTrac Intelligence</title>
      </Head>

      <div style={page}>
        <div style={header}>
          <h1 style={title}>NewsTrac Intelligence</h1>
          <div style={subtitle}>Global Narrative Monitoring System</div>
        </div>

        <div style={grid}>
          {/* Global Heat Map */}
          <div style={panelLarge}>
            <div style={panelTitle}>Global Narrative Heat Map</div>
            <div style={placeholder}>Map Visualization (Phase 2)</div>
          </div>

          {/* Signal Velocity */}
          <div style={panel}>
            <div style={panelTitle}>Signal Velocity Index</div>
            <div style={metric}>--</div>
            <div style={metricLabel}>6 Hour Acceleration</div>
          </div>

          {/* Top Accelerating Topics */}
          <div style={panel}>
            <div style={panelTitle}>Top Accelerating Topics</div>
            <div style={listItem}>• Energy Markets</div>
            <div style={listItem}>• Middle East Conflict</div>
            <div style={listItem}>• AI Regulation</div>
            <div style={listItem}>• Global Trade</div>
          </div>

          {/* Economic Risk Pulse */}
          <div style={panel}>
            <div style={panelTitle}>Economic Risk Pulse</div>
            <div style={metric}>--</div>
            <div style={metricLabel}>Composite Risk Score</div>
          </div>

          {/* Regional Spread */}
          <div style={panel}>
            <div style={panelTitle}>Regional Signal Spread</div>
            <div style={placeholderSmall}>Regional Distribution Chart</div>
          </div>

          {/* Emerging Story Clusters */}
          <div style={clusterSection}>
            <div style={sectionHeader}>EMERGING STORY CLUSTERS</div>

            <div style={clusterGrid}>
              <div style={clusterCard} className="cluster-card">
                <div style={clusterTitle}>MIDDLE EAST ESCALATION</div>
                <div style={clusterMeta}>
                  7 Sources • <span style={acceleratingTrend}>⇈ Accelerating</span>
                  </div>
              </div>

              <div style={clusterCard} className="cluster-card">
                <div style={clusterTitle}>AI REGULATION</div>
                <div style={clusterMeta}>
                  5 Sources • <span style={stableTrend}>→ Stable</span>
                  </div>
              </div>

              <div style={clusterCard} className="cluster-card">
                <div style={clusterTitle}>OIL PRICE VOLATILITY</div>
                <div style={clusterMeta}>
                6 Sources • <span style={risingTrend}>↑ Rising</span>
                </div>
              </div>

              <div style={clusterCard} className="cluster-card">
                <div style={clusterTitle}>GLOBAL TRADE TENSIONS</div>
                <div style={clusterMeta}>
                  4 Sources • <span style={emergingTrend}>↗ Emerging</span>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <style jsx>{`
  .cluster-card:hover {
    transform: translateY(-4px);
    border: 1px solid rgba(78,161,255,0.35);
    box-shadow: 0 0 20px rgba(78,161,255,0.15);
  }
`}</style>
    </>
  );
}

/* ===========================
   STYLES
=========================== */

const page = {
  backgroundColor: "#0b1117",
  minHeight: "100vh",
  color: "#e6edf3",
  fontFamily: "Inter, system-ui, sans-serif",
  padding: "40px 30px",
};

const header = {
  marginBottom: 40,
};

const title = {
  fontSize: 28,
  fontWeight: 500,
  letterSpacing: "0.5px",
};

const subtitle = {
  fontSize: 14,
  color: "#8b949e",
  marginTop: 6,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(12, 1fr)",
  gap: 20,
};

const panel = {
  gridColumn: "span 4",
  backgroundColor: "#111827",
  padding: 20,
  borderRadius: 8,
  boxShadow: "0 0 20px rgba(0,0,0,0.4)",
};

const panelLarge = {
  gridColumn: "span 12",
  backgroundColor: "#111827",
  padding: 20,
  borderRadius: 8,
  boxShadow: "0 0 20px rgba(0,0,0,0.4)",
};

const panelWide = {
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
  color: "#8b949e",
  marginTop: 5,
};

const listItem = {
  fontSize: 14,
  marginBottom: 8,
  color: "#d1d5db",
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
  marginTop: 60,
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
  padding: 22,
  borderRadius: 8,
  transition: "all 0.25s ease",
  cursor: "pointer",
  position: "relative"
};

const clusterTitle = {
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: 1,
  marginBottom: 8,
};

const clusterMeta = {
  fontSize: 12,
  color: "rgba(255,255,255,0.5)",
};

const emergingTrend = {
  color: "rgba(78, 161, 255, 0.85)", // soft cyan
  fontWeight: 500
};

const risingTrend = {
  color: "rgba(72, 187, 120, 0.85)", // muted green
  fontWeight: 500
};

const acceleratingTrend = {
  color: "rgba(255, 99, 99, 0.85)", // soft red
  fontWeight: 500
};

const stableTrend = {
  color: "rgba(120, 160, 255, 0.75)", // neutral blue
  fontWeight: 500
};

const coolingTrend = {
  color: "rgba(160, 160, 160, 0.7)", // soft grey
  fontWeight: 500
};

const fallingTrend = {
  color: "rgba(220, 80, 80, 0.8)", // muted red
  fontWeight: 500
};