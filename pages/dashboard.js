import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE;

function money(n) {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP"
  }).format(Number(n));
}

export default function Dashboard() {
  const router = useRouter();

  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;

  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [journalistId, setJournalistId] = useState("");
  const [journalistPosts, setJournalistPosts] = useState([]);

  const [totalRevenue, setTotalRevenue] = useState("1000");
  const [revenueResult, setRevenueResult] = useState(null);

  const [error, setError] = useState("");

  const canCallApi = useMemo(() => !!API, []);

  // 🔐 PROTECT ROUTE
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
          typeof data === "string"
            ? data
            : data.error || "Request failed"
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
      `${API}/journalists/${journalistId}/posts`
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
      `${API}/revenue/simulate?total=${encodeURIComponent(total)}`
    );

    setRevenueResult(data);
  }

  useEffect(() => {
    if (!canCallApi) return;
    loadJournalistPosts();
    runRevenueSim();
  }, [canCallApi, journalistId]);

  return (
    <div
      style={{
        fontFamily: "system-ui, Arial",
        padding: isMobile ? 12 : 20,
        maxWidth: 1000,
        margin: "0 auto"
      }}
    >
      <h1>Journalist Dashboard</h1>

      {currentUser && (
        <div style={{ marginBottom: 20 }}>
          Welcome, <strong>{currentUser.name}</strong>
          <button onClick={logout} style={btnRight}>
            Logout
          </button>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 20
        }}
      >
        {/* 👤 YOUR POSTS */}
        <section style={panel}>
          <h2>Your Posts</h2>

          {journalistPosts.length === 0 && (
            <div>No posts yet.</div>
          )}

          {journalistPosts.map(p => (
            <div key={p.id} style={card}>
              <strong>{p.headline}</strong>
            </div>
          ))}
        </section>

        {/* 💷 REVENUE SIM */}
        <section style={panel}>
          <h2>Revenue Simulation</h2>

          <input
            value={totalRevenue}
            onChange={e => setTotalRevenue(e.target.value)}
            style={input}
          />

          <button onClick={runRevenueSim} style={btn}>
            Simulate
          </button>

          {revenueResult && (
            <div style={{ marginTop: 12 }}>
              Total Revenue:{" "}
              {money(revenueResult.total_revenue)}
            </div>
          )}
        </section>
      </div>

      {error && (
        <div style={{ marginTop: 20, color: "red" }}>
          {error}
        </div>
      )}
    </div>
  );
}

/* STYLES */

const btn = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #ccc",
  background: "#fff",
  cursor: "pointer",
  marginTop: 10
};

const btnRight = {
  marginLeft: 20,
  padding: "6px 12px",
  borderRadius: 8,
  border: "1px solid #ccc",
  background: "#fff",
  cursor: "pointer"
};

const input = {
  padding: "10px",
  borderRadius: 10,
  border: "1px solid #ccc",
  width: "100%",
  marginBottom: 10
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
  padding: 16
};
