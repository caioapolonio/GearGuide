import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../db/supabaseClient";
import Navbar from "../components/Navbar";

const GamePage = ({ session, setSession }) => {
  const { gameID } = useParams();
  const [game, setGame] = useState({});
  const [players, setPlayers] = useState([]);

  async function fetchPlayersGames() {
    try {
      const { data, error } = await supabase
        .from("games_has_players")
        .select(
          `
        player_id,
        game_id,
        games ( game_id ),
        players ( player_id, name, image_url)
      `,
        )
        .eq("game_id", gameID);

      if (error) {
        throw error;
      }
      console.log("Players", data);
      setPlayers(data);
    } catch (error) {
      console.error("Erro ao recuperar dados:", error.message);
    }
  }

  async function fetchGame() {
    try {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .eq("game_id", gameID)
        .single();
      if (error) {
        throw error;
      }
      console.log("Game", data);
      setGame(data);
    } catch (error) {
      console.error("Erro ao recuperar dados:", error.message);
    }
  }
  useEffect(() => {
    fetchGame();
    fetchPlayersGames();
  }, []);
  return (
    <div className="h-full min-h-screen bg-[#1F1C2B]">
      <Navbar session={session} setSession={setSession} />
      <div className="lg:px-30 px-10 pt-6 text-white sm:px-20 md:px-20 xl:px-56 ">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="h-[360px] w-[320px] overflow-hidden rounded-3xl">
            <img
              className="h-full w-full object-cover"
              src={game.image_url}
              alt=""
            />
          </div>
          <h2 className="pt-6 text-3xl font-bold tracking-widest	">
            {game.name}
          </h2>
        </div>
        <section className="mt-4 border-t-2 border-neutral-500 pt-6">
          <h3 className="text-3xl font-medium">Top {game.name} players</h3>
          <div className="grid grid-cols-1 gap-12 pt-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {players.map((player) => {
              return (
                <Link
                  key={player.players.player_id}
                  className="mx-auto w-fit sm:mx-0"
                  to={`/player/${player.player_id}`}
                >
                  <div className=" flex h-[380px] w-[334px] flex-col items-center rounded-3xl bg-[#373644] p-6 sm:w-full">
                    <img
                      className="rounded-full ring-2 ring-white/20"
                      src={player.players.image_url}
                      alt=""
                    />
                    <span className="pt-8 text-xl font-normal tracking-wider">
                      {player.players.name}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default GamePage;
