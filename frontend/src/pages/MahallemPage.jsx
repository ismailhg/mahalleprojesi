// ✅ src/pages/MahallemPage.jsx
import React, { useEffect, useState } from "react";
import "./home.css";

const categories = ["internet sağlayıcıları", "hastane", "okul", "market"];

const MahallemPage = () => {
  const [aktifKategori, setAktifKategori] = useState("market");
  const [yorumlar, setYorumlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) {
      alert("Giriş yapmanız gerekiyor.");
      window.location.href = "/login";
      return;
    }
    setUserId(id);
    fetchMyMahalleYorumlari(id);
  }, []);

  const fetchMyMahalleYorumlari = async (id) => {
    try {
      const res = await fetch(`/api/comments/my-mahalle/${id}`);
      const data = await res.json();
      setYorumlar(data);
    } catch (err) {
      console.error("Yorumlar getirilemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtreliYorumlar = yorumlar.filter(
    (y) => y.kategori?.toLowerCase() === aktifKategori.toLowerCase()
  );

  return (
    <div className="home-container">
      {/* Sol kategori menüsü */}
      <div className="sidebar">
        <h4>Kategoriler</h4>
        <ul className="category-list">
          {categories.map((cat) => (
            <li
              key={cat}
              className={cat === aktifKategori ? "active" : ""}
              onClick={() => setAktifKategori(cat)}
            >
              {cat}
            </li>
          ))}
        </ul>
      </div>

      {/* Yorumlar bölümü */}
      <div className="content-area">
        <h3>{aktifKategori} – Benim Mahallem</h3>
        <div className="entry-list">
          {loading ? (
            <p>Yükleniyor...</p>
          ) : filtreliYorumlar.length > 0 ? (
            filtreliYorumlar.map((entry) => (
              <div key={entry.id} className="entry-card">
                <p>{entry.icerik}</p>
                <div className="entry-meta">
                  — {entry.kullaniciAd} ({entry.ilAdi} / {entry.ilceAdi} /{" "}
                  {entry.mahalleAdi})
                </div>
              </div>
            ))
          ) : (
            <p>Bu kategoriye ait yorum yok.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MahallemPage;
