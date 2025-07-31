import "./profile.css"; // Profile stilini ortak kullandık
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    ad: "",
    soyad: "",
    email: "",
    sifre: "",
    il_id: "",
    ilce_id: "",
    mahalle_id: "",
  });
  const [iller, setIller] = useState([]);
  const [ilceler, setIlceler] = useState([]);
  const [mahalleler, setMahalleler] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/location/iller`)
      .then((res) => res.json())
      .then(setIller)
      .catch(() => setMessage({ type: "error", text: "İller alınamadı." }));
  }, []);

  useEffect(() => {
    if (form.il_id) {
      fetch(
        `${process.env.REACT_APP_API_URL}/api/location/ilceler?ilId=${form.il_id}`
      )
        .then((res) => res.json())
        .then(setIlceler)
        .catch(() => setMessage({ type: "error", text: "İlçeler alınamadı." }));
    } else {
      setIlceler([]);
      setMahalleler([]);
    }
  }, [form.il_id]);

  useEffect(() => {
    if (form.ilce_id) {
      fetch(
        `${process.env.REACT_APP_API_URL}/api/location/mahalleler?ilceId=${form.ilce_id}`
      )
        .then((res) => res.json())
        .then(setMahalleler)
        .catch(() =>
          setMessage({ type: "error", text: "Mahalleler alınamadı." })
        );
    } else {
      setMahalleler([]);
    }
  }, [form.ilce_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "il_id" && { ilce_id: "", mahalle_id: "" }),
      ...(name === "ilce_id" && { mahalle_id: "" }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    if (
      !form.ad ||
      !form.soyad ||
      !form.email ||
      !form.sifre ||
      !form.mahalle_id
    ) {
      setMessage({ type: "error", text: "Tüm alanlar doldurulmalı." });
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Kı kayıt yapılamadı.");
      }

      const data = await res.json();
      localStorage.setItem("userId", data.id);
      localStorage.setItem("userAd", data.ad);
      localStorage.setItem("userSoyad", data.soyad);
      setMessage({
        type: "success",
        text: "Kayıt başarılı! Yönlendiriliyorsunuz...",
      });

      setTimeout(() => navigate("/home"), 1500);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Kaydol</h2>
        <p className="profile-subtitle">
          Yeni bir hesap oluşturmak için bilgilerinizi girin
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

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="section-title">Kullanıcı Bilgileri</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="ad">
                  Ad *
                </label>
                <input
                  id="ad"
                  name="ad"
                  value={form.ad}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="soyad">
                  Soyad *
                </label>
                <input
                  id="soyad"
                  name="soyad"
                  value={form.soyad}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                E-posta *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="sifre">
                Şifre *
              </label>
              <input
                id="sifre"
                name="sifre"
                type="password"
                value={form.sifre}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Konum Bilgileri</h3>
            <div className="location-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="il_id">
                  İl
                </label>
                <select
                  id="il_id"
                  name="il_id"
                  value={form.il_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seçiniz</option>
                  {iller.map((il) => (
                    <option key={il.id} value={il.id}>
                      {il.ad}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="ilce_id">
                  İlçe
                </label>
                <select
                  id="ilce_id"
                  name="ilce_id"
                  value={form.ilce_id}
                  onChange={handleChange}
                  disabled={!form.il_id}
                  required
                >
                  <option value="">Seçiniz</option>
                  {ilceler.map((ilce) => (
                    <option key={ilce.id} value={ilce.id}>
                      {ilce.ad}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="mahalle_id">
                  Mahalle
                </label>
                <select
                  id="mahalle_id"
                  name="mahalle_id"
                  value={form.mahalle_id}
                  onChange={handleChange}
                  disabled={!form.ilce_id}
                  required
                >
                  <option value="">Seçiniz</option>
                  {mahalleler.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.ad}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="submit-section">
            <button type="submit" disabled={submitting}>
              {submitting ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
