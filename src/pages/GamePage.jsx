import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../db/supabaseClient";
import Navbar from "../components/Navbar";
import Container from "../components/Container";
import GridContainer from "../components/GridContainer";
import PageLayout from "../components/PageLayout";
import Footer from "../components/Footer";
import { MultiSelect } from "@mantine/core";

const GamePage = ({ session, setSession }) => {
  const { gameID } = useParams();
  const [game, setGame] = useState({});
  const [playersData, setPlayersData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchGame();
    fetchPlayersGames();
  }, []);

  const filteredPlayers =
    selectedCountries.length > 0
      ? playersData.filter((player) =>
          selectedCountries.includes(String(player.country_id)),
        )
      : playersData;

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

  async function fetchPlayersGames() {
    try {
      const { data: gameHasPlayer, error: gameHasPlayerError } = await supabase
        .from("games_has_players")
        .select(
          `
        player_id,
        game_id,
        games ( game_id ),
        players ( player_id, name, image_url, team, country)
        
      `,
        )
        .eq("game_id", gameID);

      if (gameHasPlayerError) {
        throw gameHasPlayerError;
      }

      const players = await Promise.all(
        gameHasPlayer.map(async (player) => {
          const { data: teamData, error: teamError } = await supabase
            .from("teams")
            .select("*")
            .eq("team_id", player.players.team)
            .single();

          const { data: countryData, error: countryError } = await supabase
            .from("countries")
            .select("*")
            .eq("country_id", player.players.country)
            .single();

          if (teamError || countryError) {
            throw teamError || countryError;
          }
          return {
            player_id: player.players.player_id,
            name: player.players.name,
            image_url: player.players.image_url,
            team: teamData.name,
            team_id: teamData.team_id,
            team_image: teamData.image_url,
            country: countryData.name,
            country_id: countryData.country_id,
            country_image: countryData.image_url,
          };
        }),
      );

      console.log("PlayersData", players);
      setCountries(
        players.reduce((acc, country) => {
          if (!acc.some((c) => c.label === country.country)) {
            acc.push({
              label: country.country,
              value: String(country.country_id),
            });
          }
          return acc;
        }, []),
      );
      setTeams(
        players.reduce((acc, team) => {
          if (!acc.some((c) => c.label === team.team)) {
            acc.push({
              label: team.team,
              value: String(team.team_id),
            });
          }
          return acc;
        }, []),
      );
      setPlayersData(players);
    } catch (error) {
      console.error("Erro ao recuperar dados:", error.message);
    }
    console.log("Countries", countries);
    console.log("Teams", teams);
  }

  return (
    <PageLayout>
      <Navbar session={session} setSession={setSession} />
      <Container>
        <div className="mb-10 flex flex-col gap-6 border-b-2 border-neutral-500 pb-10 sm:flex-row">
          <div className="h-[360px] w-[320px] overflow-hidden rounded-3xl">
            <img
              className="h-full w-full object-cover"
              src={game.image_url}
              alt=""
            />
          </div>
          <h2 className="text-3xl font-bold tracking-widest	">{game.name}</h2>
        </div>
        <section className="pb-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row">
            <h3 className="text-3xl font-medium">Top {game.name} players</h3>
            <div className="w-full md:max-w-72">
              <MultiSelect
                data={countries}
                placeholder="Nationality"
                searchable
                value={selectedCountries}
                onChange={(i) => {
                  setSelectedCountries(i);
                }}
              />
            </div>
          </div>

          <GridContainer>
            {filteredPlayers.map((player) => {
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
                          src={player.country_image}
                          alt=""
                        />
                      </span>
                      <span className="text-md flex flex-row items-center gap-2 font-normal ">
                        {player.team}
                        <img className="h-5" src={player.team_image} alt="" />
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

export default GamePage;
