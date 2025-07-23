import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MahallemPage from "./pages/MahallemPage";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/mahallemPage" element={<MahallemPage />} />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
