import "./profile.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    ad: "",
    soyad: "",
    email: "",
    il_id: "",
    ilce_id: "",
    mahalle_id: "",
  });

  const [iller, setIller] = useState([]);
  const [ilceler, setIlceler] = useState([]);
  const [mahalleler, setMahalleler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUserData({
          ad: data.ad || "",
          soyad: data.soyad || "",
          email: data.email || "",
          il_id: data.il_id || "",
          ilce_id: data.ilce_id || "",
          mahalle_id: data.mahalle_id || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        setMessage({ type: "error", text: "Kullanıcı verisi alınamadı." });
        console.error(err);
        setLoading(false);
      });
  }, [userId, navigate]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/location/iller`)
      .then((res) => res.json())
      .then(setIller)
      .catch(() => setMessage({ type: "error", text: "İller alınamadı." }));
  }, []);

  useEffect(() => {
    if (userData.il_id) {
      fetch(
        `${process.env.REACT_APP_API_URL}/api/location/ilceler?ilId=${userData.il_id}`
      )
        .then((res) => res.json())
        .then(setIlceler)
        .catch(() => setMessage({ type: "error", text: "İlçeler alınamadı." }));
    } else {
      setIlceler([]);
      setMahalleler([]);
    }
  }, [userData.il_id]);

  useEffect(() => {
    if (userData.ilce_id) {
      fetch(
        `${process.env.REACT_APP_API_URL}/api/location/mahalleler?ilceId=${userData.ilce_id}`
      )
        .then((res) => res.json())
        .then(setMahalleler)
        .catch(() =>
          setMessage({ type: "error", text: "Mahalleler alınamadı." })
        );
    } else {
      setMahalleler([]);
    }
  }, [userData.ilce_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "il_id" && { ilce_id: "", mahalle_id: "" }),
      ...(name === "ilce_id" && { mahalle_id: "" }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!userData.ad || !userData.soyad || !userData.email) {
      setMessage({
        type: "error",
        text: "Lütfen tüm zorunlu alanları doldurun.",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      setMessage({
        type: "error",
        text: "Lütfen geçerli bir e-posta adresi girin.",
      });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/user/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Güncelleme başarısız.");
      }

      setMessage({ type: "success", text: "Bilgiler başarıyla güncellendi!" });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const getSelectedLocationNames = () => {
    const il = iller.find((i) => i.id == userData.il_id);
    const ilce = ilceler.find((i) => i.id == userData.ilce_id);
    const mahalle = mahalleler.find((m) => m.id == userData.mahalle_id);
    return {
      il: il?.ad || "",
      ilce: ilce?.ad || "",
      mahalle: mahalle?.ad || "",
    };
  };

  const locationNames = getSelectedLocationNames();

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-form-card">
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Profil Bilgilerim</h2>
        <p className="profile-subtitle">
          Hesap bilgilerinizi güncelleyin ve konum ayarlarınızı yapın
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
            <h3 className="section-title">Kişisel Bilgiler</h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="ad">
                  Ad *
                </label>
                <input
                  id="ad"
                  name="ad"
                  type="text"
                  placeholder="Adınızı girin"
                  value={userData.ad}
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
                  type="text"
                  placeholder="Soyadınızı girin"
                  value={userData.soyad}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                E-posta Adresi *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="ornek@email.com"
                value={userData.email}
                onChange={handleChange}
                required
              />
              <p className="form-hint">
                Bu e-posta adresi giriş yapmak için kullanılacaktır
              </p>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Konum Bilgileri</h3>

            <div className="location-section">
              <div className="location-info">
                <span>📍</span>
                <span>
                  {locationNames.il &&
                  locationNames.ilce &&
                  locationNames.mahalle
                    ? `${locationNames.il} / ${locationNames.ilce} / ${locationNames.mahalle}`
                    : "Konum bilginizi tamamlayın"}
                </span>
              </div>

              <div className="location-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="il_id">
                    İl
                  </label>
                  <select
                    id="il_id"
                    name="il_id"
                    value={userData.il_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">İl Seçiniz</option>
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
                    value={userData.ilce_id}
                    onChange={handleChange}
                    disabled={!userData.il_id}
                    required
                  >
                    <option value="">İlçe Seçiniz</option>
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
                    value={userData.mahalle_id}
                    onChange={handleChange}
                    disabled={!userData.ilce_id}
                    required
                  >
                    <option value="">Mahalle Seçiniz</option>
                    {mahalleler.map((mahalle) => (
                      <option key={mahalle.id} value={mahalle.id}>
                        {mahalle.ad}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="submit-section">
            <button type="submit" disabled={submitting}>
              {submitting ? "Güncelleniyor..." : "Bilgilerimi Güncelle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
