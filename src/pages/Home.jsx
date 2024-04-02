import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../db/supabaseClient";

const Home = ({ session, setSession }) => {
  console.log("SESSION", session);

  return (
    <div>
      <div className="h-screen bg-[#1F1C2B]">
        <Navbar session={session} setSession={setSession} />
        <div className="flex flex-col items-center justify-center "></div>
      </div>
    </div>
  );
};

export default Home;
