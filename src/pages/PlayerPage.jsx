import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../db/supabaseClient";
import Navbar from "../components/Navbar";
import { Box } from "lucide-react";
import { Button, Table } from "@mantine/core";

const PlayerPage = ({ session, setSession }) => {
  const { playerID } = useParams();
  const [player, setPlayer] = useState({});
  const [gears, setGears] = useState({});
  const [follow, setFollow] = useState(false);

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
      console.log("User follows data", data);
    }
    setFollow(!follow);
  };

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
    console.log("checkFollow", checkFollow);
  }

  const gearsArr = Object.values(gears);

  useEffect(() => {
    fetchPlayer();
    fetchGears();
    console.log("gears Array", gearsArr);
    if (session) {
      checkFollow();
    }
  }, [session]);

  return (
    <div className="h-full min-h-screen bg-[#1F1C2B]">
      <Navbar session={session} setSession={setSession} />
      <div className="lg:px-30 px-10 pt-6 text-white sm:px-20 md:px-20  xl:px-56">
        <div className="flex flex-col gap-6 rounded-3xl bg-[#373644] p-6 sm:flex-row">
          <img
            className="rounded-full ring-2 ring-white/20"
            src={player?.image_url}
            alt=""
          />
          <div className="flex h-fit w-full flex-col ">
            <div className="flex flex-row items-center justify-between pb-3 pt-2 sm:flex-col sm:gap-4 md:flex-row">
              <h2 className=" text-3xl font-bold tracking-widest	">
                {player?.name}
              </h2>
              <Button color="violet" disabled={!session} onClick={handleFollow}>
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
                      {new Date(player.birthday).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Table.Td>
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
                      {new Date(player.birthday).toLocaleDateString("en-US", {
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

        <section>
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
          <div className="grid grid-cols-1 gap-12 pt-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {gearsArr.map((gear) => (
              <a
                href={`https://www.amazon.com.br/s?k=${encodeURIComponent(gear.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                key={gear.name}
                className="group"
              >
                <div className="flex h-[300px] w-full flex-col items-center gap-9 rounded-3xl bg-[#373644] p-6 2xl:w-[230px]  ">
                  <img
                    className="h-fit w-fit max-w-36"
                    src={gear.image_url}
                    alt=""
                  />
                  <span className="text-md  font-normal  group-hover:font-medium">
                    {gear.name}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
        <section className="pt-16">footer</section>
      </div>
    </div>
  );
};

export default PlayerPage;
