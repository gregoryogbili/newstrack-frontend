import { useEffect, useMemo, useRef, useState } from "react";

/* -----------------------------
   REGION LABEL (replace categories)
------------------------------ */
function getRegionLabel(item) {
  const h = (item?.headline || "").toLowerCase();
  const s = (item?.summary || "").toLowerCase();
  const src = (
    item?.source ||
    item?.source_name ||
    item?.sourceName ||
    ""
  ).toLowerCase();
  const text = `${h} ${s} ${src}`;

  if (
    /(israel|gaza|palestin|iran|iraq|syria|lebanon|yemen|saudi|uae|qatar|jordan|kuwait|oman|bahrain|red sea)/.test(
      text,
    )
  )
    return "Middle East";

  if (
    /(ukraine|russia|moscow|kyiv|nato|eu\b|europe|uk\b|britain|london|france|germany|italy|spain|poland|sweden|norway|finland)/.test(
      text,
    )
  )
    return "Europe";

  if (
    /(africa|nigeria|ghana|kenya|ethiopia|sudan|somalia|south africa|congo|uganda|tanzania|zimbabwe|sahel|mali|niger|burkina)/.test(
      text,
    )
  )
    return "Africa";

  if (
    /(united states|u\.s\.|usa|washington|new york|california|canada|toronto|ottawa|mexico|mexican)/.test(
      text,
    )
  )
    return "North America";

  if (
    /(latin america|brazil|argentina|chile|colombia|peru|venezuela|ecuador|uruguay|paraguay|bolivia|haiti|cuba)/.test(
      text,
    )
  )
    return "Latin America";

  if (
    /(china|beijing|taiwan|hong kong|japan|tokyo|korea|seoul|india|delhi|pakistan|islamabad|australia|sydney|new zealand|indonesia|philippines|vietnam|thailand)/.test(
      text,
    )
  )
    return "Asia-Pacific";

  return "Global";
}

/* -----------------------------
   INTEL LINE
------------------------------ */
function generateIntelLine(item) {
  if (!item) return "Monitoring narrative development.";

  const h = (item.headline || "").toLowerCase();
  const s = (item.summary || "").toLowerCase();
  const text = `${h} ${s}`;

  if (/(ceasefire|truce|peace talk|negotiation|mediated)/.test(text))
    return "De-escalation signal detected. Watch for compliance or breakdown indicators.";
  if (/(drone|missile|airstrike|strike|bomb|explosion)/.test(text))
    return "Kinetic escalation pattern detected. High probability of rapid follow-on updates.";
  if (/(raid|ambush|militant|insurgent|terror|suicide bomb|gunfire)/.test(text))
    return "Security escalation signal detected. Monitor retaliation and containment response.";
  if (/(killed|dead|deaths|fatal|casualt)/.test(text))
    return "Impact escalation confirmed. Expect amplification across sources and policy response.";
  if (
    /(election|vote|government|minister|parliament|senate|congress|policy|law|court|judge|protest)/.test(
      text,
    )
  )
    return "Institutional narrative forming. Watch for official decisions and secondary protests.";
  if (/(sanction|tariff|ban|embargo)/.test(text))
    return "Pressure mechanism detected. Likely economic and diplomatic spillover.";
  if (
    /(market|stocks|bond|inflation|gdp|bank|interest rate|oil|gas|trade|currency|recession)/.test(
      text,
    )
  )
    return "Macro narrative shift emerging. Potential volatility and cross-sector impact.";
  if (/(cyber|hack|breach|data leak|ransomware)/.test(text))
    return "Cyber risk signal detected. Watch for attribution and systemic impact.";
  if (
    /(artificial intelligence|ai model|ai system|semiconductor|microchip|chipmaker|cybersecurity|data breach|ransomware|hack)/.test(
      text,
    )
  )
    return "Tech narrative strengthening. Monitor regulatory and security spillover.";
  if (
    /(earthquake|storm|flood|wildfire|hurricane|typhoon|landslide|evacuation)/.test(
      text,
    )
  )
    return "Disruption signal detected. Monitor casualties, infrastructure impact, and response speed.";

  return "Regional narrative gaining traction. Monitoring for acceleration and convergence.";
}

/* -----------------------------
   REGION GLOW POSITIONS
   Tuned to match the SVG viewBox 0 0 1000 500
------------------------------ */
const REGION_GLOW = {
  "North America": { x: "22%", y: "30%" },
  "Latin America": { x: "28%", y: "65%" },
  Europe: { x: "50%", y: "25%" },
  Africa: { x: "50%", y: "58%" },
  "Middle East": { x: "58%", y: "38%" },
  "Asia-Pacific": { x: "78%", y: "35%" },
  Global: { x: "50%", y: "45%" },
};

/* Hotspot dot positions (cx/cy in SVG viewBox units 0–1000 x 0–500) */
const REGION_DOT = {
  "North America": { cx: 220, cy: 150 },
  "Latin America": { cx: 280, cy: 330 },
  Europe: { cx: 500, cy: 125 },
  Africa: { cx: 500, cy: 290 },
  "Middle East": { cx: 580, cy: 190 },
  "Asia-Pacific": { cx: 780, cy: 175 },
  Global: { cx: 500, cy: 225 },
};

function glowLayer(region) {
  const p = REGION_GLOW[region] || REGION_GLOW.Global;
  return {
    position: "absolute",
    inset: 0,
    background: `radial-gradient(circle at ${p.x} ${p.y}, rgba(196, 0, 0, 0.32), transparent 40%)`,
    pointerEvents: "none",
    transition: "background 600ms ease",
  };
}

/* -----------------------------
   WORLD MAP SILHOUETTE
   Real simplified continent outlines, viewBox 0 0 1000 500
------------------------------ */
function WorldMapSilhouette({ region }) {
  const dot = REGION_DOT[region] || REGION_DOT.Global;

  return (
    <svg
      viewBox="0 0 1000 500"
      style={{ width: "100%", height: "100%", display: "block" }}
      aria-hidden="true"
    >
      <defs>
        <style>{`
          @keyframes hotPulse {
            0%   { r: 7;  opacity: 1; }
            70%  { r: 22; opacity: 0; }
            100% { r: 7;  opacity: 0; }
          }
          @keyframes hotPulse2 {
            0%   { r: 5;  opacity: 0.9; }
            60%  { r: 14; opacity: 0; }
            100% { r: 5;  opacity: 0; }
          }
          .nt-pulse1 { animation: hotPulse  2.2s ease-out infinite; }
          .nt-pulse2 { animation: hotPulse2 2.2s ease-out 0.4s infinite; }
        `}</style>
      </defs>

      {/* ── NORTH AMERICA ── */}
      <path
        d="M 95 60
           L 130 50 L 175 45 L 220 50 L 260 60
           L 280 80 L 290 110 L 285 140
           L 270 160 L 250 175 L 230 190
           L 210 210 L 195 230 L 185 255
           L 170 260 L 155 250 L 140 230
           L 120 210 L 100 185 L 80 165
           L 65 140 L 60 110 L 70 80 Z"
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.2"
      />
      {/* Alaska thumb */}
      <path
        d="M 65 80 L 50 65 L 35 70 L 30 90 L 50 95 Z"
        fill="rgba(255,255,255,0.07)"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="1"
      />

      {/* ── GREENLAND ── */}
      <path
        d="M 250 20 L 290 15 L 320 25 L 325 50 L 305 65 L 270 60 L 245 45 Z"
        fill="rgba(255,255,255,0.06)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
      />

      {/* ── CENTRAL AMERICA / CARIBBEAN stub ── */}
      <path
        d="M 185 255 L 195 270 L 200 285 L 190 290 L 178 278 L 172 265 Z"
        fill="rgba(255,255,255,0.06)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
      />

      {/* ── SOUTH AMERICA ── */}
      <path
        d="M 200 290
           L 230 285 L 260 295 L 275 320
           L 280 355 L 270 390 L 255 420
           L 235 445 L 215 450 L 200 440
           L 185 415 L 175 385 L 170 350
           L 172 315 L 182 298 Z"
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.2"
      />

      {/* ── EUROPE ── */}
      <path
        d="M 420 60
           L 460 55 L 500 58 L 530 70
           L 545 90 L 540 115 L 520 130
           L 495 140 L 470 145 L 450 138
           L 430 125 L 415 105 L 410 82 Z"
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.2"
      />
      {/* Iberia */}
      <path
        d="M 415 120 L 435 115 L 445 130 L 438 148 L 418 150 L 408 137 Z"
        fill="rgba(255,255,255,0.06)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
      />
      {/* Scandinavia */}
      <path
        d="M 460 40 L 480 30 L 510 35 L 515 55 L 495 60 L 465 58 Z"
        fill="rgba(255,255,255,0.06)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
      />

      {/* ── AFRICA ── */}
      <path
        d="M 430 165
           L 470 158 L 510 160 L 545 175
           L 565 205 L 570 240 L 560 275
           L 545 310 L 525 340 L 505 365
           L 485 378 L 465 372 L 445 350
           L 425 320 L 410 285 L 405 248
           L 408 210 L 418 185 Z"
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.2"
      />
      {/* Madagascar */}
      <path
        d="M 572 285 L 582 278 L 590 295 L 585 320 L 572 325 L 565 308 Z"
        fill="rgba(255,255,255,0.06)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
      />

      {/* ── MIDDLE EAST / ARABIAN PENINSULA ── */}
      <path
        d="M 545 165
           L 575 160 L 610 165 L 625 185
           L 620 210 L 605 225 L 580 228
           L 555 218 L 542 198 Z"
        fill="rgba(255,255,255,0.07)"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
      />

      {/* ── RUSSIA / CENTRAL ASIA (top band) ── */}
      <path
        d="M 530 40
           L 620 30 L 720 28 L 820 32
           L 900 40 L 940 55 L 930 80
           L 870 90 L 800 95 L 720 90
           L 640 88 L 570 85 L 530 75 Z"
        fill="rgba(255,255,255,0.06)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
      />

      {/* ── SOUTH ASIA (India) ── */}
      <path
        d="M 630 155
           L 670 148 L 700 158 L 715 180
           L 710 210 L 690 235 L 665 248
           L 645 240 L 628 218 L 622 190 Z"
        fill="rgba(255,255,255,0.07)"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
      />

      {/* ── EAST ASIA (China / Korea / Japan) ── */}
      <path
        d="M 715 80
           L 780 75 L 840 82 L 870 100
           L 865 130 L 840 150 L 800 158
           L 760 155 L 725 140 L 708 115 Z"
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.2"
      />
      {/* Japan */}
      <path
        d="M 875 95 L 892 88 L 905 100 L 898 120 L 880 125 L 868 112 Z"
        fill="rgba(255,255,255,0.06)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
      />

      {/* ── SE ASIA ── */}
      <path
        d="M 740 160
           L 775 155 L 800 165 L 810 185
           L 800 205 L 775 215 L 750 208
           L 732 190 Z"
        fill="rgba(255,255,255,0.06)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
      />

      {/* ── AUSTRALIA ── */}
      <path
        d="M 760 310
           L 810 300 L 860 305 L 890 325
           L 900 355 L 885 385 L 855 400
           L 810 405 L 770 395 L 748 370
           L 745 340 Z"
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.2"
      />
      {/* New Zealand */}
      <path
        d="M 920 360 L 932 352 L 940 365 L 932 380 L 918 375 Z"
        fill="rgba(255,255,255,0.05)"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth="1"
      />

      {/* ── DYNAMIC RED HOTSPOT ── */}
      {/* outer pulse ring */}
      <circle
        className="nt-pulse1"
        cx={dot.cx}
        cy={dot.cy}
        r="7"
        fill="none"
        stroke="rgba(220, 0, 0, 0.85)"
        strokeWidth="1.5"
      />
      {/* second ring, offset timing */}
      <circle
        className="nt-pulse2"
        cx={dot.cx}
        cy={dot.cy}
        r="5"
        fill="none"
        stroke="rgba(255, 60, 60, 0.7)"
        strokeWidth="1"
      />
      {/* solid core dot */}
      <circle cx={dot.cx} cy={dot.cy} r="4" fill="rgba(220, 0, 0, 0.95)" />
    </svg>
  );
}

function openFull(item) {
  const url = item?.source_url || item?.sourceUrl || item?.url;
  if (url) window.open(url, "_blank", "noopener,noreferrer");
}

export default function HeroSplit({ items = [], loading }) {
  const list = useMemo(
    () => (items || []).filter(Boolean).slice(0, 8),
    [items],
  );

  const leftItem = useMemo(() => list[0] || null, [list]);
  const rightItems = useMemo(() => list.slice(1, 6), [list]);

  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(false);

  const touchStartX = useRef(null);
  const intervalRef = useRef(null);

  const startAuto = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!rightItems.length) return;

    intervalRef.current = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setIdx((prev) => (prev + 1) % rightItems.length);
        setFade(false);
      }, 220);
    }, 3000);
  };

  useEffect(() => {
    startAuto();
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rightItems.length]);

  const active = rightItems[idx] || null;
  const region = getRegionLabel(active);

  const onDot = (i) => {
    clearInterval(intervalRef.current);
    setFade(true);
    setTimeout(() => {
      setIdx(i);
      setFade(false);
      startAuto();
    }, 160);
  };

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(dx) < 45) return;

    clearInterval(intervalRef.current);
    setFade(true);
    setTimeout(() => {
      if (dx < 0) setIdx((p) => (p + 1) % rightItems.length);
      else setIdx((p) => (p - 1 + rightItems.length) % rightItems.length);
      setFade(false);
      startAuto();
    }, 160);
  };

  const onMouseEnter = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const onMouseLeave = () => {
    startAuto();
  };

  return (
    <section className="heroWrap" style={wrap}>
      {/* LEFT: Big breaking story */}
      <div style={left}>
        <div style={leftBody}>
          <h2 style={leftTitle}>
            {loading ? "Loading..." : leftItem?.headline || "No headline yet"}
          </h2>
          <p style={leftSnippet}>
            {leftItem?.summary
              ? trim(leftItem.summary, 260)
              : "Developing story — click to read the full article."}
          </p>

          <button
            style={leftBtn}
            onClick={() => openFull(leftItem)}
            disabled={!leftItem}
          >
            Read Full Article →
          </button>
        </div>
      </div>

      {/* RIGHT: dark signal console with world map */}
      <div
        style={right}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        aria-label="Featured stories carousel"
      >
        <button
          style={heroClickable}
          onClick={() => openFull(active)}
          disabled={!active}
          aria-label="Open full article"
        >
          {/* background layers */}
          <div style={bgBase} />

          {/* text overlay */}
          <div style={{ ...rightText, ...(fade ? fadeOut : fadeIn) }}>
            <div style={rightKicker}>{region.toUpperCase()}</div>
            <div style={rightHeadline}>{active?.headline || "—"}</div>

            <div style={intelligenceBlock}>
              <div style={intelLabel}>Signal Assessment</div>
              <div style={intelSummary}>{generateIntelLine(active)}</div>
            </div>
          </div>
        </button>

        {/* nav dots */}
        <div style={dots}>
          {rightItems.map((_, i) => (
            <button
              key={i}
              onClick={() => onDot(i)}
              style={{ ...dot, opacity: i === idx ? 1 : 0.35 }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <div style={hint}>...</div>
      </div>

      <style jsx>{`
        .heroWrap {
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: 14px;
          margin-bottom: 22px;
        }

        @media (max-width: 900px) {
          .heroWrap {
            grid-template-columns: 1fr;
          }
        }

        /* slow drift for the map */
        @keyframes ntDrift {
          0% {
            transform: translate(0px, 0px) scale(1.02);
          }
          50% {
            transform: translate(6px, -4px) scale(1.02);
          }
          100% {
            transform: translate(0px, 0px) scale(1.02);
          }
        }
      `}</style>
    </section>
  );
}

function trim(t, n) {
  if (!t) return "";
  return t.length > n ? t.slice(0, n).trim() + "…" : t;
}

/* ─────────────────────────────
   STYLES
───────────────────────────── */

const wrap = { gap: 14, marginBottom: 22 };

const left = {
  border: "1px solid #eee",
  borderRadius: 14,
  padding: 16,
  background: "#fff",
  minHeight: 260,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const leftBody = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
  maxWidth: 520,
};

const leftTitle = {
  fontSize: 22,
  fontWeight: 900,
  lineHeight: 1.15,
  margin: "6px 0 10px",
};

const leftSnippet = {
  color: "#444",
  lineHeight: 1.5,
  margin: "0 0 14px",
};

const leftBtn = {
  border: "1px solid #111",
  background: "#111",
  color: "#fff",
  fontWeight: 800,
  padding: "10px 18px",
  borderRadius: 10,
  cursor: "pointer",
  marginTop: "auto",
  alignSelf: "flex-start",
};

const right = {
  position: "relative",
  borderRadius: 14,
  overflow: "hidden",
  minHeight: 260,
  border: "1px solid #1a1a2e",
  background: "#0B1120",
};

const heroClickable = {
  all: "unset",
  cursor: "pointer",
  display: "block",
  width: "100%",
  height: "100%",
  position: "relative",
};

const bgBase = {
  position: "absolute",
  inset: 0,
  backgroundImage: "url('/banners/world.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

const bgStreak = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.06) 52%, transparent 64%)",
  opacity: 0.25,
  mixBlendMode: "screen",
};

const mapDriftWrap = {
  position: "absolute",
  inset: 0,
  animation: "ntDrift 22s ease-in-out infinite",
  pointerEvents: "none",
};

const mapOpacityWrap = {
  position: "absolute",
  inset: 0,
  opacity: 0.14, // slightly more visible than before (was 0.06)
};

const rightText = {
  position: "absolute",
  left: 16,
  right: 16,
  bottom: 18,
  color: "#fff",
  zIndex: 2,
};

const rightKicker = {
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: 0.8,
  opacity: 0.9,
  marginBottom: 6,
  color: "#ff4444",
};

const rightHeadline = {
  fontSize: 24,
  fontWeight: 900,
  lineHeight: 1.15,
};

const fadeIn = {
  opacity: 1,
  transform: "translateY(0px)",
  transition: "opacity 220ms ease, transform 220ms ease",
};

const fadeOut = {
  opacity: 0,
  transform: "translateY(6px)",
  transition: "opacity 220ms ease, transform 220ms ease",
};

const dots = {
  position: "absolute",
  right: 14,
  bottom: 14,
  display: "flex",
  gap: 7,
  zIndex: 3,
};

const dot = {
  width: 9,
  height: 9,
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,.8)",
  background: "rgba(255,255,255,.85)",
  cursor: "pointer",
};

const hint = {
  position: "absolute",
  left: 14,
  top: 12,
  color: "rgba(255,255,255,.75)",
  fontSize: 12,
  fontWeight: 700,
};

const intelligenceBlock = {
  marginTop: 14,
  paddingTop: 12,
  borderTop: "1px solid rgba(255,255,255,0.15)",
};

const intelLabel = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: 1,
  opacity: 0.7,
  marginBottom: 6,
};

const intelSummary = {
  fontSize: 13,
  lineHeight: 1.4,
  opacity: 0.92,
};
