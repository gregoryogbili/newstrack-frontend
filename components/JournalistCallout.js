import Link from "next/link";

export default function JournalistCallout() {
  return (
    <section style={wrap}>
      <h2 style={title}>Are You an Independent Journalist?</h2>
      <p style={copy}>
        Publish verified stories on NewsTrac.
        <br />
        Earn revenue. No editorial gatekeeping. AI-ranked visibility.
      </p>

      <Link href="/login" style={btn}>
        Submit Your Story →
      </Link>
    </section>
  );
}

const wrap = {
  marginTop: 34,
  marginBottom: 40,
  borderRadius: 16,
  padding: "40px 20px",
  background: "linear-gradient(135deg, #10151d, #0d1117)",
  border: "1px solid rgba(0,200,255,0.25)",
  textAlign: "center",
  color: "#fff"
};

const title = {
  margin: 0,
  fontSize: 26,
  fontWeight: 900
};

const copy = {
  marginTop: 12,
  marginBottom: 18,
  opacity: 0.85,
  lineHeight: 1.7
};

const btn = {
  display: "inline-block",
  textDecoration: "none",
  background: "rgba(0,200,255,0.9)",
  color: "#000",
  fontWeight: 900,
  padding: "12px 18px",
  borderRadius: 12
};