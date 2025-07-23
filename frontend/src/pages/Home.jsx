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
    const id = parseInt(localStorage.getItem("userId"));
    const ad = localStorage.getItem("userAd");

    if (!id || !ad) {
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
    } catch (error) {
      console.error("Yorum gönderilemedi:", error.message);
      alert("Yorum gönderilemedi.");
    }
  };

  const secilenYorumlar = tumYorumlar.filter(
    (yorum) => yorum.kategori?.toLowerCase() === aktifKategori.toLowerCase()
  );

  return (
    <div className="home-container">
      {/* Kategoriler */}
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

      {/* İçerik alanı */}
      <div className="content-area">
        <h3>{aktifKategori}</h3>

        {/* Form */}
        <div className="yorum-form">
          <textarea
            placeholder="Yorumunuzu yazın"
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
                {cat}
              </option>
            ))}
          </select>

          <button onClick={yorumGonder}>Yorum Gönder</button>
        </div>

        {/* Yorumlar */}
        <div className="entry-list">
          {loading ? (
            <p>Yükleniyor...</p>
          ) : secilenYorumlar.length > 0 ? (
            secilenYorumlar.map((entry) => (
              <div key={entry.id} className="entry-card">
                <p>{entry.icerik}</p>
                <div className="entry-meta">
                  — {entry.User?.ad} ({entry.yorumIl?.il_adi} /{" "}
                  {entry.yorumIlce?.ilce_adi} /{" "}
                  {entry.yorumMahalle?.mahalle_adi})
                </div>
              </div>
            ))
          ) : (
            <p>Bu kategoriye ait henüz yorum yok.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
