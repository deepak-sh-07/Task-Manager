import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showWarning, showSuccess } from "./ToastProvider";
import "../Css/login.css"

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      showWarning("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,   
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showWarning(data.message || "Login failed.");
        return;
      }

      // Save token & username
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username);

      // Fire event so Navbar/Home knows immediately
      window.dispatchEvent(new Event("storage"));

      // Show welcome toast
      showSuccess(`Welcome back, ${data.user.username}!`);

      navigate("/home");
    } catch (err) {
      console.error("Error during login:", err);
      showWarning("Something went wrong.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login to Your Account</h2>
        <form onSubmit={handleLogin}>
          <input
            type="username"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              style={{ paddingRight: "35px", width: "85%" }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: "8px", top: "50%", cursor: "pointer" }}
            >
              👁
            </span>
          </div>
          <button type="submit" className="auth-btn">
            Login
          </button>
        </form>
        <p className="auth-switch-text">
          Don’t have an account?{" "}
          <Link to="/register" className="auth-switch-link">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
