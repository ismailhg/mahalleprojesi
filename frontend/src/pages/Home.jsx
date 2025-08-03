import React, { useState, useEffect } from "react";
import { getTimeAgo } from "../utils/timeUtils";
import "./home.css";
import { categoryGroups } from "../utils/categoryGroups";

const Home = () => {
  const [aktifKategori, setAktifKategori] = useState("");
  const [tumYorumlar, setTumYorumlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yeniYorum, setYeniYorum] = useState("");
  const [seciliKategori, setSeciliKategori] = useState("");
  const [kullaniciId, setKullaniciId] = useState(null);
  const [ad, setAd] = useState("");
  const [soyad, setSoyad] = useState("");
  const [iller, setIller] = useState([]);
  const [ilceler, setIlceler] = useState([]);
  const [mahalleler, setMahalleler] = useState([]);
  const [konum, setKonum] = useState({ ilId: "", ilceId: "", mahalleId: "" });

  useEffect(() => {
    const id = Number(localStorage.getItem("userId"));
    const adFromStorage = localStorage.getItem("userAd");
    const soyadFromStorage = localStorage.getItem("userSoyad");

    if (id && !isNaN(id) && adFromStorage && soyadFromStorage) {
      setKullaniciId(id);
      setAd(adFromStorage);
      setSoyad(soyadFromStorage);
    }

    yorumlariGetir();

    fetch(`${process.env.REACT_APP_API_URL}/api/location/iller`)
      .then((res) => res.json())
      .then(setIller)
      .catch((err) => console.error("İller alınamadı", err));
  }, []);

  useEffect(() => {
    if (konum.ilId) {
      fetch(
        `${process.env.REACT_APP_API_URL}/api/location/ilceler?ilId=${konum.ilId}`
      )
        .then((res) => res.json())
        .then(setIlceler)
        .catch((err) => console.error("İlçeler alınamadı", err));
    } else {
      setIlceler([]);
      setMahalleler([]);
    }
  }, [konum.ilId]);

  useEffect(() => {
    if (konum.ilceId) {
      fetch(
        `${process.env.REACT_APP_API_URL}/api/location/mahalleler?ilceId=${konum.ilceId}`
      )
        .then((res) => res.json())
        .then(setMahalleler)
        .catch((err) => console.error("Mahalleler alınamadı", err));
    } else {
      setMahalleler([]);
    }
  }, [konum.ilceId]);

  const yorumlariGetir = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/comments`
      );
      if (!response.ok) throw new Error("Sunucu hatası");
      const data = await response.json();
      setTumYorumlar(data);
    } catch (error) {
      console.error("Yorumlar alınamadı:", error.message);
      alert("Yorumlar alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  const yorumGonder = async () => {
    if (!kullaniciId) {
      return alert("Yorum gönderebilmek için giriş yapmalısınız.");
    }

    if (
      !yeniYorum.trim() ||
      !konum.ilId ||
      !konum.ilceId ||
      !konum.mahalleId ||
      !seciliKategori
    ) {
      return alert("Lütfen tüm alanları doldurun.");
    }

    const yeniYorumObj = {
      kategori: seciliKategori,
      icerik: yeniYorum.trim(),
      kullaniciId: kullaniciId,
      ad: ad,
      soyad: soyad,
      y_ilId: Number(konum.ilId),
      y_ilceId: Number(konum.ilceId),
      y_mahalleId: Number(konum.mahalleId),
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(yeniYorumObj),
        }
      );

      if (!response.ok) throw new Error("Sunucu hatası");

      alert("Yorum başarıyla gönderildi.");
      await yorumlariGetir();
      setYeniYorum("");
      setKonum({ ilId: "", ilceId: "", mahalleId: "" });
      setSeciliKategori("");
      setAktifKategori("");
    } catch (error) {
      console.error("Yorum gönderilemedi:", error.message);
      alert("Yorum gönderilemedi.");
    }
  };

  const yorumSil = async (yorumId) => {
    const onay = window.confirm("Bu yorumu silmek istediğinize emin misiniz?");
    if (!onay) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/comments/${yorumId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ kullaniciId }),
        }
      );

      if (!response.ok) throw new Error("Silme başarısız");

      alert("Yorum silindi");
      await yorumlariGetir();
    } catch (error) {
      console.error("Yorum silinemedi:", error.message);
      alert("Yorum silinemedi.");
    }
  };

  const secilenYorumlar = aktifKategori
    ? tumYorumlar.filter(
        (yorum) => yorum.kategori?.toLowerCase() === aktifKategori.toLowerCase()
      )
    : tumYorumlar;

  const formatCategory = (category) => {
    return category[0].toLocaleUpperCase("tr-TR") + category.slice(1);
  };

  return (
    <div className="home-container">
      <div className="sidebar">
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
                        setSeciliKategori(cat);
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
        <h3>
          {aktifKategori
            ? formatCategory(aktifKategori)
            : "Tüm Kategorilerden Yorumlar"}
        </h3>
        <p className="sub-heading">
          {aktifKategori
            ? `${aktifKategori} hakkında deneyimlerinizi paylaşın ve diğer kullanıcıların yorumlarını okuyun.`
            : "Tüm kategorilerdeki kullanıcı yorumlarını görüntüleyebilirsiniz. Filtrelemek için kategori seçin."}
        </p>

        <div className="yorum-form">
          <textarea
            placeholder="Deneyiminizi detaylı bir şekilde paylaşın..."
            value={yeniYorum}
            onChange={(e) => setYeniYorum(e.target.value)}
          />

          <select
            value={konum.ilId}
            onChange={(e) =>
              setKonum({ ilId: e.target.value, ilceId: "", mahalleId: "" })
            }
          >
            <option value="">İl Seçiniz</option>
            {iller.map((il) => (
              <option key={il.id} value={il.id}>
                {il.ad}
              </option>
            ))}
          </select>

          <select
            value={konum.ilceId}
            onChange={(e) =>
              setKonum((prev) => ({
                ...prev,
                ilceId: e.target.value,
                mahalleId: "",
              }))
            }
            disabled={!konum.ilId}
          >
            <option value="">İlçe Seçiniz</option>
            {ilceler.map((ilce) => (
              <option key={ilce.id} value={ilce.id}>
                {ilce.ad}
              </option>
            ))}
          </select>

          <select
            value={konum.mahalleId}
            onChange={(e) =>
              setKonum((prev) => ({ ...prev, mahalleId: e.target.value }))
            }
            disabled={!konum.ilceId}
          >
            <option value="">Mahalle Seçiniz</option>
            {mahalleler.map((m) => (
              <option key={m.id} value={m.id}>
                {m.ad}
              </option>
            ))}
          </select>

          <select
            value={seciliKategori}
            onChange={(e) => setSeciliKategori(e.target.value)}
          >
            <option value="">Kategori Seçiniz</option>
            {categoryGroups.map((group, index) => (
              <optgroup key={index} label={group.title}>
                {group.categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {formatCategory(cat)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          <button onClick={yorumGonder}>Yorumu Paylaş</button>
        </div>

        <div className="entry-list">
          {loading ? (
            <div className="loading-state">
              <p>Yorumlar yükleniyor...</p>
            </div>
          ) : secilenYorumlar.length > 0 ? (
            secilenYorumlar.map((entry) => (
              <div key={entry.id} className="entry-card">
                <div className="entry-header">
                  <div className="user-info">
                    <div className="user-avatar">
                      {(entry.User?.ad || "A").charAt(0).toUpperCase()}
                    </div>
                    <div className="user-details">
                      <strong className="user-name">
                        {entry.User?.ad || "Anonim"}
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
                {entry.kullaniciId === kullaniciId && (
                  <div className="delete-container">
                    <button
                      className="delete-button"
                      onClick={() => yorumSil(entry.id)}
                    >
                      Yorumu Sil
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>Bu kategoriye ait henüz yorum bulunmuyor.</p>
              <p>İlk yorumu siz yazarak başlayabilirsiniz!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
