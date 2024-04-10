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
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
const App = () => {
  const [session, setSession] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <MantineProvider defaultColorScheme="dark">
      <div>
        <Routes>
          <Route
            path="/"
            element={<Home session={session} setSession={setSession} />}
          />
          <Route
            path={"/dashboard/games"}
            element={<Games session={session} setSession={setSession} />}
          />
          <Route
            path={"/dashboard/players"}
            element={<Players session={session} setSession={setSession} />}
          />
          <Route
            path={"/dashboard/earphones"}
            element={<Earphones session={session} setSession={setSession} />}
          />
          <Route
            path={"/dashboard/headsets"}
            element={<Headsets session={session} setSession={setSession} />}
          />
          <Route
            path={"/dashboard/mice"}
            element={<Mice session={session} setSession={setSession} />}
          />
          <Route
            path={"/dashboard/mousepads"}
            element={<Mousepads session={session} setSession={setSession} />}
          />
          <Route
            path={"/dashboard/monitors"}
            element={<Monitors session={session} setSession={setSession} />}
          />
          <Route
            path={"/dashboard/keyboards"}
            element={<Keyboards session={session} setSession={setSession} />}
          />
        </Routes>
      </div>
    </MantineProvider>
  );
};

export default App;
