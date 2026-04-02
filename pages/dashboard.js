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
  function buildOpinionHTML(headline, content) {
    const paragraphs = content
      .split(/\n\n+/)
      .filter((p) => p.trim())
      .map((p) => p.trim());

    const body = paragraphs
      .map((p) => {
        if (p.startsWith("PULLQUOTE:")) {
          const quote = p.replace("PULLQUOTE:", "").trim();
          return `<blockquote style="border-left:4px solid #c40000;margin:1.5rem 0;padding:0.8rem 1.25rem;background:#fef2f2;border-radius:0 6px 6px 0;"><p style="font-style:italic;font-size:18px;line-height:1.45;margin:0;color:#111;">${quote}</p></blockquote>`;
        }
        if (p.startsWith("SECTION:")) {
          const title = p.replace("SECTION:", "").trim();
          return `<p style="font-family:sans-serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;font-weight:700;color:#c40000;margin:2rem 0 0.5rem;">${title}</p>`;
        }
        return `<p style="font-size:16px;line-height:1.85;margin-bottom:1.3rem;color:#222;font-family:Georgia,serif;">${p}</p>`;
      })
      .join("");

    return `<div style="font-family:Georgia,serif;max-width:680px;">
    <p style="font-family:sans-serif;font-size:13px;color:#555;margin-bottom:2rem;">By <strong style="color:#111;">${currentUser?.name || "Independent Journalist"}</strong> · NewsTrac</p>
    ${body}
  </div>`;
  }

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
  const [region, setRegion] = useState("Global");
  const [country, setCountry] = useState("");
  const [showPreview, setShowPreview] = useState(false);

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
          content: buildOpinionHTML(headline, content),
          region,
          country,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to publish");
      }

      setPostMessage("Story published successfully.");
      setHeadline("");
      setContent("");
      setRegion("Global");
      setCountry("");
      loadJournalistPosts();
    } catch (err) {
      setPostMessage(err.message);
    }
  }

  async function deletePost(postId) {
    if (!confirm("Delete this article? This cannot be undone.")) return;
    try {
      const res = await fetch(
        `${API}/journalists/${journalistId}/posts/${postId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error("Delete failed");
      loadJournalistPosts();
    } catch (err) {
      setError(err.message);
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
                <div
                  key={p.id}
                  style={{
                    ...card,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <a
                    href={`/posts/${p.id}`}
                    style={{
                      color: "#111",
                      textDecoration: "underline",
                      flex: 1,
                    }}
                  >
                    <strong>{p.headline}</strong>
                    {p.region && (
                      <span
                        style={{ marginLeft: 8, fontSize: 11, color: "#888" }}
                      >
                        {p.region}
                        {p.country ? ` · ${p.country}` : ""}
                      </span>
                    )}
                  </a>
                  <button
                    onClick={() => deletePost(p.id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      border: "1px solid #ffcccc",
                      background: "#ffeaea",
                      color: "#b80000",
                      cursor: "pointer",
                      fontSize: 12,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </section>
        )}

        {tab === "revenue" && (
          <section style={panel}>
            <h2 style={{ ...h2, color: "#b80000" }}>Revenue</h2>

            {!metrics ? (
              <div style={{ opacity: 0.75 }}>Loading metrics...</div>
            ) : (
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
            )}
          </section>
        )}

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

            {/* Write / Preview toggle */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button
                onClick={() => setShowPreview(false)}
                style={{
                  ...toggleBtn,
                  ...(showPreview ? {} : toggleBtnActive),
                }}
              >
                Write
              </button>
              <button
                onClick={() => setShowPreview(true)}
                style={{
                  ...toggleBtn,
                  ...(showPreview ? toggleBtnActive : {}),
                }}
              >
                Preview
              </button>
            </div>

            {!showPreview ? (
              <>
                <label style={labelDark}>Headline</label>
                <input
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  style={inputWhite}
                  placeholder="Enter headline"
                />

                <label style={labelDark}>Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  style={inputWhite}
                >
                  <option>Global</option>
                  <option>Middle East</option>
                  <option>Europe</option>
                  <option>UK</option>
                  <option>Africa</option>
                  <option>Asia</option>
                  <option>Americas</option>
                  <option>Oceania</option>
                </select>

                <label style={labelDark}>Country (optional)</label>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  style={inputWhite}
                  placeholder="e.g. Lebanon, Nigeria, Ukraine"
                />

                <label style={labelDark}>Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={{ ...textareaWhite, minHeight: 280 }}
                  placeholder={
                    "Write paragraphs separated by blank lines.\n\nFor a pull quote, start a paragraph with: PULLQUOTE: your quote here\n\nFor a red section header, start a paragraph with: SECTION: Your Header Here"
                  }
                />
              </>
            ) : (
              <div
                style={{
                  border: "1px solid #e2e2e2",
                  borderRadius: 8,
                  padding: 24,
                  minHeight: 300,
                  background: "#fff",
                }}
              >
                {!headline && !content ? (
                  <p style={{ color: "#aaa", fontStyle: "italic" }}>
                    Nothing to preview yet. Switch to Write and add your
                    content.
                  </p>
                ) : (
                  <>
                    {/* Tag */}
                    <p
                      style={{
                        fontFamily: "sans-serif",
                        fontSize: 11,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#888",
                        borderLeft: "3px solid #c40000",
                        paddingLeft: 10,
                        marginBottom: 12,
                        fontWeight: 600,
                      }}
                    >
                      Independent Journalist · NewsTrac Editorial
                    </p>
                    {/* Headline */}
                    {headline && (
                      <h2
                        style={{
                          fontFamily: "Georgia, serif",
                          fontSize: 26,
                          fontWeight: 700,
                          lineHeight: 1.2,
                          marginBottom: 8,
                          color: "#111",
                        }}
                      >
                        {headline}
                      </h2>
                    )}
                    {/* Byline */}
                    <p
                      style={{
                        fontFamily: "sans-serif",
                        fontSize: 13,
                        color: "#555",
                        marginBottom: 24,
                        borderBottom: "1px solid #eee",
                        paddingBottom: 12,
                      }}
                    >
                      By{" "}
                      <strong style={{ color: "#111" }}>
                        {currentUser?.name || "Independent Journalist"}
                      </strong>{" "}
                      · NewsTrac
                      {region && region !== "Global" && (
                        <span style={{ marginLeft: 8, color: "#0369a1" }}>
                          · {region}
                          {country ? `, ${country}` : ""}
                        </span>
                      )}
                    </p>
                    {/* Formatted content */}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: buildOpinionHTML(headline, content)
                          .replace(/<div[^>]*>/, "")
                          .replace(/<\/div>$/, "")
                          .replace(
                            /<p style="font-family:sans-serif[^>]*>.*?<\/p>/,
                            "",
                          ),
                      }}
                    />
                  </>
                )}
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 16,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={submitPost}
                style={btnPrimary}
                disabled={showPreview && (!headline || !content)}
              >
                Publish Story
              </button>
              {showPreview && (
                <button
                  onClick={() => setShowPreview(false)}
                  style={{ ...btnPrimary, background: "#555" }}
                >
                  Edit
                </button>
              )}
            </div>

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

const toggleBtn = {
  padding: "8px 18px",
  borderRadius: 8,
  border: "1px solid #ddd",
  background: "#fff",
  color: "#555",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 500,
};

const toggleBtnActive = {
  border: "1px solid #b80000",
  background: "#b80000",
  color: "#fff",
};
