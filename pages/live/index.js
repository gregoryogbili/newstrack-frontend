import TopNav from "../../components/TopNav";

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
            Please check back later for verified live coverage from our
            global network of independent reporters.
          </p>
        </div>

        <div style={callOutBox}>
          <h2>📣 Are You an Independent Journalist?</h2>
          <p style={{ marginTop: 12, opacity: 0.85 }}>
            NewsTrac is building a global network of courageous, accountable, and fiercely independent
            journalists.
          </p>

          <ul style={{ marginTop: 15, lineHeight: 1.8 }}>
            <li>✔ Earn revenue tied to views</li>
            <li>✔ No editorial gatekeeping</li>
            <li>✔ Algorithmic transparency</li>
            <li>✔ Your work is ranked by merit, not politics</li>
          </ul>

          <button style={applyButton}>
            Join NewsTrac
          </button>
        </div>
      </div>
    </>
  );
}

const container = {
  padding: "80px 8%",
  background: "#0c0f14",
  minHeight: "100vh",
  color: "#fff"
};

const title = {
  fontSize: "32px",
  marginBottom: "40px"
};

const noticeBox = {
  background: "rgba(255,255,255,0.05)",
  padding: "40px",
  borderRadius: "12px",
  marginBottom: "50px",
  border: "1px solid rgba(255,255,255,0.08)"
};

const callOutBox = {
  background: "linear-gradient(135deg, #10151d, #0d1117)",
  padding: "50px",
  borderRadius: "16px",
  border: "1px solid rgba(0,200,255,0.25)"
};

const applyButton = {
  marginTop: "25px",
  padding: "14px 28px",
  background: "rgba(0,200,255,0.9)",
  color: "#000",
  border: "none",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer"
};