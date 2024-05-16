import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { supabase } from "../db/supabaseClient";
import GameCard from "../components/GameCard";
import Container from "../components/Container";
import { Link } from "react-router-dom";
import { Button } from "@mantine/core";
import GridContainer from "../components/GridContainer";
import Footer from "../components/Footer";
import PageLayout from "../components/PageLayout";
const Home = ({ session, setSession }) => {
  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState([]);

  async function fetchGamesData() {
    try {
      const { data, error } = await supabase.from("games").select("*");
      if (error) {
        throw error;
      }
      console.log("fetchGamesData", data);
      setGames(data);
    } catch (error) {
      console.error("Erro ao recuperar dados:", error.message);
    }
  }

  async function fetchPlayersData() {
    try {
      const { data, error } = await supabase
        .from("players")
        .select(
          `
        player_id,
        name,
        image_url,
        teams (name, image_url),
        countries (name, image_url)
        `,
        )
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) {
        throw error;
      }
      console.log("fetchPlayersData", data);
      setPlayers(data);
    } catch (error) {
      console.error("Erro ao recuperar dados:", error.message);
    }
  }

  useEffect(() => {
    fetchGamesData();
    fetchPlayersData();
  }, []);
  return (
    <PageLayout>
      <Navbar session={session} setSession={setSession} />
      <Container>
        <section className="pb-10">
          <h2 className="text-3xl font-bold">Games</h2>
          <GridContainer>
            {games.map((game) => (
              <GameCard key={game.game_id} game={game} />
            ))}
          </GridContainer>
        </section>
        <section className="pb-10">
          <div className="flex justify-between">
            <h2 className="text-3xl font-bold">Recent added players</h2>
            <Button variant="outline">See more</Button>
          </div>
          <GridContainer>
            {players.map((player) => {
              return (
                <Link
                  key={player.player_id}
                  className="group mx-auto h-full w-full text-gray-300 sm:mx-0"
                  to={`/player/${player.player_id}`}
                >
                  <div className="flex h-full w-full flex-col items-center gap-8 rounded-3xl bg-[#373644] p-4 transition-colors duration-300 hover:bg-[#4a4a5e]">
                    <img
                      className="h-36 w-36 rounded-full ring-2 ring-white/20"
                      src={player.image_url}
                      alt=""
                    />
                    <div className="flex flex-col items-center gap-1">
                      <span className="flex flex-row items-center gap-2 text-lg font-medium transition-colors duration-300 hover:text-white">
                        {player.name}
                        <img
                          className="h-3"
                          src={player.countries.image_url}
                          alt=""
                        />
                      </span>
                      <span className="text-md flex flex-row items-center gap-2 font-normal ">
                        {player.teams.name}
                        <img
                          className="h-5"
                          src={player.teams.image_url}
                          alt=""
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </GridContainer>
        </section>
      </Container>
      <Footer />
    </PageLayout>
  );
};

export default Home;
