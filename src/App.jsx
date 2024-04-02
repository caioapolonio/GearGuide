import { supabase } from "./db/supabaseClient";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Players from "./pages/[dashboard]/Players";
import Games from "./pages/[dashboard]/Games";
import Earphones from "./pages/[dashboard]/Earphones";
import Keyboards from "./pages/[dashboard]/Keyboards";
import Headsets from "./pages/[dashboard]/Headsets";
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
          element={<Earphones session={session} setSession={setSession} />}
        />
        <Route
          path={"/dashboard/mousepads"}
          element={<Earphones session={session} setSession={setSession} />}
        />
        <Route
          path={"/dashboard/monitors"}
          element={<Earphones session={session} setSession={setSession} />}
        />
        <Route
          path={"/dashboard/keyboards"}
          element={<Keyboards session={session} setSession={setSession} />}
        />
      </Routes>
    </div>
  );
};

export default App;
