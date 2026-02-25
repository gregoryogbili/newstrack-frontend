import TopNav from "../components/TopNav";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE;

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

  const [totalRevenue, setTotalRevenue] = useState("1000");
  const [revenueResult, setRevenueResult] = useState(null);

  const [tab, setTab] = useState("overview"); // swissknife tabs
  const [error, setError] = useState("");

  const [headline, setHeadline] = useState("");
  const [content, setContent] = useState("");
  const [postMessage, setPostMessage] = useState("");

  const canCallApi = useMemo(() => !!API, []);

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
    const savedToken = localStorage.getItem("newstrack_token");
    if (!savedToken) {
      router.push("/login");
      return;
    }
    setToken(savedToken);
    fetchMe(savedToken);
  }, []);

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
    const data = await safeFetchJson(
      `${API}/journalists/${journalistId}/posts`,
    );
    setJournalistPosts(data);
  }

  async function runRevenueSim() {
    const total = Number(totalRevenue);
    if (!total || total <= 0) {
      setError("Enter a valid revenue amount (e.g. 1000).");
      return;
    }
    const data = await safeFetchJson(
      `${API}/revenue/simulate?total=${encodeURIComponent(total)}`,
    );
    setRevenueResult(data);
  }

  useEffect(() => {
    if (!canCallApi) return;
    if (!journalistId) return;
    loadJournalistPosts();
    runRevenueSim();
  }, [canCallApi, journalistId]);

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
              <h2 style={h2}>Quick Status</h2>
              <div style={{ opacity: 0.8, lineHeight: 1.7 }}>
                <div>Role: Journalist</div>
                <div>Posts: {journalistPosts.length}</div>
                <div>
                  Revenue (sim):{" "}
                  <strong>
                    {revenueResult ? money(revenueResult.total_revenue) : "—"}
                  </strong>
                </div>
              </div>
            </section>

            <section style={panel}>
              <h2 style={h2}>Next Actions</h2>
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
                  <strong>{p.headline}</strong>
                </div>
              ))
            )}
          </section>
        )}

        {tab === "revenue" && (
          <section style={panel}>
            <h2 style={h2}>Revenue Simulation</h2>

            <label style={label}>Total Revenue (GBP)</label>
            <input
              value={totalRevenue}
              onChange={(e) => setTotalRevenue(e.target.value)}
              style={input}
            />

            <button onClick={runRevenueSim} style={btn}>
              Simulate
            </button>

            {revenueResult && (
              <div style={{ marginTop: 12, opacity: 0.85, lineHeight: 1.8 }}>
                <div>
                  Total Revenue:{" "}
                  <strong>{money(revenueResult.total_revenue)}</strong>
                </div>
              </div>
            )}
          </section>
        )}

        {tab === "tools" && (
          <section style={panel}>
            <h2 style={h2}>Swissknife Tools (Next)</h2>
            <div style={{ opacity: 0.8, lineHeight: 1.8 }}>
              Coming next (we’ll build these in order):
              <ol style={{ marginTop: 10 }}>
                <li>Post composer (create journalist post)</li>
                <li>Verification checklist (sources + evidence)</li>
                <li>Live submission queue</li>
                <li>Performance analytics (reads, time, revenue)</li>
              </ol>
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
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.04)",
  color: "#fff",
  cursor: "pointer",
};

const tabBtnActive = {
  border: "1px solid rgba(0,200,255,0.55)",
  background: "rgba(0,200,255,0.12)",
};

const panel = {
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 16,
  padding: 16,
  background: "rgba(255,255,255,0.03)",
  color: "#fff",
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
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(0,0,0,0.25)",
  color: "#fff",
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
  border: "1px solid rgba(255,107,107,0.35)",
  background: "rgba(255,107,107,0.08)",
  color: "#ffb3b3",
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
