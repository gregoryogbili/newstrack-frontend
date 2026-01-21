import { useEffect, useMemo, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE;

function money(n) {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP"
  }).format(Number(n));
}

export default function Home() {
  // 📱 MOBILE DETECTION
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // 🔐 AUTH STATE
  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authStatus, setAuthStatus] = useState("");

  // 🟢 POST EDITOR STATE
  const [newHeadline, setNewHeadline] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [publishStatus, setPublishStatus] = useState("");

  const [posts, setPosts] = useState([]);
  const [trending, setTrending] = useState([]);

  const [journalistId, setJournalistId] = useState("");
  const [journalistPosts, setJournalistPosts] = useState([]);

  const [totalRevenue, setTotalRevenue] = useState("1000");
  const [revenueResult, setRevenueResult] = useState(null);

  const [error, setError] = useState("");

  const canCallApi = useMemo(() => !!API, []);

  // 🔐 LOAD TOKEN ON PAGE LOAD
  useEffect(() => {
    const savedToken = localStorage.getItem("newstrack_token");
    if (savedToken) {
      setToken(savedToken);
      fetchMe(savedToken);
    }
  }, []);

  // 🔐 AUTH HELPERS
  async function fetchMe(jwtToken) {
    try {
      const res = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      if (!res.ok) throw new Error("Session expired");
      const data = await res.json();
      setCurrentUser(data.user);
      setJournalistId(String(data.user.id));
    } catch {
      logout();
    }
  }

  async function login() {
    setAuthStatus("");
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("newstrack_token", data.token);
      setToken(data.token);
      setCurrentUser(data.user);
      setJournalistId(String(data.user.id));

      setLoginEmail("");
      setLoginPassword("");
      setAuthStatus("Logged in ✔");

      loadFeed();
      loadTrending();
      loadJournalistPosts();
    } catch (err) {
      setAuthStatus(err.message);
    }
  }

  function logout() {
    localStorage.removeItem("newstrack_token");
    setToken(null);
    setCurrentUser(null);
    setJournalistId("");
  }

  // 🟢 PUBLISH POST (JWT PROTECTED)
  async function publishPost() {
    setPublishStatus("");
    if (!newHeadline.trim()) {
      setPublishStatus("Headline is required.");
      return;
    }
    if (!token) {
      setPublishStatus("You must be logged in to publish.");
      return;
    }

    try {
      const res = await fetch(`${API}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          headline: newHeadline,
          description: newDescription
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to publish post");

      setPublishStatus("Post published successfully ✔");
      setNewHeadline("");
      setNewDescription("");

      loadFeed();
      loadTrending();
      loadJournalistPosts();
    } catch (err) {
      setPublishStatus(err.message);
    }
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
          typeof data === "string" ? data : data.error || "Request failed"
        );
      }
      return data;
    } catch (e) {
      setError(e.message || "Something went wrong");
      throw e;
    }
  }

  async function loadFeed() {
    const data = await safeFetchJson(`${API}/posts`);
    setPosts(data);
  }

  async function loadTrending() {
    const data = await safeFetchJson(`${API}/trending`);
    setTrending(data);
  }

  async function loadJournalistPosts() {
    if (!journalistId) return;
    const data = await safeFetchJson(
      `${API}/journalists/${journalistId}/posts`
    );
    setJournalistPosts(data);
  }

  async function runRevenueSim() {
    const total = Number(totalRevenue);
    if (!total || total <= 0) {
      setError("Enter a valid total revenue amount (e.g. 1000).");
      return;
    }
    const data = await safeFetchJson(
      `${API}/revenue/simulate?total=${encodeURIComponent(total)}`
    );
    setRevenueResult(data);
  }

  useEffect(() => {
    if (!canCallApi) return;
    loadFeed();
    loadTrending();
    runRevenueSim();
  }, [canCallApi]);

  return (
    <div
      style={{
        fontFamily: "system-ui, Arial",
        padding: isMobile ? 12 : 16,
        maxWidth: 1100,
        margin: "0 auto"
      }}
    >
      <h1>NewsTrack Creator Dashboard (MVP)</h1>

      {/* 🔐 AUTH PANEL */}
      <section style={panel}>
        <h2>Authentication</h2>
        {!token ? (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              placeholder="Email"
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
              style={input}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
              style={input}
            />
            <button onClick={login} style={btn}>Login</button>
            {authStatus && <div>{authStatus}</div>}
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              Logged in as <strong>{currentUser?.name}</strong>
            </div>
            <button onClick={logout} style={btn}>Logout</button>
          </div>
        )}
      </section>

      {/* 🟢 POST EDITOR */}
      <section style={panel}>
        <h2>Write a News Post</h2>
        <input
          placeholder="Headline"
          value={newHeadline}
          onChange={e => setNewHeadline(e.target.value)}
          style={input}
        />
        <textarea
          placeholder="Description"
          value={newDescription}
          onChange={e => setNewDescription(e.target.value)}
          style={{ ...input, minHeight: 100 }}
        />
        <button onClick={publishPost} style={btn}>Publish</button>
        {publishStatus && <div>{publishStatus}</div>}
      </section>

      {/* 📊 FEED + TRENDING */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 16
        }}
      >
        <section style={panel}>
          <h2>Latest Feed</h2>
          {posts.slice(0, 10).map(p => (
            <div key={p.id} style={card}>
              <strong>{p.headline}</strong>
              <div>{p.description}</div>
            </div>
          ))}
        </section>

        <section style={panel}>
          <h2>Trending</h2>
          {trending.slice(0, 10).map(p => (
            <div key={p.id} style={card}>
              <strong>{p.headline}</strong>
              <div>Score: {p.score}</div>
            </div>
          ))}
        </section>
      </div>

      {/* 👤 DASHBOARD + 💷 REVENUE */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 16,
          marginTop: 16
        }}
      >
        <section style={panel}>
          <h2>Your Posts</h2>
          {journalistPosts.map(p => (
            <div key={p.id} style={card}>{p.headline}</div>
          ))}
        </section>

        <section style={panel}>
          <h2>Revenue Simulation</h2>
          <input
            value={totalRevenue}
            onChange={e => setTotalRevenue(e.target.value)}
            style={input}
          />
          <button onClick={runRevenueSim} style={btn}>Simulate</button>
          {revenueResult && (
            <div>Total: {money(revenueResult.total_revenue)}</div>
          )}
        </section>
      </div>
    </div>
  );
}

// 🟢 TOUCH-FRIENDLY STYLES
const btn = {
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #ccc",
  background: "#fff",
  fontSize: 16,
  cursor: "pointer"
};

const input = {
  padding: "12px 12px",
  borderRadius: 12,
  border: "1px solid #ccc",
  fontSize: 16,
  width: "100%"
};

const card = {
  border: "1px solid #eee",
  padding: 12,
  marginBottom: 10,
  borderRadius: 12,
  background: "#fafafa"
};

const panel = {
  border: "1px solid #ddd",
  borderRadius: 14,
  padding: 14,
  marginBottom: 16
};
