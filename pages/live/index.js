import TopNav from "../../components/TopNav";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API;

const SENTIMENT_STYLES = {
  Escalatory: { bg: "#fef2f2", color: "#c40000" },
  Threatening: { bg: "#fff7ed", color: "#c2410c" },
  Diplomatic: { bg: "#f0fdf4", color: "#15803d" },
  Defensive: { bg: "#eff6ff", color: "#1d4ed8" },
  Economic: { bg: "#fefce8", color: "#a16207" },
  Neutral: { bg: "#f9fafb", color: "#6b7280" },
};

export default function LivePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetch(`${API}/posts`)
      .then((r) => r.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const refreshIntel = async () => {
    setGenerating(true);
    await fetch(`${API}/posts/generate`, { method: "POST" });
    const data = await fetch(`${API}/posts`).then((r) => r.json());
    setPosts(Array.isArray(data) ? data : []);
    setGenerating(false);
  };

  return (
    <>
      <TopNav
        active="/live"
        logoImg={<img src="/logo.png" style={{ height: 28 }} />}
      />

      <div style={container}>
        {/* Refresh button */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
          <button
            onClick={refreshIntel}
            disabled={generating}
            style={{
              padding: "8px 18px",
              background: generating ? "#e5e7eb" : "#b80000",
              color: generating ? "#9ca3af" : "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 800,
              fontSize: 13,
              cursor: generating ? "not-allowed" : "pointer",
              letterSpacing: "0.4px",
            }}
          >
            {generating ? "Analysing..." : "⚡ Refresh Intelligence"}
          </button>
        </div>

        {loading && <div style={emptyBox}>Loading intelligence reports...</div>}

        {!loading && posts.length === 0 && (
          <div style={emptyBox}>
            <h2 style={{ marginBottom: 8, fontSize: 18, fontWeight: 800 }}>
              No live reports at this time.
            </h2>
            <p style={{ color: "#6b7280", fontSize: 14 }}>
              Click "Refresh Intelligence" to generate analysis from current top
              stories, or check back later for journalist reports.
            </p>
          </div>
        )}

        <div style={grid}>
          {posts.map((post) => {
            let intel = null;
            if (post.source_name === "NewsTrac AI") {
              try {
                intel = JSON.parse(post.description);
              } catch {}
            }
            const sentiment = intel?.strategic_sentiment;
            const sentStyle =
              SENTIMENT_STYLES[sentiment] || SENTIMENT_STYLES.Neutral;

            return (
              <div key={post.id} style={card}>
                {/* Tags row */}
                <div style={tagsRow}>
                  <span
                    style={
                      post.source_name === "NewsTrac AI" ? aiTag : journalistTag
                    }
                  >
                    {post.source_name === "NewsTrac AI"
                      ? "NewsTrac AI"
                      : "Independent Journalist"}
                  </span>
                  {sentiment && (
                    <span
                      style={{
                        ...sentimentBadge,
                        background: sentStyle.bg,
                        color: sentStyle.color,
                      }}
                    >
                      {sentiment}
                    </span>
                  )}
                </div>

                {/* Headline */}
                <h2 style={cardTitle}>{post.headline}</h2>

                {intel ? (
                  <>
                    {/* Intelligence Brief */}
                    <p style={cardBody}>{intel.intelligence_brief}</p>

                    {/* Divergence */}
                    {intel.divergence && intel.divergence !== "null" && (
                      <div style={intelBlock}>
                        <div style={intelLabel}>📡 Narrative Divergence</div>
                        <p style={intelText}>{intel.divergence}</p>
                      </div>
                    )}

                    {/* Who Benefits */}
                    {intel.who_benefits && (
                      <div style={intelBlock}>
                        <div style={intelLabel}>🎯 Who Benefits</div>
                        <p style={intelText}>{intel.who_benefits}</p>
                      </div>
                    )}

                    {/* Watch Signal */}
                    {intel.watch_signal && (
                      <div
                        style={{
                          ...intelBlock,
                          background: "#fffbeb",
                          borderColor: "#fde68a",
                        }}
                      >
                        <div style={{ ...intelLabel, color: "#92400e" }}>
                          👁 Watch Signal
                        </div>
                        <p
                          style={{
                            ...intelText,
                            color: "#78350f",
                            fontWeight: 600,
                          }}
                        >
                          {intel.watch_signal}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    style={{ ...cardBody, fontSize: 15, lineHeight: 1.8 }}
                    dangerouslySetInnerHTML={{ __html: post.description }}
                  />
                )}

                {/* Disclaimer — journalist posts only */}
                {post.source_name !== "NewsTrac AI" && (
                  <div style={disclaimer}>
                    The views expressed are those of the author. NewsTrac
                    publishes perspectives across the political spectrum as part
                    of its commitment to open geopolitical discourse.
                  </div>
                )}

                {/* Meta */}
                <div style={cardMeta}>
                  {new Date(post.created_at).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" · "}
                  {post.views || 0} views
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

const container = {
  maxWidth: "1180px",
  margin: "0 auto",
  padding: "40px 18px",
  minHeight: "100vh",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
  gap: 24,
};

const card = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 24,
  background: "#fff",
  display: "flex",
  flexDirection: "column",
  gap: 12,
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};

const tagsRow = {
  display: "flex",
  gap: 8,
  alignItems: "center",
  flexWrap: "wrap",
};

const aiTag = {
  fontSize: 10,
  fontWeight: 800,
  color: "#c40000",
  letterSpacing: "0.8px",
  textTransform: "uppercase",
};

const journalistTag = {
  fontSize: 10,
  fontWeight: 800,
  color: "#0369a1",
  letterSpacing: "0.8px",
  textTransform: "uppercase",
};

const sentimentBadge = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.6px",
  textTransform: "uppercase",
  padding: "2px 8px",
  borderRadius: 4,
};

const cardTitle = {
  fontSize: 17,
  fontWeight: 800,
  lineHeight: 1.35,
  margin: 0,
  color: "#111",
};

const cardBody = {
  fontSize: 14,
  lineHeight: 1.75,
  color: "#374151",
  margin: 0,
};

const intelBlock = {
  borderRadius: 8,
  padding: "10px 14px",
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
};

const intelLabel = {
  fontSize: 10,
  fontWeight: 800,
  color: "#6b7280",
  letterSpacing: "0.6px",
  textTransform: "uppercase",
  marginBottom: 4,
};

const intelText = {
  fontSize: 13,
  lineHeight: 1.65,
  color: "#374151",
  margin: 0,
};

const cardMeta = {
  fontSize: 12,
  color: "#9ca3af",
  marginTop: "auto",
  paddingTop: 8,
  borderTop: "1px solid #f3f4f6",
};

const emptyBox = {
  padding: "20px",
  borderRadius: "6px",
  border: "1px solid #e5e7eb",
  background: "#f9fafb",
};

const disclaimer = {
  fontSize: 12,
  color: "#6b7280",
  fontStyle: "italic",
  borderTop: "1px solid #f3f4f6",
  paddingTop: 10,
  marginTop: 4,
  lineHeight: 1.6,
};
