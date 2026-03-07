export default function SiteFooter() {
  return (
    <footer style={footer}>
      {/* Top Row */}
      <div style={topRow}>
        {/* Brand */}
        <div style={brand}>NewsTrac</div>

        {/* Links */}
        <div style={links}>
          <a style={linkStyle} href="/terms">
            Terms
          </a>
          <a style={linkStyle} href="/privacy">
            Privacy
          </a>
          <a style={linkStyle} href="/cookies">
            Cookies
          </a>
          <a style={linkStyle} href="/editorial">
            Editorial
          </a>
          <a style={linkStyle} href="/ai-transparency">
            AI Transparency
          </a>
        </div>
      </div>

      {/* Divider */}
      <div style={divider}></div>

      {/* Bottom Row */}
      <div style={bottomRow}>
        <div>
          © {new Date().getFullYear()} NewsTrac
          <span style={{ opacity: 0.6 }}> — GENŌ INTELLIGENTIA LIMITED</span>
        </div>

        <div style={tagline}>AI-assisted news intelligence platform</div>
      </div>
    </footer>
  );
}

/* ========================= */
/* STYLES */
/* ========================= */

const footer = {
  marginTop: 80,
  borderTop: "1px solid #e5e5e5",
  padding: "28px 20px",
  maxWidth: 1200,
  marginLeft: "auto",
  marginRight: "auto",
  fontSize: 14,
  color: "#444",
};

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 20,
};

const brand = {
  fontWeight: 800,
  fontSize: 18,
  letterSpacing: 0.4,
};

const links = {
  display: "flex",
  gap: 18,
  flexWrap: "wrap",
};

const linkStyle = {
  color: "#cc0000",
  textDecoration: "none",
  fontWeight: 600,
};

const divider = {
  height: 1,
  background: "#eee",
  margin: "18px 0",
};

const bottomRow = {
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 10,
  fontSize: 13,
  color: "#666",
};

const tagline = {
  opacity: 0.7,
};
