import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./profile.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [yeniSifre, setYeniSifre] = useState("");
  const [tekrarSifre, setTekrarSifre] = useState("");
  const [mesaj, setMesaj] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (yeniSifre !== tekrarSifre) {
      setMesaj("⚠ Şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);
    setMesaj("");

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/sifre-sifirla/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sifre: yeniSifre }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMesaj(
          "✓ Şifre başarıyla güncellendi. Giriş ekranına yönlendiriliyorsunuz..."
        );
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMesaj(data.error || "⚠ Bir hata oluştu.");
      }
    } catch (error) {
      setMesaj("⚠ Sunucu hatası.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Şifre Sıfırlama</h2>
        <p className="profile-subtitle">Yeni bir şifre belirleyin</p>
      </div>

      <div className="profile-form-card">
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}

        {mesaj && (
          <div
            className={
              mesaj.startsWith("✓") ? "success-message" : "error-message"
            }
          >
            <span>{mesaj.startsWith("✓") ? "✓" : "⚠"}</span> {mesaj}
          </div>
        )}

        <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-section">
            <h3 className="section-title">Yeni Şifre</h3>

            <div className="form-group">
              <label className="form-label" htmlFor="yeniSifre">
                Şifre *
              </label>
              <input
                id="yeniSifre"
                type="password"
                placeholder="Yeni şifrenizi girin"
                value={yeniSifre}
                onChange={(e) => setYeniSifre(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="tekrarSifre">
                Şifre Tekrar *
              </label>
              <input
                id="tekrarSifre"
                type="password"
                placeholder="Şifrenizi tekrar girin"
                value={tekrarSifre}
                onChange={(e) => setTekrarSifre(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="submit-section">
            <button type="submit" onClick={handleReset} disabled={loading}>
              {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
