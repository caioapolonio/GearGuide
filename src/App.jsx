import { supabase } from "./db/supabaseClient";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Players from "./pages/dashboard/Players";
import Games from "./pages/dashboard/Games";
import Earphones from "./pages/dashboard/Earphones";
import Keyboards from "./pages/dashboard/Keyboards";
import Headsets from "./pages/dashboard/Headsets";
import Mousepads from "./pages/dashboard/Mousepads";
import Monitors from "./pages/dashboard/Monitors";
import Mice from "./pages/dashboard/Mice";
import { MantineProvider } from "@mantine/core";
import GamePage from "./pages/GamePage";
import PlayerPage from "./pages/PlayerPage";
import ProtectedRouteAdmin from "./components/ProtectedRouteAdmin";
import { AuthProvider } from "./hooks/AuthContext";
import Teams from "./pages/dashboard/Teams";
const App = () => {
  return (
    <MantineProvider defaultColorScheme="dark">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path={"/game/:gameID"} element={<GamePage />} />
          <Route path={"/player/:playerID"} element={<PlayerPage />} />
          <Route
            path={"/dashboard/games"}
            element={
              <ProtectedRouteAdmin>
                <Games />
              </ProtectedRouteAdmin>
            }
          />
          <Route
            path={"/dashboard/players"}
            element={
              <ProtectedRouteAdmin>
                <Players />
              </ProtectedRouteAdmin>
            }
          />
          <Route
            path={"/dashboard/earphones"}
            element={
              <ProtectedRouteAdmin>
                <Earphones />
              </ProtectedRouteAdmin>
            }
          />
          <Route
            path={"/dashboard/headsets"}
            element={
              <ProtectedRouteAdmin>
                <Headsets />
              </ProtectedRouteAdmin>
            }
          />
          <Route
            path={"/dashboard/mice"}
            element={
              <ProtectedRouteAdmin>
                <Mice />
              </ProtectedRouteAdmin>
            }
          />
          <Route
            path={"/dashboard/mousepads"}
            element={
              <ProtectedRouteAdmin>
                <Mousepads />
              </ProtectedRouteAdmin>
            }
          />
          <Route
            path={"/dashboard/monitors"}
            element={
              <ProtectedRouteAdmin>
                <Monitors />
              </ProtectedRouteAdmin>
            }
          />
          <Route
            path={"/dashboard/keyboards"}
            element={
              <ProtectedRouteAdmin>
                <Keyboards />
              </ProtectedRouteAdmin>
            }
          />
          <Route
            path={"/dashboard/teams"}
            element={
              <ProtectedRouteAdmin>
                <Teams />
              </ProtectedRouteAdmin>
            }
          />
        </Routes>
      </AuthProvider>
    </MantineProvider>
  );
};

export default App;
