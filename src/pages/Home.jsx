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
import { useAuth } from "../hooks/AuthContext";
import { set } from "react-hook-form";
import SkeletonGameCard from "../components/SkeletonGameCard";
import PlayerCard from "../components/PlayerCard";
import SkeletonPlayerCard from "../components/SkeletonPlayerCard";
const Home = () => {
  const { session } = useAuth();

  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchGamesData = async () => {
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
  };

  const fetchPlayersData = async () => {
    setLoading(true);
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
        setLoading(false);
        throw error;
      }
      console.log("fetchPlayersData", data);
      setPlayers(data);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao recuperar dados:", error.message);
    }
  };

  useEffect(() => {
    fetchPlayersData();
    fetchGamesData();
  }, []);

  return (
    <PageLayout>
      <Navbar session={session} />
      <Container>
        <section className="pb-10">
          <h2 className="text-3xl font-bold">Games</h2>
          <GridContainer>
            {loading ? (
              <SkeletonGameCard />
            ) : (
              games.map((game) => <GameCard key={game.game_id} game={game} />)
            )}
          </GridContainer>
        </section>
        <section className="pb-10">
          <div className="flex justify-between">
            <h2 className="text-3xl font-bold">Recent added players</h2>
            <Button variant="outline">See more</Button>
          </div>
          <GridContainer>
            {loading ? (
              <SkeletonPlayerCard />
            ) : (
              players.map((player) => (
                <PlayerCard key={player.player_id} player={player} />
              ))
            )}
          </GridContainer>
        </section>
      </Container>
      <Footer />
    </PageLayout>
  );
};

export default Home;
