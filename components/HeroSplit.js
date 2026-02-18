import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

const FALLBACK_BY_CATEGORY = {
  world: "/banners/world.jpg",
  politics: "/banners/politics.jpg",
  economy: "/banners/economy.jpg",
  technology: "/banners/technology.jpg",
  geopolitics: "/banners/geopolitics.jpg",
  disaster: "/banners/disaster.jpg",
  live: "/banners/live.jpg",
  default: "/banners/world.jpg"
};

function pickBanner(category) {
  const key = (category || "").toLowerCase();
  return FALLBACK_BY_CATEGORY[key] || FALLBACK_BY_CATEGORY.default;
}

function openFull(item) {
  // Candidates have source_url; posts may have source_url too
  const url = item?.source_url || item?.sourceUrl || item?.url;
  if (url) window.open(url, "_blank", "noopener,noreferrer");
}

export default function HeroSplit({ items = [], loading }) {
  const list = useMemo(() => (items || []).filter(Boolean).slice(0, 8), [items]);

  // Left = “exclusive” biggest breaking headline
  const leftItem = useMemo(() => list[0] || null, [list]);

  // Right slider = the rest (exclude left item)
  const rightItems = useMemo(() => list.slice(1, 6), [list]);

  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(false);

  const touchStartX = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!rightItems.length) return;

    // 3 seconds rotation
    intervalRef.current = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setIdx((prev) => (prev + 1) % rightItems.length);
        setFade(false);
      }, 220);
    }, 3000);

    return () => clearInterval(intervalRef.current);
  }, [rightItems.length]);

  const active = rightItems[idx] || null;
  const bannerSrc = pickBanner(active?.category);

  const onDot = (i) => {
    clearInterval(intervalRef.current);
    setFade(true);
    setTimeout(() => {
      setIdx(i);
      setFade(false);
    }, 160);
  };

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    // simple swipe threshold
    if (Math.abs(dx) < 45) return;

    clearInterval(intervalRef.current);
    setFade(true);
    setTimeout(() => {
      if (dx < 0) setIdx((p) => (p + 1) % rightItems.length);
      else setIdx((p) => (p - 1 + rightItems.length) % rightItems.length);
      setFade(false);
    }, 160);
  };

  return (
    <section style={wrap}>
      {/* LEFT: Big breaking story (exclusive) */}
      <div style={left}>
        <div style={leftHeader}>
          <span style={leftTag}>BREAKING</span>
          <span style={leftSub}>Top story</span>
        </div>

        <div style={leftBody}>
          <h2 style={leftTitle}>
            {loading ? "Loading..." : (leftItem?.headline || "No headline yet")}
          </h2>
          <p style={leftSnippet}>
            {leftItem?.summary ? trim(leftItem.summary, 170) : "Developing story — click to read the full article."}
          </p>

          <button style={leftBtn} onClick={() => openFull(leftItem)} disabled={!leftItem}>
            Read Full Article →
          </button>
        </div>
      </div>

      {/* RIGHT: Image + rotating headline + dots */}
      <div
        style={right}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-label="Featured stories carousel"
      >
        <button
          style={heroClickable}
          onClick={() => openFull(active)}
          disabled={!active}
          aria-label="Open full article"
        >
          <div style={imageWrap}>
            <Image
              src={bannerSrc}
              alt={active?.category ? `${active.category} banner` : "News banner"}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 58vw"
              style={{ objectFit: "cover" }}
            />
            <div style={overlay} />
          </div>

          <div style={{ ...rightText, ...(fade ? fadeOut : fadeIn) }}>
            <div style={rightKicker}>{(active?.category || "Top").toUpperCase()}</div>
            <div style={rightHeadline}>{active?.headline || "—"}</div>
          </div>
        </button>

        {/* dots */}
        <div style={dots}>
          {rightItems.map((_, i) => (
            <button
              key={i}
              onClick={() => onDot(i)}
              style={{
                ...dot,
                opacity: i === idx ? 1 : 0.35
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <div style={hint}>...</div>
      </div>
    </section>
  );
}

function trim(t, n) {
  if (!t) return "";
  return t.length > n ? t.slice(0, n).trim() + "…" : t;
}

const wrap = {
  display: "grid",
  gridTemplateColumns: "1fr 1.6fr",
  gap: 14,
  marginBottom: 22
};

const left = {
  border: "1px solid #eee",
  borderRadius: 14,
  padding: 16,
  background: "#fff",
  minHeight: 260
};

const leftHeader = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 10
};

const leftTag = {
  background: "#c40000",
  color: "#fff",
  fontWeight: 900,
  padding: "6px 10px",
  borderRadius: 8,
  letterSpacing: 0.6,
  fontSize: 12
};

const leftSub = {
  color: "#666",
  fontSize: 12,
  fontWeight: 700
};

const leftBody = {
  marginTop: 6
};

const leftTitle = {
  fontSize: 22,
  fontWeight: 900,
  lineHeight: 1.15,
  margin: "6px 0 10px"
};

const leftSnippet = {
  color: "#444",
  lineHeight: 1.5,
  margin: "0 0 14px"
};

const leftBtn = {
  border: "1px solid #111",
  background: "#111",
  color: "#fff",
  fontWeight: 800,
  padding: "10px 12px",
  borderRadius: 10,
  cursor: "pointer"
};

const right = {
  position: "relative",
  borderRadius: 14,
  overflow: "hidden",
  minHeight: 260,
  border: "1px solid #eee",
  background: "#000"
};

const heroClickable = {
  all: "unset",
  cursor: "pointer",
  display: "block",
  width: "100%",
  height: "100%"
};

const imageWrap = {
  position: "absolute",
  inset: 0
};

const overlay = {
  position: "absolute",
  inset: 0,
  background: "linear-gradient(to top, rgba(0,0,0,.78), rgba(0,0,0,.22), rgba(0,0,0,.10))"
};

const rightText = {
  position: "absolute",
  left: 16,
  right: 16,
  bottom: 18,
  color: "#fff"
};

const rightKicker = {
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: 0.8,
  opacity: 0.9,
  marginBottom: 6
};

const rightHeadline = {
  fontSize: 24,
  fontWeight: 900,
  lineHeight: 1.15,
  textShadow: "0 6px 22px rgba(0,0,0,.55)"
};

const fadeIn = {
  opacity: 1,
  transform: "translateY(0px)",
  transition: "opacity 220ms ease, transform 220ms ease"
};

const fadeOut = {
  opacity: 0,
  transform: "translateY(6px)",
  transition: "opacity 220ms ease, transform 220ms ease"
};

const dots = {
  position: "absolute",
  right: 14,
  bottom: 14,
  display: "flex",
  gap: 7,
  zIndex: 3
};

const dot = {
  width: 9,
  height: 9,
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,.8)",
  background: "rgba(255,255,255,.85)",
  cursor: "pointer"
};

const hint = {
  position: "absolute",
  left: 14,
  top: 12,
  color: "rgba(255,255,255,.75)",
  fontSize: 12,
  fontWeight: 700
};

/* Responsive */
const styleTag = `
@media (max-width: 900px) {
  .wrap { grid-template-columns: 1fr; }
}
`;
