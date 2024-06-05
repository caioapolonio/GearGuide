import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../db/supabaseClient";
import Navbar from "../components/Navbar";
import { Box } from "lucide-react";
import { Button, Table } from "@mantine/core";
import Container from "../components/Container";
import Footer from "../components/Footer";
import PageLayout from "../components/PageLayout";
import GridContainer from "../components/GridContainer";
import { useAuth } from "../hooks/AuthContext";

const PlayerPage = () => {
  const { playerID } = useParams();
  const [player, setPlayer] = useState({});
  const [gears, setGears] = useState({});
  const [follow, setFollow] = useState(false);
  const { session } = useAuth();

  useEffect(() => {
    fetchPlayer();
    fetchGears();
    console.log("gears Array", gearsArr);
    if (session) {
      checkFollow();
    }
  }, []);

  async function fetchPlayer() {
    try {
      const { data, error } = await supabase
        .from("players")
        .select(
          `
        player_id,
        name,
        fullname,
        image_url,
        birthday,
        teams (team_id, name, image_url),
        countries (country_id, name, image_url)
        `,
        )
        .eq("player_id", playerID)
        .single();
      if (error) {
        throw error;
      }
      console.log("Player", data);
      setPlayer(data);
    } catch (error) {
      console.error("Erro ao recuperar dados:", error.message);
    }
  }

  async function fetchGears() {
    try {
      const { data, error } = await supabase
        .from("players")
        .select(
          `
           monitors(monitor_id, name, image_url),
           mice(mouse_id, name, image_url),
           keyboards(keyboard_id, name, image_url),
           headsets(headset_id, name, image_url),
           mousepads(mousepad_id, name, image_url),
           earphones(earphone_id, name, image_url)
           `,
        )
        .eq("player_id", playerID)
        .single();

      if (error) {
        throw error;
      }
      console.log("Gears", data);
      setGears(data);
    } catch (error) {
      console.error("Erro ao recuperar dados:", error.message);
    }
  }
  const gearsArr = Object.values(gears);
  const gearsArrFiltered = gearsArr.filter((gear) => gear.name !== "N/A");

  async function checkFollow() {
    try {
      const { data, error } = await supabase
        .from("user_follow_player")
        .select(
          `
        player_id,
        user_id
      `,
        )
        .match({ player_id: playerID, user_id: session.user.id });

      if (error) {
        throw error;
      }
      console.log("checkFollow", data);

      if (data.length > 0) {
        setFollow(true);
        return true;
      }
    } catch (error) {
      console.error("Erro ao recuperar dados de seguindo:", error.message);
    }
  }

  async function handleUnfollow() {
    try {
      const { data, error } = await supabase
        .from("user_follow_player")
        .delete()
        .match({ player_id: playerID, user_id: session.user.id })
        .select();

      if (error) {
        throw error;
      }
      console.log("handleUnfollow", data);
    } catch (error) {
      console.error("Erro ao recuperar dados de seguindo:", error.message);
    }
    setFollow(!follow);
  }

  const handleFollow = async () => {
    const { data, error } = await supabase
      .from("user_follow_player")
      .insert({
        player_id: playerID,
        user_id: session.id,
      })
      .select();

    if (error) {
      console.log("Erro ao seguir jogador", error);
    } else {
      console.log("handleFollow", data);
    }
    setFollow(!follow);
  };

  return (
    <PageLayout>
      <Navbar />
      <Container>
        <div className="flex flex-col gap-6 rounded-3xl bg-[#373644] p-6 sm:flex-row">
          <img
            className="rounded-full ring-2 ring-white/20"
            src={player?.image_url}
            alt=""
          />
          <div className="flex h-fit w-full flex-col ">
            <div className="flex flex-row items-center justify-between pb-6 pt-2 sm:flex-col sm:gap-4 md:flex-row">
              <h2 className=" text-3xl font-bold tracking-widest	">
                {player?.name}
              </h2>
              <Button
                color={follow ? "dark" : "violet"}
                disabled={!session}
                onClick={() => {
                  follow ? handleUnfollow() : handleFollow();
                }}
              >
                {follow ? "Unfollow" : "Follow"}
              </Button>
            </div>
            <div className="group sm:hidden lg:block  lg:w-4/5 lg:text-lg">
              <Table verticalSpacing="md">
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Td>{player.fullname}</Table.Td>
                    <Table.Th>Team</Table.Th>
                    <Table.Td className="flex flex-row items-center gap-2">
                      {player?.teams?.name}
                      <img
                        className="w-5"
                        src={player?.teams?.image_url}
                        alt=""
                      />
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Birthday</Table.Th>
                    <Table.Td>
                      {new Date(
                        `${player.birthday}T00:00:00`,
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Table.Td>
                    <Table.Th>Country</Table.Th>
                    <Table.Td className="flex flex-row items-center gap-2">
                      {player?.countries?.name}
                      <img
                        className="w-5"
                        src={player?.countries?.image_url}
                        alt=""
                      />
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </div>
            <div className="hidden sm:block lg:hidden">
              <Table>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Td>{player.fullname}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Team</Table.Th>
                    <Table.Td className="flex flex-row items-center gap-2">
                      {player?.teams?.name}
                      <img
                        className="w-5"
                        src={player?.teams?.image_url}
                        alt=""
                      />
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Birthday</Table.Th>
                    <Table.Td>
                      {new Date(
                        `${player.birthday}T00:00:00`,
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Country</Table.Th>
                    <Table.Td className="flex flex-row items-center gap-2">
                      {player?.countries?.name}
                      <img
                        className="h-4"
                        src={player?.countries?.image_url}
                        alt=""
                      />
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </div>
          </div>
        </div>

        <section className="pb-10">
          <div className="relative flex items-center pt-12">
            <div className="flex-grow border-2 border-t border-[#373644]"></div>
            <span className="mx-4 flex-shrink text-3xl font-medium">
              Equipment
            </span>
            <div className="flex-grow border-2 border-t border-[#373644]"></div>
          </div>
          <div className="flex flex-row items-center">
            <Box size={58} />
            <h2 className="text-3xl font-medium">Gear</h2>
          </div>
          <GridContainer>
            {gearsArrFiltered.map((gear) => (
              <a
                href={`https://www.amazon.com.br/s?k=${encodeURIComponent(gear.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                key={gear.name}
                className="group mx-auto h-full w-full text-gray-300 sm:mx-0"
              >
                <div className="flex h-full w-full flex-col items-center gap-8 rounded-3xl bg-[#373644] p-4 transition-colors duration-300 hover:bg-[#4a4a5e]">
                  <img
                    className="h-36 w-36 object-cover "
                    src={gear.image_url}
                    alt=""
                  />
                  <span className="text-sm font-medium transition-colors duration-300 hover:text-white">
                    {gear.name}
                  </span>
                </div>
              </a>
            ))}
          </GridContainer>
        </section>
      </Container>
      <Footer />
    </PageLayout>
  );
};

export default PlayerPage;
