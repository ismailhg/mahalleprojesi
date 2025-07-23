import "./login.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, sifre }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Giriş başarısız");
        return;
      }

      const data = await res.json();

      // Kullanıcı bilgilerini localStorage'a kaydet
      localStorage.setItem("userId", data.id);
      localStorage.setItem("userAd", data.ad);

      alert("Giriş başarılı!");
      navigate("/home"); // Giriş sonrası ana sayfaya yönlendir
    } catch (error) {
      alert("Giriş sırasında bir hata oluştu.");
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Giriş Yap</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={sifre}
          onChange={(e) => setSifre(e.target.value)}
          required
        />
        <button type="submit">Giriş Yap</button>
      </form>
    </div>
  );
};

export default Login;
