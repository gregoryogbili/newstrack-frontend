import { useState } from "react";
import TopNav from "../components/TopNav";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_BASE;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login() {
    setError("");

    if (!API) {
      setError("Missing NEXT_PUBLIC_API_BASE in .env.local");
      return;
    }

    if (!email || !password) {
      setError("Enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("newstrack_token", data.token);
        window.location.href = "/dashboard";
        return;
      }

      setError(data?.error || "Login failed");
    } catch (e) {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <TopNav
        active="/login"
        logoImg={<Image src="/logo.png" alt="NewsTrac Logo" width={34} height={34} />}
      />

      <div style={wrap}>
        <div style={card}>
          <h1 style={{ marginTop: 0 }}>Login</h1>

          <label style={label}>Email</label>
          <input
            style={input}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label style={label}>Password</label>
          <input
            style={input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={btn} onClick={login} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && <div style={err}>{error}</div>}

          <div style={{ marginTop: 14, opacity: 0.7, fontSize: 13 }}>
            Journalist access only (for now).
          </div>
        </div>
      </div>
    </>
  );
}

const wrap = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: 16,
  background: "#0b0f14",
  color: "#fff",
};

const card = {
  width: "100%",
  maxWidth: 420,
  borderRadius: 16,
  padding: 22,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
};

const label = { display: "block", marginTop: 12, marginBottom: 6, opacity: 0.8 };

const input = {
  width: "100%",
  padding: 12,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(0,0,0,0.25)",
  color: "#fff",
  outline: "none",
};

const btn = {
  width: "100%",
  marginTop: 16,
  padding: 12,
  borderRadius: 12,
  border: "none",
  background: "rgba(0,200,255,0.95)",
  color: "#001018",
  fontWeight: 700,
  cursor: "pointer",
};

const err = {
  marginTop: 12,
  color: "#ff6b6b",
  fontSize: 14,
};