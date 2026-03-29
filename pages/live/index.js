import TopNav from "../../components/TopNav";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API;

export default function LivePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/posts`)
      .then((r) => r.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <TopNav
        active="/live"
        logoImg={<img src="/logo.png" style={{ height: 28 }} />}
      />

      <div style={container}>
                
        {loading && <div style={empty}>Loading reports...</div>}

        {!loading && posts.length === 0 && (
          <div style={empty}>
            <h2 style={{ marginBottom: 8, fontSize: 18, fontWeight: 800 }}>
              No live reports from independent journalists at this time.
            </h2>
            <p style={{ color: "#6b7280", fontSize: 14 }}>
              Please check back later for verified live coverage from our global
              network of independent reporters.
            </p>
          </div>
        )}

        <div style={grid}>
          {posts.map((post) => (
            <div key={post.id} style={card}>
              <div
                style={
                  post.source_name === "NewsTrac AI" ? aiTag : journalistTag
                }
              >
                {post.source_name === "NewsTrac AI"
                  ? "NewsTrac AI"
                  : post.source_name || "Independent Journalist"}
              </div>
              <h2 style={cardTitle}>{post.headline}</h2>
              <p style={cardBody}>{post.description}</p>
              <div style={cardMeta}>
                {new Date(post.created_at).toLocaleString("en-GB", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" · "}
                {post.views || 0} views
              </div>
            </div>
          ))}
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
  marginBottom: "6px",
  letterSpacing: "-0.3px",
};

const subtitle = {
  fontSize: 14,
  color: "#6b7280",
  marginBottom: 32,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
  gap: 20,
};

const card = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 20,
  background: "#fff",
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const aiTag = {
  fontSize: 11,
  fontWeight: 800,
  color: "#c40000",
  letterSpacing: "0.8px",
  textTransform: "uppercase",
};

const journalistTag = {
  fontSize: 11,
  fontWeight: 800,
  color: "#0369a1",
  letterSpacing: "0.8px",
  textTransform: "uppercase",
};

const cardTitle = {
  fontSize: 18,
  fontWeight: 800,
  lineHeight: 1.3,
  margin: 0,
  color: "#111",
};

const cardBody = {
  fontSize: 14,
  lineHeight: 1.7,
  color: "#444",
  margin: 0,
};

const cardMeta = {
  fontSize: 12,
  color: "#9ca3af",
  marginTop: "auto",
};

const empty = {
  padding: "20px",
  borderRadius: "6px",
  border: "1px solid #e5e7eb",
  background: "#f9fafb",
};
