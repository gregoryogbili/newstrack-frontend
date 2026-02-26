import TopNav from "../components/TopNav";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

const API = process.env.NEXT_PUBLIC_API;

function money(n) {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(Number(n));
}

export default function Dashboard() {
  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);

  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [journalistId, setJournalistId] = useState("");
  const [journalistPosts, setJournalistPosts] = useState([]);

  const [metrics, setMetrics] = useState(null);

  const [tab, setTab] = useState("overview"); // swissknife tabs
  const [error, setError] = useState("");

  const [headline, setHeadline] = useState("");
  const [content, setContent] = useState("");
  const [postMessage, setPostMessage] = useState("");

  async function submitPost() {
    if (!headline || !content) {
      setPostMessage("Headline and content are required.");
      return;
    }

    try {
      const res = await fetch(`${API}/journalists/${journalistId}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          headline,
          content,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to publish");
      }

      setPostMessage("Story published successfully.");
      setHeadline("");
      setContent("");
      loadJournalistPosts();
    } catch (err) {
      setPostMessage(err.message);
    }
  }

  async function loadMetrics() {
    if (!journalistId) return;

    const data = await safeFetchJson(
      `${API}/journalists/${journalistId}/metrics`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    setMetrics(data);
  }

  // responsive
  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < 768);
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // protect route
  useEffect(() => {
    if (!router.isReady) return;

    const savedToken = localStorage.getItem("newstrack_token");

    if (!savedToken) {
      router.replace("/login");
      return;
    }

    setToken(savedToken);
    fetchMe(savedToken);
  }, [router.isReady]);

  async function fetchMe(jwtToken) {
    try {
      const res = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      if (!res.ok) throw new Error("Session expired");

      const data = await res.json();
      setCurrentUser(data.user);
      setJournalistId(String(data.user.id));
    } catch {
      logout();
    }
  }

  function logout() {
    localStorage.removeItem("newstrack_token");
    router.push("/login");
  }

  async function safeFetchJson(url, options) {
    setError("");
    try {
      const res = await fetch(url, options);
      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      if (!res.ok) {
        throw new Error(
          typeof data === "string" ? data : data.error || "Request failed",
        );
      }

      return data;
    } catch (e) {
      setError(e.message || "Something went wrong");
      throw e;
    }
  }

  async function loadJournalistPosts() {
    if (!journalistId) return;
    try {
      const data = await safeFetchJson(
        `${API}/journalists/${journalistId}/posts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setJournalistPosts(data);
    } catch {
      setJournalistPosts([]);
    }
  }

  async function loadMetrics() {
    if (!journalistId) return;

    const data = await safeFetchJson(
      `${API}/journalists/${journalistId}/metrics`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    setMetrics(data);
  }

  useEffect(() => {
    if (!API) return;
    if (!journalistId) return;

    loadJournalistPosts();
    loadMetrics();
  }, [journalistId]);

  return (
    <>
      <TopNav active="/dashboard" />

      <div style={{ ...page, padding: isMobile ? 12 : 20 }}>
        <div style={topRow}>
          <div>
            <h1 style={{ margin: 0 }}>Dashboard</h1>
            {currentUser && (
              <div style={{ marginTop: 6, opacity: 0.75 }}>
                Welcome, <strong>{currentUser.name}</strong>
              </div>
            )}
          </div>

          <button onClick={logout} style={btnGhost}>
            Logout
          </button>
        </div>

        {/* Swissknife Tabs */}
        <div style={tabs}>
          <TabButton
            active={tab === "overview"}
            onClick={() => setTab("overview")}
          >
            Overview
          </TabButton>
          <TabButton active={tab === "posts"} onClick={() => setTab("posts")}>
            My Posts
          </TabButton>
          <TabButton
            active={tab === "revenue"}
            onClick={() => setTab("revenue")}
          >
            Revenue
          </TabButton>
          <TabButton active={tab === "create"} onClick={() => setTab("create")}>
            Create Post
          </TabButton>

          <TabButton active={tab === "tools"} onClick={() => setTab("tools")}>
            Tools
          </TabButton>
        </div>

        {/* Content */}
        {tab === "overview" && (
          <div style={grid(isMobile)}>
            <section style={panel}>
              <h2 style={{ ...h2, color: "#b80000" }}>Quick Status</h2>

              {!currentUser ? (
                <div style={{ opacity: 0.7 }}>Loading profile...</div>
              ) : (
                <div style={{ opacity: 0.85, lineHeight: 1.7 }}>
                  <div>Role: Journalist</div>
                  <div>
                    Total Posts:{" "}
                    <strong>{metrics ? metrics.total_posts : "..."}</strong>
                  </div>
                  <div>
                    Total Views:{" "}
                    <strong>{metrics ? metrics.total_views : "..."}</strong>
                  </div>
                  <div>
                    Estimated Earnings:{" "}
                    <strong>
                      {metrics
                        ? `£${Number(metrics.estimated_earnings_gbp).toFixed(2)}`
                        : "..."}
                    </strong>
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.75 }}>
                    RPM: {metrics ? `£${metrics.rpm_gbp}/1,000 views` : "..."}
                  </div>
                </div>
              )}
            </section>

            <section style={panel}>
              <h2 style={{ ...h2, color: "#b80000" }}>Next Actions</h2>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: 18,
                  opacity: 0.85,
                  lineHeight: 1.8,
                }}
              >
                <li>Create first verified post</li>
                <li>Apply to be featured on LIVE</li>
                <li>Build your audience profile</li>
              </ul>
            </section>
          </div>
        )}

        {tab === "posts" && (
          <section style={panel}>
            <div style={panelHeader}>
              <h2 style={h2}>Your Posts</h2>
              <button style={btn} onClick={loadJournalistPosts}>
                Refresh
              </button>
            </div>

            {journalistPosts.length === 0 ? (
              <div style={{ opacity: 0.75 }}>No posts yet.</div>
            ) : (
              journalistPosts.map((p) => (
                <div key={p.id} style={card}>
                  <a
                    href={`/posts/${p.id}`}
                    style={{ color: "#111", textDecoration: "underline" }}
                  >
                    <strong>{p.headline}</strong>
                  </a>
                </div>
              ))
            )}
          </section>
        )}

        <div style={{ lineHeight: 1.9 }}>
          <div>
            <strong>Total Views:</strong> {metrics.total_views}
          </div>
          <div>
            <strong>RPM:</strong> £{metrics.rpm_gbp} per 1,000 views
          </div>
          <div>
            <strong>Estimated Earnings:</strong> £
            {Number(metrics.estimated_earnings_gbp).toFixed(2)}
          </div>

          <div style={{ marginTop: 10, fontSize: 13, opacity: 0.75 }}>
            Formula: (views ÷ 1000) × RPM
          </div>
        </div>

        {tab === "tools" && (
          <section style={panel}>
            <h2 style={{ ...h2, color: "#b80000" }}>Tools</h2>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                style={btnPrimary}
                onClick={() => window.open("/tools/imageforge.html", "_blank")}
              >
                Open Image Resizer
              </button>
            </div>

            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 10 }}>
                Embedded tool (from <code>/public/tools/imageforge.html</code>)
              </div>

              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 16,
                  overflow: "hidden",
                }}
              >
                <iframe
                  src="/tools/imageforge.html"
                  title="Image Resizer"
                  style={{
                    width: "100%",
                    height: "1300px",
                    border: "0",
                  }}
                />
              </div>
            </div>
          </section>
        )}

        {tab === "create" && (
          <section style={panelWhite}>
            <h2 style={h2Dark}>Create New Story</h2>

            <label style={labelDark}>Headline</label>
            <input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              style={inputWhite}
              placeholder="Enter headline"
            />

            <label style={labelDark}>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={textareaWhite}
              placeholder="Write your full story here..."
            />

            <button onClick={submitPost} style={btnPrimary}>
              Publish Story
            </button>

            {postMessage && <div style={successBox}>{postMessage}</div>}
          </section>
        )}

        {error && <div style={errorBox}>{error}</div>}
      </div>
    </>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{ ...tabBtn, ...(active ? tabBtnActive : {}) }}
    >
      {children}
    </button>
  );
}

/* styles */

const page = {
  maxWidth: 1100,
  margin: "0 auto",
  fontFamily: "system-ui, Arial",
  background: "#ffffff",
  color: "#111",
};

const topRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: 18,
  marginBottom: 18,
};

const tabs = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginBottom: 18,
};

const tabBtn = {
  padding: "10px 14px",
  borderRadius: 999,
  border: "1px solid #ddd",
  background: "#ffffff",
  color: "#111",
  cursor: "pointer",
};

const tabBtnActive = {
  border: "1px solid #b80000",
  background: "#ffeaea",
  color: "#b80000",
};

const panel = {
  border: "1px solid #e5e5e5",
  borderRadius: 16,
  padding: 16,
  background: "#f7f7f7",
  color: "#111",
};

const panelHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 10,
  marginBottom: 10,
};

const h2 = { marginTop: 0, marginBottom: 10, fontSize: 18 };

const label = {
  display: "block",
  marginTop: 10,
  marginBottom: 6,
  opacity: 0.8,
};

const input = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid #ccc",
  background: "#ffffff",
  color: "#111",
  width: "100%",
  outline: "none",
  marginBottom: 10,
};

const btn = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "none",
  background: "rgba(0,200,255,0.95)",
  color: "#001018",
  fontWeight: 700,
  cursor: "pointer",
};

const btnGhost = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.03)",
  color: "#fff",
  cursor: "pointer",
};

const card = {
  border: "1px solid rgba(255,255,255,0.10)",
  padding: 12,
  marginBottom: 10,
  borderRadius: 14,
  background: "rgba(0,0,0,0.25)",
};

const errorBox = {
  marginTop: 18,
  padding: 12,
  borderRadius: 12,
  border: "1px solid #ffcccc",
  background: "#ffeaea",
  color: "#b80000",
};

const grid = (isMobile) => ({
  display: "grid",
  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
  gap: 16,
});

const panelWhite = {
  background: "#ffffff",
  border: "1px solid #e2e2e2",
  borderRadius: 12,
  padding: 20,
  color: "#111",
};

const h2Dark = {
  marginTop: 0,
  color: "#111",
};

const labelDark = {
  display: "block",
  marginTop: 12,
  marginBottom: 6,
  color: "#333",
  fontWeight: 600,
};

const inputWhite = {
  width: "100%",
  padding: 12,
  borderRadius: 8,
  border: "1px solid #ccc",
  marginBottom: 12,
};

const textareaWhite = {
  width: "100%",
  minHeight: 180,
  padding: 12,
  borderRadius: 8,
  border: "1px solid #ccc",
  marginBottom: 12,
};

const btnPrimary = {
  padding: "12px 18px",
  borderRadius: 8,
  border: "none",
  background: "#b80000",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const successBox = {
  marginTop: 12,
  padding: 10,
  borderRadius: 8,
  background: "#f3f3f3",
  color: "#111",
};
