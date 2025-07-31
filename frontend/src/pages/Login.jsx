import "./profile.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetStatus, setResetStatus] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, sifre }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Giriş başarısız");
      }

      const data = await res.json();
      localStorage.setItem("userId", data.id);
      localStorage.setItem("userAd", data.ad);
      localStorage.setItem("userSoyad", data.soyad);

      setMessage({
        type: "success",
        text: "Giriş başarılı! Yönlendiriliyorsunuz...",
      });
      setTimeout(() => navigate("/home"), 1500);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/sifremi-unuttum`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: resetEmail }),
        }
      );

      if (!res.ok) throw new Error("E-posta gönderilemedi.");

      setResetStatus("success");
    } catch (error) {
      setResetStatus("error");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Giriş Yap</h2>
        <p className="profile-subtitle">
          Hesabınıza erişmek için bilgilerinizle giriş yapın
        </p>
      </div>

      <div className="profile-form-card">
        {submitting && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}

        {message.text && (
          <div
            className={
              message.type === "success" ? "success-message" : "error-message"
            }
          >
            <span>{message.type === "success" ? "✓" : "⚠"}</span>
            {message.text}
          </div>
        )}

        <form
          className="profile-form"
          onSubmit={(e) => {
            if (!showForgotPassword) handleLogin(e);
            else e.preventDefault(); // reset butonu ayrı çalışacak
          }}
        >
          <div className="form-section">
            <h3 className="section-title">
              {showForgotPassword ? "Şifre Sıfırlama" : "Giriş Bilgileri"}
            </h3>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                E-posta *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="E-posta adresinizi girin:"
                value={showForgotPassword ? resetEmail : email}
                onChange={(e) =>
                  showForgotPassword
                    ? setResetEmail(e.target.value)
                    : setEmail(e.target.value)
                }
                required
              />
            </div>

            {!showForgotPassword && (
              <div className="form-group">
                <label className="form-label" htmlFor="sifre">
                  Şifre *
                </label>
                <input
                  id="sifre"
                  name="sifre"
                  type="password"
                  placeholder="Şifrenizi girin:"
                  value={sifre}
                  onChange={(e) => setSifre(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          {!showForgotPassword && (
            <div className="forgot-password-link">
              <span
                onClick={() => setShowForgotPassword(true)}
                style={{ cursor: "pointer", color: "blue" }}
              >
                Şifreni mi unuttun?
              </span>
            </div>
          )}

          <div className="submit-section">
            {!showForgotPassword ? (
              <button type="submit" disabled={submitting}>
                {submitting ? "Giriş Yapılıyor..." : "Giriş Yap"}
              </button>
            ) : (
              <button type="button" onClick={handleResetPassword}>
                Bağlantı Gönder
              </button>
            )}
          </div>

          {showForgotPassword && resetStatus === "success" && (
            <p style={{ color: "green" }}>E-posta gönderildi!</p>
          )}
          {showForgotPassword && resetStatus === "error" && (
            <p style={{ color: "red" }}>Gönderilemedi. Tekrar deneyin.</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
