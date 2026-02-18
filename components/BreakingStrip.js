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
            <span key={idx} style={item}>{t}</span>
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
          0%   { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

const bar = {
  display: "flex",
  alignItems: "center",
  background: "#111",
  color: "#fff",
  overflow: "hidden",
  borderRadius: 10,
  marginBottom: 18
};

const label = {
  background: "#c40000",
  padding: "10px 18px",
  fontWeight: 900,
  letterSpacing: 0.6,
  flexShrink: 0
};

const scroll = {
  overflow: "hidden",
  whiteSpace: "nowrap",
  flex: 1
};

const track = {
  display: "inline-flex",
  alignItems: "center"
};

const item = {
  marginRight: 60,
  fontSize: 14,
  opacity: 0.95
};
