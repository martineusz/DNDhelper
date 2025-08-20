import { useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Dashboard from "./components/dashboard/Dashboard";
import Encounters from "./components/pages/encounters/Encounters";
import QuickEncounter from "./components/pages/quickEncounter/QuickEncounter";
import Campaigns from "./components/pages/campaigns/Campaigns";
import Monsters from "./components/pages/monsters/Monsters";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />

        {/* Protected dashboard pages */}
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        >
          <Route path="encounters" element={<Encounters />} />
          <Route path="quick" element={<QuickEncounter />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="monsters" element={<Monsters />} />
          <Route index element={<Navigate to="encounters" />} />
        </Route>

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
