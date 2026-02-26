import TopNav from "../../components/TopNav";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API;

export default function PostDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!id) return;

    // 1) increment views (fire-and-forget)
    fetch(`${API}/posts/${id}/view`, { method: "POST" }).catch(() => {});

    // 2) load post (you must have GET /posts/:id in backend; if not, we add it next)
    fetch(`${API}/posts/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.error) throw new Error(data.error);
        setPost(data);
      })
      .catch((e) => setErr(e.message));
  }, [id]);

  return (
    <div>
      <TopNav active="/dashboard" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 22 }}>
        {err && <div style={{ color: "#b80000" }}>{err}</div>}

        {!post ? (
          <div style={{ opacity: 0.75 }}>Loading...</div>
        ) : (
          <>
            <h1 style={{ marginBottom: 6 }}>{post.headline}</h1>
            <div style={{ opacity: 0.75, marginBottom: 18 }}>
              Views: {post.views ?? 0}
            </div>
            <div style={{ lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
              {post.description || post.content || ""}
            </div>
          </>
        )}
      </div>
    </div>
  );
}