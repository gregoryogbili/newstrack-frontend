import { useMemo } from "react";

export default function BreakingStrip({ items = [] }) {
  const text = useMemo(() => {
    const list = (items || []).slice(0, 10);
    // fallback
    if (!list.length) return ["No breaking headlines yet"];
    return list.map((x) => x.headline).filter(Boolean);
  }, [items]);

  return (
    <div style={bar} aria-label="Breaking news">
      <div style={label}>BREAKING</div>

      <div style={scroll} className="breakingScroll">
        <div style={track} className="breakingTrack">
          {/* duplicate for seamless loop */}
          {text.concat(text).map((t, idx) => (
            <span key={idx} style={item}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        .breakingTrack {
          animation: scroll 55s linear infinite;
        }
        .breakingScroll:hover .breakingTrack {
          animation-play-state: paused;
        }
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

const bar = {
  display: "flex",
  alignItems: "center",
  background: "#f5f5f5",      // light gray instead of black
  color: "#c40000",              // red text
  overflow: "hidden",
  marginTop: 24,
  marginBottom: 24,
  borderBottom: "1px solid #e2e2e2",  // subtle divider
  width: "100%",
  boxSizing: "border-box",  
};

const label = {
  background: "#c40000",
  color: "#fff",
  padding: "6px 16px",     // slimmer height
  fontWeight: 900,
  letterSpacing: 0.6,
  flexShrink: 0,
};

const scroll = {
  overflow: "hidden",
  whiteSpace: "nowrap",
  flex: 1,
};

const track = {
  display: "inline-flex",
  alignItems: "center",
};

const item = {
  marginRight: 60,
  fontSize: 14,
  color: "#c40000",
  fontWeight: 700,
  letterSpacing: "0.2px",
};
