import React, { useEffect, useState } from "react";

const apiFetch = async (url, options = {}, token = "") => {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Token ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const rawText = await response.text();
  let data = {};

  if (rawText) {
    data = JSON.parse(rawText);
  }

  if (!response.ok) {
    const firstFieldError = Object.values(data).find(
      (value) => Array.isArray(value) && value.length > 0
    );
    throw new Error(data.detail || firstFieldError?.[0] || "请求失败");
  }

  return data;
};

export default function App() {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [currentUser, setCurrentUser] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setCurrentUser("");
      return;
    }

    apiFetch("/api/auth/me/", { method: "GET" }, token)
      .then((data) => setCurrentUser(data.username))
      .catch(() => {
        localStorage.removeItem("token");
        setToken("");
      });
  }, [token]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const path = mode === "register" ? "/api/auth/register/" : "/api/auth/login/";
      const data = await apiFetch(path, {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setCurrentUser(data.username);
      setPassword("");
      setMessage(data.message || (mode === "register" ? "注册成功！" : "登录成功！"));
    } catch (err) {
      setMessage(err.message);
    }
  };

  const onLogout = async () => {
    setMessage("");
    try {
      await apiFetch("/api/auth/logout/", { method: "POST" }, token);
    } catch (err) {
      setMessage(err.message);
    } finally {
      localStorage.removeItem("token");
      setToken("");
      setCurrentUser("");
      setUsername("");
      setPassword("");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>React + Django Auth</h1>
      {currentUser ? (
        <div>
          <p>
            当前登录用户: <strong>{currentUser}</strong>
          </p>
          <button onClick={onLogout}>退出登录</button>
        </div>
      ) : (
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={() => setMode("login")} disabled={mode === "login"}>
              登录
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              disabled={mode === "register"}
            >
              注册
            </button>
          </div>

          <input
            type="text"
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="密码(至少6位)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          <button type="submit">{mode === "register" ? "注册" : "登录"}</button>
        </form>
      )}

      {message && <p style={{ marginTop: 16 }}>{message}</p>}
    </div>
  );
}
