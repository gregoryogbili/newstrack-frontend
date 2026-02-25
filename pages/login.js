import { useState } from "react";
import TopNav from "../components/TopNav";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_BASE;

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function resetMessages() {
    setError("");
  }

  function toggleMode() {
    resetMessages();
    setIsRegister((v) => !v);
    // Keep email if you want; clear passwords for safety
    setPassword("");
    setConfirmPassword("");
  }

  async function handleSubmit() {
    setError("");

    if (!API) {
      setError("Missing NEXT_PUBLIC_API_BASE in .env.local");
      return;
    }

    // Basic validation
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    if (isRegister) {
      if (!name) {
        setError("Full name is required.");
        return;
      }
      if (!confirmPassword) {
        setError("Please confirm your password.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
    }

    try {
      setLoading(true);

      if (isRegister) {
        // 1) Register
        const regRes = await fetch(`${API}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const regData = await regRes.json();

        if (!regRes.ok) {
          setError(regData?.error || "Registration failed");
          return;
        }
      }

      // 2) Login (always)
      const loginRes = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        setError(loginData?.error || "Invalid credentials");
        return;
      }

      localStorage.setItem("newstrack_token", loginData.token);
      window.location.href = "/dashboard";
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
          <h1 style={{ marginTop: 0 }}>{isRegister ? "Register" : "Login"}</h1>

          {isRegister && (
            <>
              <label style={label}>Full Name</label>
              <input
                style={input}
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </>
          )}

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

          {isRegister && (
            <>
              <label style={label}>Confirm Password</label>
              <input
                style={input}
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </>
          )}

          <button style={btn} onClick={handleSubmit} disabled={loading}>
            {loading ? (isRegister ? "Creating account..." : "Logging in...") : isRegister ? "Register" : "Login"}
          </button>

          {error && <div style={err}>{error}</div>}

          <div style={{ marginTop: 14, opacity: 0.75, fontSize: 13 }}>
            {isRegister ? "Already have an account?" : "New here?"}{" "}
            <span style={toggleLink} onClick={toggleMode}>
              {isRegister ? "Login here" : "Register here"}
            </span>
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

const toggleLink = {
  color: "#00c8ff",
  cursor: "pointer",
  textDecoration: "underline",
};