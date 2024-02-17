import React, { useEffect, useCallback, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TicketsPage from "./pages/Tickets";
import UsersPage from "./pages/Users";
import EventsPage from "./pages/Events";

const App = function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<EventsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
