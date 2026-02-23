import { useState } from "react";
import TopNav from "../components/TopNav";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_BASE;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("newstrack_token", data.token);
      window.location.href = "/dashboard";
    } else {
      alert(data.error);
    }
  }

  return (
    <>
      <TopNav
        active="/login"
        logoImg={
          <Image
            src="/logo.png"
            alt="NewsTrac Logo"
            width={34}
            height={34}
          />
        }
      />

      <div style={{ maxWidth: 400, margin: "100px auto" }}>
        <h1>Login</h1>
        <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button onClick={login}>Login</button>
      </div>
    </>
  );
}