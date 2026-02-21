import { useEffect, useState } from "react";
import Head from "next/head";

const API = process.env.NEXT_PUBLIC_API;

export default function SignalsPage() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/signals`)
      .then(res => res.json())
      .then(data => {
        setSignals(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Signals | NewsTrac</title>
      </Head>

      <div style={container}>
        <h1 style={title}>Live Signal Monitor</h1>
        <p style={subtitle}>
          Real-time public narrative acceleration layer.
        </p>

        {loading && <div style={loadingStyle}>Loading signals…</div>}

        {!loading && signals.length === 0 && (
          <div style={emptyStyle}>No recent signal activity.</div>
        )}

        {!loading && signals.map((item, i) => (
          <div key={i} style={card}>
            <div style={headline}>{item.headline}</div>
            <div style={meta}>
              {item.source_name} ·{" "}
              {new Date(item.published_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ===========================
   STYLES
=========================== */

const container = {
  maxWidth: 900,
  margin: "0 auto",
  padding: "60px 20px",
};

const title = {
  fontSize: 36,
  fontWeight: 700,
  marginBottom: 10,
};

const subtitle = {
  color: "#666",
  marginBottom: 40,
};

const loadingStyle = {
  opacity: 0.7,
};

const emptyStyle = {
  opacity: 0.5,
};

const card = {
  borderBottom: "1px solid #eee",
  padding: "18px 0",
};

const headline = {
  fontSize: 18,
  fontWeight: 600,
  marginBottom: 6,
};

const meta = {
  fontSize: 13,
  color: "#777",
};