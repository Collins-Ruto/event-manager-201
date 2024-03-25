import React, { useEffect, useCallback, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TicketsPage from "./pages/Tickets";
import UsersPage from "./pages/Users";
import AssetsPage from "./pages/Assets";

const App = function AppWrapper() {
  return (
    <div
      className=""
      style={{ background: "#000", minHeight: "100vh", color: "white" }}
    >
      <Router>
        <Routes>
          <Route exact path="/" element={<AssetsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
