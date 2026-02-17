import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE;

export default function Feed() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFeed() {
      try {
        const res = await fetch(`${API}/feed`);
        if (!res.ok) throw new Error("Failed to load feed");

        const data = await res.json();
        setArticles(data);
      } catch (err) {
        setError("Could not load news.");
      } finally {
        setLoading(false);
      }
    }

    loadFeed();
  }, []);

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", padding: 20 }}>
      <h1 style={{ marginBottom: 30 }}>Latest News</h1>

      {loading && <p>Loading news...</p>}
      {error && <p>{error}</p>}

      {articles.map((article) => (
        <div
          key={article.id}
          style={{
            border: "1px solid #eee",
            padding: 20,
            marginBottom: 20,
            borderRadius: 12,
            background: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          }}
        >
          <h3>{article.headline}</h3>
          <p style={{ color: "#555" }}>{article.summary}</p>
          <small style={{ color: "#999" }}>
            {article.source_name}
          </small>
        </div>
      ))}
    </div>
  );
}
