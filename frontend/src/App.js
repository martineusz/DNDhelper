import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Dashboard from "./components/dashboard/Dashboard";
import Encounters from "./components/pages/encounters/myEncounters/Encounters";
import EncounterView from "./components/pages/encounters/encounterView/EncounterView";
import QuickEncounter from "./components/pages/quickEncounter/QuickEncounter";
import EncounterCreator from "./components/pages/encounters/encounterCreator/EncounterCreator";
import Campaigns from "./components/pages/campaigns/Campaigns";
import Players from "./components/pages/players/Players";
import Monsters from "./components/pages/compendium/monsters/Monsters";
import Spells from "./components/pages/compendium/spells/Spells";
import SpellPage from "./components/pages/compendium/spells/SpellPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected dashboard pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="encounter-creator" element={<EncounterCreator />} />
          <Route path="encounters" element={<Encounters />} />
          <Route path="encounters/:id" element={<EncounterView />} />
          <Route path="quick" element={<QuickEncounter />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="players" element={<Players />} />
          <Route path="monsters" element={<Monsters />} />
          <Route path="spells" element={<Spells />} />
          <Route path="spells/:slug" element={<SpellPage />} />
          <Route index element={<Navigate to="encounters" />} />
        </Route>

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to={localStorage.getItem("access_token") ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;