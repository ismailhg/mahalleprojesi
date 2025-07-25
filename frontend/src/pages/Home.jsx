import React, { useState, useEffect } from "react";
import "./home.css";

const categories = ["internet sağlayıcıları", "hastane", "okul", "market"];

const Home = () => {
  const [aktifKategori, setAktifKategori] = useState("market");
  const [tumYorumlar, setTumYorumlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yeniYorum, setYeniYorum] = useState("");
  const [seciliKategori, setSeciliKategori] = useState("market");
  const [kullaniciId, setKullaniciId] = useState(null);
  const [iller, setIller] = useState([]);
  const [ilceler, setIlceler] = useState([]);
  const [mahalleler, setMahalleler] = useState([]);
  const [konum, setKonum] = useState({ ilId: "", ilceId: "", mahalleId: "" });

  useEffect(() => {
    const id = Number(localStorage.getItem("userId"));
    const ad = localStorage.getItem("userAd");

    if (!id || isNaN(id) || !ad) {
      alert("Yorum gönderebilmek için giriş yapmalısınız.");
      window.location.href = "/login";
      return;
    }

    setKullaniciId(id);
    yorumlariGetir();

    fetch("/api/location/iller")
      .then((res) => res.json())
      .then(setIller)
      .catch((err) => console.error("İller alınamadı", err));
  }, []);

  useEffect(() => {
    if (konum.ilId) {
      fetch(`/api/location/ilceler?ilId=${konum.ilId}`)
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
      fetch(`/api/location/mahalleler?ilceId=${konum.ilceId}`)
        .then((res) => res.json())
        .then(setMahalleler)
        .catch((err) => console.error("Mahalleler alınamadı", err));
    } else {
      setMahalleler([]);
    }
  }, [konum.ilceId]);

  const yorumlariGetir = async () => {
    try {
      const response = await fetch("/api/comments");
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
      y_ilId: Number(konum.ilId),
      y_ilceId: Number(konum.ilceId),
      y_mahalleId: Number(konum.mahalleId),
    };

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(yeniYorumObj),
      });

      if (!response.ok) throw new Error("Sunucu hatası");

      alert("Yorum başarıyla gönderildi.");
      await yorumlariGetir();
      setYeniYorum("");
      setKonum({ ilId: "", ilceId: "", mahalleId: "" });
      setSeciliKategori("market");
      setAktifKategori("market");
    } catch (error) {
      console.error("Yorum gönderilemedi:", error.message);
      alert("Yorum gönderilemedi.");
    }
  };

  const secilenYorumlar = tumYorumlar.filter(
    (yorum) => yorum.kategori?.toLowerCase() === aktifKategori.toLowerCase()
  );

  const formatCategory = (category) => {
    return category[0].toLocaleUpperCase("tr-TR") + category.slice(1);
  };

  return (
    <div className="home-container">
      <div className="sidebar">
        <h4>Kategoriler</h4>
        <ul className="category-list">
          {categories.map((cat) => (
            <li
              key={cat}
              className={cat === aktifKategori ? "active" : ""}
              onClick={() => setAktifKategori(cat)}
            >
              {formatCategory(cat)}
            </li>
          ))}
        </ul>
      </div>

      <div className="content-area">
        <h3>{formatCategory(aktifKategori)}</h3>
        <p className="sub-heading">
          {aktifKategori} hakkında deneyimlerinizi paylaşın ve diğer kullanıcıların yorumlarını okuyun.
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
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {formatCategory(cat)}
              </option>
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
                  <strong>{entry.User?.ad || "Anonim"}</strong>
                  <span className="entry-location">
                    {entry.yorumIl?.il_adi} / {entry.yorumIlce?.ilce_adi} / {entry.yorumMahalle?.mahalle_adi}
                  </span>
                </div>
                <p className="entry-text">{entry.icerik}</p>
                <div className="entry-meta">
                  {new Date(entry.createdAt).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
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