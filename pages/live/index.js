import TopNav from "../../components/TopNav";
import Link from "next/link";

export default function LivePage() {
  return (
    <>
      <TopNav
        active="/live"
        logoImg={<img src="/logo.png" style={{ height: 28 }} />}
      />

      <div style={container}>
        <h1 style={title}>LIVE — Independent Journalism</h1>

        <div style={noticeBox}>
          <h2 style={{ marginBottom: 8, fontSize: 18, fontWeight: 800 }}>
            No live reports from independent journalists at this time.
          </h2>
          <p style={{ color: "#6b7280", fontSize: 14 }}>
            Please check back later for verified live coverage from our global
            network of independent reporters.
          </p>
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

const title = {
  fontSize: "22px",
  fontWeight: 900,
  marginBottom: "24px",
  letterSpacing: "-0.3px",
};

const noticeBox = {
  padding: "20px",
  borderRadius: "6px",
  marginBottom: "30px",
  border: "1px solid #e5e7eb",
  background: "#f9fafb",
};

const callOutBox = {
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
  padding: "40px",
  borderRadius: "12px",
  marginBottom: "50px",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
};

const applyButton = {
  marginTop: "40px",
  padding: "12px 22px",
  background: "#c40000",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer",
  textDecoration: "none",
};

const minimalCTA = {
  marginTop: 16,
  fontSize: 14,
  color: "#6b7280",
  lineHeight: 1.6,
};

const ctaLink = {
  display: "inline-block",
  marginTop: 6,
  color: "#dc2626",
  fontWeight: 700,
  textDecoration: "none",
};
