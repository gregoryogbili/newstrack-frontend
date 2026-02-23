import Link from "next/link";

/**
 * TopNav
 * - Reusable header across all pages
 * - Uses your existing logo image via `logoImg` prop (so “image stays same”)
 * - "News" black + "Trac" red text next to image
 * - Buttons styled like your old category buttons (symmetry)
 */
export default function TopNav({
  logoImg = null,
  active = "",
  rightSlot = null,
}) {
  const links = [
    { label: "Home", href: "/" },
    { label: "Regions", href: "/regions" },
    { label: "Intelligence", href: "/signals" },
    { label: "LIVE", href: "/live", isLive: true },
  ];

  return (
    <header style={wrap}>
      <div style={inner}>
        {/* Left: logo */}
        <Link href="/" style={brand}>
          <span style={logoBox}>
            {/* Keep your existing image exactly: pass it in from each page */}
            {logoImg ? logoImg : <span style={logoFallback} />}
          </span>

          <span style={brandText}>
            <span style={news}>News</span>
            <span style={trac}>Trac</span>
          </span>
        </Link>

        {/* Middle: nav buttons */}
        <nav style={nav}>
          {links.map((l) => {
            const isActive = active === l.href;
            const isLive = !!l.isLive;

            return (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  ...navBtn,
                  ...(isActive ? navBtnActive : null),
                  ...(isLive ? liveBtn : null),
                  ...(isLive && isActive ? liveBtnActive : null),
                }}
              >
                {l.label}
              </Link>
            );
          })}
          <style jsx>{`
            nav a:hover {
              background: #111;
              color: #fff !important;
              border-color: #111 !important;
            }
          `}</style>
        </nav>

        {/* Right: login + optional slot */}
        <div style={right}>
          {rightSlot}

          <Link href="/login" style={loginBtn}>
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ---------------- styles (matches your old category-button feel) ---------------- */

const wrap = {
  width: "100%",
  background: "#fff",
  marginBottom: 18,
};

const inner = {
  maxWidth: 1180,
  margin: "0 auto",
  padding: "18px 18px 10px",
  display: "grid",
  gridTemplateColumns: "1fr auto 1fr",
  alignItems: "center",
  gap: 14,
};

const brand = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  textDecoration: "none",
  color: "#111",
  justifySelf: "start",
};

const logoBox = {
  width: 34,
  height: 34,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const logoFallback = {
  width: 26,
  height: 26,
  borderRadius: 999,
  background: "#eee",
  border: "1px solid #ddd",
};

const brandText = {
  fontSize: 24,
  fontWeight: 900,
  letterSpacing: 0.2,
  lineHeight: 1,
  display: "inline-flex",
  alignItems: "baseline",
  gap: 0,
};

const news = { color: "#111" };
const trac = { color: "#b80000" };

const nav = {
  justifySelf: "center",
  display: "flex",
  gap: 12,
  alignItems: "center",
  flexWrap: "wrap",
};

const navBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: 36,
  minWidth: 120,
  padding: "0 18px",
  borderRadius: 8,
  border: "1px solid #d9d9d9",
  background: "transparent",
  color: "#111",
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 14,
  transition: "all 0.2s ease",
};

const navBtnActive = {
  border: "1px solid #111",
};

const liveBtn = {
  background: "#b80000",
  border: "1px solid #b80000",
  color: "#fff",
};

const liveBtnActive = {
  background: "#a70000",
  border: "1px solid #a70000",
};

const right = {
  justifySelf: "end",
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
};

const loginBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: 36,
  padding: "0 16px",
  borderRadius: 8,
  border: "1px solid #cfcfcf",
  background: "#fff",
  color: "#111",
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 14,
};
