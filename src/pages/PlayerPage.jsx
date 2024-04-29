import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../db/supabaseClient";
import Navbar from "../components/Navbar";
import { Box } from "lucide-react";

const PlayerPage = ({ session, setSession }) => {
  const { playerID } = useParams();
  const [player, setPlayer] = useState({});

  const [gears, setGears] = useState({});

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
           earphones(earphone_id, name, image_url)`,
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
        .select("*")
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
  useEffect(() => {
    fetchPlayer();
    fetchGears();
    console.log("gears Array", gearsArr);
  }, []);

  const gearsArr = Object.values(gears);
  return (
    <div className="h-full bg-[#1F1C2B]">
      <Navbar session={session} setSession={setSession} />
      <div className="px-56 pt-6 text-white">
        <div className="flex flex-row gap-6 rounded-3xl bg-[#373644] p-6">
          <img
            className="rounded-full ring-2 ring-white/20"
            src={player.image_url}
            alt=""
          />

          <h2 className="pt-6 text-3xl font-bold tracking-widest	">
            {player.name}
          </h2>
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
          <div className="grid grid-cols-4  gap-12 pt-6">
            {gearsArr.map((gear) => (
              <div
                className="flex h-auto w-full flex-col items-center gap-9 rounded-3xl bg-[#373644] p-6"
                key={gear.name}
              >
                <img
                  className="h-fit w-fit max-w-36 rounded-full ring-2 ring-white/20"
                  src={gear.image_url}
                  alt=""
                />
                <span className="text-xl font-normal tracking-wider">
                  {gear.name}
                </span>
              </div>
            ))}
          </div>
        </section>
        <section className="pt-16">footer</section>
      </div>
    </div>
  );
};

export default PlayerPage;
