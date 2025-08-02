import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTimeAgo } from "../utils/timeUtils";
import { categoryGroups } from "../utils/categoryGroups";
import "./home.css";

const MahallemPage = () => {
  const [aktifKategori, setAktifKategori] = useState("market");
  const [yorumlar, setYorumlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem("userId");
    const ad = localStorage.getItem("userAd");

    if (!id || !ad) {
      alert("Giriş yapmanız gerekiyor.");
      window.location.href = "/login";
      return;
    }

    setUserId(id);
    fetchMyMahalleYorumlari(id);
  }, []);

  const fetchMyMahalleYorumlari = async (id) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/comments/my-mahalle/${id}`
      );
      if (!res.ok) throw new Error("Sunucu hatası veya yorumlar bulunamadı.");
      const data = await res.json();
      setYorumlar(data);
    } catch (err) {
      console.error("Yorumlar getirilemedi:", err);
      alert("Mahalle yorumları getirilirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const filtreliYorumlar = yorumlar.filter(
    (y) => y.kategori?.toLowerCase() === aktifKategori.toLowerCase()
  );

  const formatCategory = (category) =>
    category[0].toLocaleUpperCase("tr-TR") + category.slice(1);

  return (
    <div className="home-container">
      <div className="sidebar">
        <div className="mahalle-header">
          <div className="mahalle-badge">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>Mahallem</span>
          </div>

          {yorumlar.length > 0 && (
            <div className="user-location-info">
              <span className="user-location-text">
                {yorumlar[0].yorumIl?.il_adi || ""}{" "}
                {yorumlar[0].yorumIlce?.ilce_adi
                  ? `/ ${yorumlar[0].yorumIlce.ilce_adi}`
                  : ""}{" "}
                {yorumlar[0].yorumMahalle?.mahalle_adi
                  ? `/ ${yorumlar[0].yorumMahalle.mahalle_adi}`
                  : ""}
              </span>
            </div>
          )}
        </div>

        <h4>Kategoriler</h4>
        <ul className="category-list">
          {categoryGroups.map((group, idx) => (
            <li key={idx}>
              <details>
                <summary>{group.title}</summary>
                <ul className="sub-category-list">
                  {group.categories.map((cat) => (
                    <li
                      key={cat}
                      className={cat === aktifKategori ? "active" : ""}
                      onClick={(e) => {
                        setAktifKategori(cat);
                        const details = e.target.closest("details");
                        if (details) {
                          details.open = false;
                        }
                      }}
                    >
                      {formatCategory(cat)}
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ul>
      </div>

      <div className="content-area">
        <div className="page-header">
          <div className="page-title-section">
            <h3 className="page-sub-title">{formatCategory(aktifKategori)}</h3>
          </div>
        </div>

        <div className="entry-list">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Mahalle yorumları yükleniyor...</p>
            </div>
          ) : filtreliYorumlar.length > 0 ? (
            filtreliYorumlar.map((entry, index) => (
              <div key={`${entry.id || index}`} className="entry-card">
                <div className="entry-header">
                  <div className="user-info">
                    <div className="user-avatar">
                      {(entry.User?.ad || entry.kullaniciAd || "A")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div className="user-details">
                      <strong className="user-name">
                        {entry.User?.ad || entry.kullaniciAd || "Anonim"}
                      </strong>
                    </div>
                  </div>
                  <div className="location-and-time">
                    <span className="entry-location">
                      {entry.yorumIl?.il_adi}{" "}
                      {entry.yorumIlce?.ilce_adi
                        ? `/ ${entry.yorumIlce?.ilce_adi}`
                        : ""}{" "}
                      {entry.yorumMahalle?.mahalle_adi
                        ? `/ ${entry.yorumMahalle?.mahalle_adi}`
                        : ""}
                    </span>
                    <span className="entry-time">
                      {entry.tarih ? getTimeAgo(entry.tarih) : "Bilinmiyor"}
                    </span>
                  </div>
                </div>
                <div className="entry-content">
                  <p className="entry-text">{entry.icerik}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h4>Henüz yorum yok</h4>
              <p>Bu kategoride mahallenizden henüz yorum bulunmuyor.</p>
              <p>İlk yorumu siz yazarak başlayabilirsiniz!</p>
              <div className="empty-actions">
                <button
                  className="secondary-button"
                  onClick={() => navigate("/home")}
                >
                  Ana Sayfaya Dön
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MahallemPage;
