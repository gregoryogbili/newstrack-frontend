import TopNav from "../../components/TopNav";
import Link from "next/link";

export default function LivePage() {
  return (
    <>
      <TopNav active="/live" />

      <div style={container}>
        <h1 style={title}>LIVE — Independent Journalism</h1>

        <div style={noticeBox}>
          <h2 style={{ marginBottom: 10 }}>
            No live reports from independent journalists at this time.
          </h2>
          <p style={{ opacity: 0.75 }}>
            Please check back later for verified live coverage from our global
            network of independent reporters.
          </p>
        </div>

        <div style={callOutBox}>
          <h2>📣 Are You an Independent Journalist?</h2>
          <p style={{ marginTop: 12, opacity: 0.85 }}>
            NewsTrac is building a global network of courageous, accountable,
            and fiercely independent journalists.
          </p>

          <ul style={{ marginTop: 15, lineHeight: 1.8 }}>
            <li>✔ Earn revenue tied to views</li>
            <li>✔ No editorial gatekeeping</li>
            <li>✔ Algorithmic transparency</li>
            <li>✔ Your work is ranked by merit, not politics</li>
          </ul>

          <Link href="/login" style={applyButton}>
            Join NewsTrac
          </Link>
        </div>
      </div>
    </>
  );
}

const container = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "80px 20px",
  minHeight: "100vh",
  background: "#0c0f14",
  color: "#fff",
};

const title = {
  fontSize: "32px",
  marginBottom: "40px",
};

const noticeBox = {
  background: "rgba(255,255,255,0.05)",
  padding: "40px",
  borderRadius: "12px",
  marginBottom: "50px",
  border: "1px solid rgba(255,255,255,0.08)",
};

const callOutBox = {
  background: "linear-gradient(135deg, #10151d, #0d1117)",
  padding: "50px",
  borderRadius: "16px",
  border: "1px solid rgba(196,0,0,0.35)",
};

const applyButton = {
  marginTop: "25px",
  padding: "14px 28px",
  background: "#c40000",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer",
  textDecoration: "none",
};
