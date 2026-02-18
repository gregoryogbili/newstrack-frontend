import Link from "next/link";

export default function JournalistCallout() {
  return (
    <section style={wrap}>
      <h2 style={title}>Are You a Journalist?</h2>
      <p style={copy}>
        Publish your stories on Newstrac and earn shared advert revenue.<br />
        No editorial bias. Just AI-ranked visibility.
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
  background: "#f3f3f3",
  textAlign: "center"
};

const title = {
  margin: 0,
  fontSize: 26,
  fontWeight: 900
};

const copy = {
  marginTop: 12,
  marginBottom: 18,
  color: "#333",
  fontWeight: 600,
  lineHeight: 1.7
};

const btn = {
  display: "inline-block",
  textDecoration: "none",
  background: "#111",
  color: "#fff",
  fontWeight: 900,
  padding: "12px 18px",
  borderRadius: 12
};
