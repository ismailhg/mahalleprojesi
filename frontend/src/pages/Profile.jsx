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

  const userId = localStorage.getItem("userId");

  // Kullanıcı verisini getir
  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    fetch(`/api/user/${userId}`)
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
      })
      .catch((err) => {
        alert("Kullanıcı verisi alınamadı.");
        console.error(err);
      });
  }, [userId, navigate]);

  // İl listesini getir
  useEffect(() => {
    fetch("/api/location/iller")
      .then((res) => res.json())
      .then(setIller)
      .catch(() => alert("İller alınamadı."));
  }, []);

  // İl değişince ilçeleri getir
  useEffect(() => {
    if (userData.il_id) {
      fetch(`/api/location/ilceler?ilId=${userData.il_id}`)
        .then((res) => res.json())
        .then(setIlceler)
        .catch(() => alert("İlçeler alınamadı."));
    } else {
      setIlceler([]);
      setMahalleler([]);
    }
  }, [userData.il_id]);

  // İlçe değişince mahalleleri getir
  useEffect(() => {
    if (userData.ilce_id) {
      fetch(`/api/location/mahalleler?ilceId=${userData.ilce_id}`)
        .then((res) => res.json())
        .then(setMahalleler)
        .catch(() => alert("Mahalleler alınamadı."));
    } else {
      setMahalleler([]);
    }
  }, [userData.ilce_id]);

  // Form input değişimi
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "il_id" && { ilce_id: "", mahalle_id: "" }),
      ...(name === "ilce_id" && { mahalle_id: "" }),
    }));
  };

  // Form submit ile güncelle
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basit validation
    if (!userData.ad || !userData.soyad || !userData.email) {
      alert("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    try {
      const res = await fetch(`/api/user/${userId}`, {
        method: "PUT", // ya da backend ne destekliyorsa POST olabilir
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.error || "Güncelleme başarısız.");
        return;
      }

      alert("Bilgiler başarıyla güncellendi.");
      // istersen buraya ekstra işlem ekleyebilirsin
    } catch (error) {
      alert("Güncelleme sırasında hata oluştu.");
      console.error(error);
    }
  };

  return (
    <div className="profile-container">
      <h2>Profil Bilgilerim</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="ad"
          type="text"
          placeholder="Ad"
          value={userData.ad}
          onChange={handleChange}
          required
        />
        <input
          name="soyad"
          type="text"
          placeholder="Soyad"
          value={userData.soyad}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="E-posta"
          value={userData.email}
          onChange={handleChange}
          required
        />

        <select
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

        <select
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

        <select
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

        <button type="submit">Bilgilerimi Güncelle</button>
      </form>
    </div>
  );
};

export default Profile;
