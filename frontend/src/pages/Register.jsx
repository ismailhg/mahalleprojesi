import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [ad, setAd] = useState("");
  const [soyad, setSoyad] = useState("");
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [iller, setIller] = useState([]);
  const [ilceler, setIlceler] = useState([]);
  const [mahalleler, setMahalleler] = useState([]);
  const [konum, setKonum] = useState({ ilId: "", ilceId: "", mahalleId: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/location/iller")
      .then((res) => res.json())
      .then(setIller);
  }, []);

  useEffect(() => {
    if (konum.ilId) {
      fetch(`/api/location/ilceler?ilId=${konum.ilId}`)
        .then((res) => res.json())
        .then(setIlceler);
    }
  }, [konum.ilId]);

  useEffect(() => {
    if (konum.ilceId) {
      fetch(`/api/location/mahalleler?ilceId=${konum.ilceId}`)
        .then((res) => res.json())
        .then(setMahalleler);
    }
  }, [konum.ilceId]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!ad || !soyad || !email || !sifre || !konum.mahalleId) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    const yeniKullanici = {
      ad,
      soyad,
      email,
      sifre,
      il_id: parseInt(konum.ilId),
      ilce_id: parseInt(konum.ilceId),
      mahalle_id: parseInt(konum.mahalleId),
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(yeniKullanici),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Kayıt başarısız");
        return;
      }

      alert("Kayıt başarılı! Giriş yapabilirsiniz.");
      navigate("/login");
    } catch (error) {
      alert("Kayıt sırasında hata oluştu.");
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Ad"
          value={ad}
          onChange={(e) => setAd(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Soyad"
          value={soyad}
          onChange={(e) => setSoyad(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={sifre}
          onChange={(e) => setSifre(e.target.value)}
          required
        />

        <select
          value={konum.ilId}
          onChange={(e) =>
            setKonum({ ilId: e.target.value, ilceId: "", mahalleId: "" })
          }
          required
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
          required
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
          required
          disabled={!konum.ilceId}
        >
          <option value="">Mahalle Seçiniz</option>
          {mahalleler.map((m) => (
            <option key={m.id} value={m.id}>
              {m.ad}
            </option>
          ))}
        </select>

        <button type="submit">Kayıt Ol</button>
      </form>
    </div>
  );
};

export default Register;
