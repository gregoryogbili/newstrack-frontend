export default function SiteFooter() {
  const stackItems = [
    "Built with Node.js",
    "PostgreSQL",
    "Next.js",
    "Vercel",
    "Render",
    "RSS Ingestion",
    "AI-ranked visibility"
  ];

  return (
    <footer style={wrap}>
      {/* Company Line */}
      <div style={line}>
        © 2026 GENŌ INTELLIGENTIA LIMITED, United Kingdom
      </div>

      {/* Tech Stack Scroller */}
      <div style={stackBar} className="stackBar">
        <div style={stackTrack} className="stackTrack">
          {[...stackItems, ...stackItems].map((t, i) => (
            <span key={i} style={stackItem}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        .stackTrack {
          animation: move 28s linear infinite;
        }

        .stackBar:hover .stackTrack {
          animation-play-state: paused;
        }

        @keyframes move {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </footer>
  );
}

/* ========================= */
/* STYLES */
/* ========================= */

const wrap = {
  marginTop: 60,
  paddingTop: 24,
  borderTop: "1px solid #eee"
};

const line = {
  textAlign: "center",
  fontWeight: 800,
  color: "#111",
  marginBottom: 14,
  letterSpacing: 0.3
};

const stackBar = {
  marginTop: 8,
  overflow: "hidden",
  whiteSpace: "nowrap",
  borderRadius: 12,
  border: "1px solid #e1e1e1",
  background: "#f3f3f3",       // ✅ FIXED
  color: "#555",            // ✅ Now readable
  padding: "6px 0"
};

const stackTrack = {
  display: "inline-flex",
  alignItems: "center"
};

const stackItem = {
  padding: "0 26px",
  fontWeight: 700,
  opacity: 0.9,
  fontSize: 14,
  color: "#555"
};
