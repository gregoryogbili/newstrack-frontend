import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE;

export default function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${API}/posts`)
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(() => {});
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>
      <h1>Latest News</h1>
      {posts.map(post => (
        <div key={post.id} style={card}>
          <h3>{post.headline}</h3>
          <p>{post.description}</p>
        </div>
      ))}
    </div>
  );
}

const card = {
  border: "1px solid #eee",
  padding: 16,
  borderRadius: 12,
  marginBottom: 16
};
