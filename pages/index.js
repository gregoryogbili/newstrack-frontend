import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE;

export default function Home() {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    fetch(`${API}/feed`)
      .then(res => res.json())
      .then(data => setFeed(data))
      .catch(err => console.error(err));
  }, []);

  const breaking = feed.filter(a => a.feed_bucket === "breaking");
  const published = feed.filter(a => a.feed_bucket === "published");
  const background = feed.filter(a => a.feed_bucket === "background");

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 20 }}>
      <h1>NewsTrack</h1>

      <h2>🔴 Breaking</h2>
      {breaking.slice(0,3).map(a => (
        <div key={a.id} style={cardLarge}>
          <h3>{a.headline}</h3>
          <p>{a.summary}</p>
        </div>
      ))}

      <h2>📰 Latest</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {published.slice(0,6).map(a => (
          <div key={a.id} style={card}>
            <strong>{a.headline}</strong>
            <div>{a.source_name}</div>
          </div>
        ))}
      </div>

      <h2>📚 Background</h2>
      {background.slice(0,5).map(a => (
        <div key={a.id} style={cardSmall}>
          {a.headline}
        </div>
      ))}
    </div>
  );
}

const card = {
  border: "1px solid #eee",
  padding: 12,
  borderRadius: 12
};

const cardLarge = {
  border: "1px solid #ddd",
  padding: 16,
  marginBottom: 16,
  borderRadius: 14
};

const cardSmall = {
  padding: 8,
  borderBottom: "1px solid #eee"
};
