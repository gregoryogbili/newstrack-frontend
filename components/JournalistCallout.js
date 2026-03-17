import Link from "next/link";

export default function JournalistCallout() {
  return (
    <section style={wrap}>
      <div
        style={{
          width: 30,
          height: 3,
          background: "#dc2626",
          margin: "0 auto 14px",
          borderRadius: 2,
        }}
      />

      <h2 style={title}>Are You an Independent Journalist?</h2>
      <p style={copy}>
        Publish verified stories on NewsTrac
        <br />
        Earn revenue | No editorial gatekeeping | No bias | Pure visibility
      </p>

      <Link href="/login" style={btn}>
        Submit Your Story
      </Link>
    </section>
  );
}

const wrap = {
  marginTop: 34,
  marginBottom: 40,
  borderRadius: 6,
  padding: "28px 20px",
  background: "#0B1120",
  border: "1px solid #1f2937",
  textAlign: "center",
  color: "#ffffff",
};

const title = {
  margin: 0,
  fontSize: 24,
  fontWeight: 900,
  letterSpacing: "-0.3px",
};

const copy = {
  marginTop: 10,
  marginBottom: 16,
  color: "rgba(255,255,255,0.75)",
  lineHeight: 1.5,
  fontSize: 14,
};

const btn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: 36,
  padding: "0 16px",
  borderRadius: 6,
  background: "#dc2626",
  color: "#ffffff",
  fontWeight: 800,
  fontSize: 14,
  border: "none",
  cursor: "pointer",
  textDecoration: "none",   // remove underline
};
