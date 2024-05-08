import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { supabase } from "../db/supabaseClient";
import GameCard from "../components/GameCard";
const Home = ({ session, setSession }) => {
  const [games, setGames] = useState([]);

  async function fetchGamesData() {
    try {
      const { data, error } = await supabase.from("games").select("*");
      if (error) {
        throw error;
      }
      console.log(data);
      setGames(data);
    } catch (error) {
      console.error("Erro ao recuperar dados:", error.message);
    }
  }

  useEffect(() => {
    fetchGamesData();
  }, []);
  return (
    <div className="h-full min-h-screen bg-[#1F1C2B]">
      <Navbar session={session} setSession={setSession} />
      <div className="lg:px-30 px-10 pt-6 text-white sm:px-32 md:px-20 xl:px-56 ">
        <section>
          <h2 className="text-3xl font-bold">Games</h2>
          <div className="grid grid-cols-1 gap-12 pt-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {games.map((game) => (
              <GameCard key={game.game_id} game={game} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
