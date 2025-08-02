import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MahallemPage from "./pages/MahallemPage";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import { Navigate } from "react-router-dom";

function App() {
  return (
    <Router basename="/">
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/mahallemPage" element={<MahallemPage />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/sifre-sifirla/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
