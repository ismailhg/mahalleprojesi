import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

const categories = ["internet sağlayıcıları", "hastane", "okul", "market"];

const MahallemPage = () => {
  const [aktifKategori, setAktifKategori] = useState("market");
  const [yorumlar, setYorumlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [userInfo, setUserInfo] = useState({ ad: "", mahalle: "", kısaMahalle: "" });
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
    setUserInfo(prev => ({ ...prev, ad }));
    fetchMyMahalleYorumlari(id);
  }, []);

  const fetchMyMahalleYorumlari = async (id) => {
    try {
      const res = await fetch(`/api/comments/my-mahalle/${id}`);
      const data = await res.json();
      setYorumlar(data);

      if (data.length > 0) {
        const firstComment = data[0];
        const fullMahalle = `${firstComment.ilAdi} / ${firstComment.ilceAdi} / ${firstComment.mahalleAdi}`;
        const kısaMahalle = `${firstComment.mahalleAdi}, ${firstComment.ilceAdi}`;

        setUserInfo(prev => ({
          ...prev,
          mahalle: fullMahalle,
          kısaMahalle: kısaMahalle
        }));
      }
    } catch (err) {
      console.error("Yorumlar getirilemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtreliYorumlar = yorumlar.filter(
    (y) => y.kategori?.toLowerCase() === aktifKategori.toLowerCase()
  );

  const formatCategory = (category) => {
    return category[0].toLocaleUpperCase("tr-TR") + category.slice(1);
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return "az önce";
    if (diffInHours < 24) return `${diffInHours} saat önce`;
    if (diffInDays < 7) return `${diffInDays} gün önce`;

    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className="home-container">
      <div className="sidebar">
        <div className="mahalle-header">
          <div className="mahalle-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>Mahallem</span>
          </div>
          {userInfo.kısaMahalle && (
            <div className="mahalle-name">{userInfo.kısaMahalle}</div>
          )}
        </div>

        <h4>Kategoriler</h4>
        <ul className="category-list">
          {categories.map((cat) => {
            const count = yorumlar.filter(y => y.kategori?.toLowerCase() === cat.toLowerCase()).length;
            return (
              <li
                key={cat}
                className={cat === aktifKategori ? "active" : ""}
                onClick={() => setAktifKategori(cat)}
              >
                <div className="category-content">
                  <span className="category-name">{formatCategory(cat)}</span>
                  {count > 0 && (
                    <span className="category-count">{count}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {!loading && yorumlar.length > 0 && (
          <div className="quick-stats">
            <h5>Mahalle Özeti</h5>
            <div className="stat-item">
              <span className="stat-label">Toplam Yorum</span>
              <span className="stat-value">{yorumlar.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Aktif Kategori</span>
              <span className="stat-value">{categories.filter(cat => yorumlar.some(y => y.kategori?.toLowerCase() === cat.toLowerCase())).length}</span>
            </div>
          </div>
        )}
      </div>

      <div className="content-area">
        <div className="page-header">
          <div className="page-title-section">
            <h2 className="page-main-title">Mahallem</h2>
            <h3 className="page-sub-title">{formatCategory(aktifKategori)}</h3>
          </div>
          <div className="page-stats">
            {filtreliYorumlar.length > 0 && (
              <span className="result-count">{filtreliYorumlar.length} yorum</span>
            )}
          </div>
        </div>

        <p className="sub-heading">
          Mahallenizden <strong>{aktifKategori}</strong> kategorisindeki deneyimleri keşfedin.
          {userInfo.mahalle && (
            <span className="location-info"> • {userInfo.mahalle}</span>
          )}
        </p>

        <div className="entry-list">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Mahalle yorumları yükleniyor...</p>
            </div>
          ) : filtreliYorumlar.length > 0 ? (
            filtreliYorumlar.map((entry, index) => (
              <div key={`${entry.id || index}-${entry.kullaniciAd}`} className="entry-card">
                <div className="entry-header">
                  <div className="user-info">
                    <div className="user-avatar">
                      {(entry.kullaniciAd || "A").charAt(0).toUpperCase()}
                    </div>
                    <div className="user-details">
                      <strong className="user-name">{entry.kullaniciAd || "Anonim"}</strong>
                      <span className="entry-location">{entry.mahalleAdi}</span>
                    </div>
                  </div>
                  <div className="entry-time">
                    {entry.tarih ? getTimeAgo(entry.tarih) : 'Bilinmiyor'}
                  </div>
                </div>
                <div className="entry-content">
                  <p className="entry-text">{entry.icerik}</p>
                </div>
                <div className="entry-footer">
                  <div className="entry-meta">
                    <span className="category-tag">{formatCategory(entry.kategori || aktifKategori)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h4>Henüz yorum yok</h4>
              <p>Bu kategoride mahallenizden henüz yorum bulunmuyor.</p>
              <p>İlk yorumu siz yazarak başlayabilirsiniz!</p>
              <div className="empty-actions">
                <button className="secondary-button" onClick={() => navigate("/home")}>Ana Sayfaya Dön</button>
              </div>
            </div>
          )}
        </div>

        {!loading && yorumlar.length > 0 && (
          <div className="category-quick-nav">
            <h5>Diğer Kategoriler</h5>
            <div className="quick-nav-buttons">
              {categories.filter(cat => cat !== aktifKategori).map(cat => {
                const count = yorumlar.filter(y => y.kategori?.toLowerCase() === cat.toLowerCase()).length;
                return count > 0 ? (
                  <button
                    key={cat}
                    className="quick-nav-btn"
                    onClick={() => setAktifKategori(cat)}
                  >
                    {formatCategory(cat)} ({count})
                  </button>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MahallemPage;
