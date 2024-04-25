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
    <div className="h-screen bg-[#1F1C2B]">
      <Navbar session={session} setSession={setSession} />
      <div className="px-56 pt-6 text-white">
        <section>
          <h2 className="text-3xl font-bold">Games</h2>
          <div className="grid grid-cols-1 pt-10 md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4">
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
