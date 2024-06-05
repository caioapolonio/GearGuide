import { BarChart4, LogOut, X, Menu as MenuIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../db/supabaseClient";
import LoginBtn from "./LoginBtn";
import SignUpBtn from "./SignUpBtn";
import { useEffect, useState } from "react";
import { Modal, Menu } from "@mantine/core";
import { set } from "react-hook-form";
import { useAuth } from "../hooks/AuthContext";

const Navbar = () => {
  const [openFollowing, setOpenFollowing] = useState(false);
  const [following, setFollowing] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({});
  const { session } = useAuth();
  let navigate = useNavigate();

  useEffect(() => {
    if (session) {
      handleUser();
      console.log("user logged in");
    }
  }, [session]);

  async function handleFollowing() {
    try {
      const { data, error } = await supabase
        .from("user_follow_player")
        .select(
          `
        player_id,
        user_id,
        players (name, player_id, image_url, team)
      `,
        )
        .eq("user_id", session.user.id);

      if (error) {
        throw error;
      }
      console.log("handleFollowing", data);
      setFollowing(data);
    } catch (error) {
      console.error("Erro ao recuperar dados de seguindo:", error.message);
    }
  }

  const handleUser = async () => {
    try {
      const { data: user, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        throw error;
      }

      setUser(user);
      console.log("USER", user);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("ERRO AO FAZER SIGNOUT", error);
      return;
    }
    navigate("/");
    console.log("SESSION AFTER LOGOUT", session);
  };

  return (
    <nav>
      <header className="sticky top-0 z-10 mx-auto flex min-h-20 w-full flex-wrap items-center justify-between overflow-hidden bg-[#1b1a25] p-6 text-white md:px-16">
        <div className="flex items-center">
          <Link to="/" className="text-4xl font-bold text-white ">
            GearGuide
          </Link>
        </div>

        <div className="hidden items-center gap-5 text-white md:flex">
          {session ? (
            <div className="flex flex-row items-center gap-6">
              <div>
                <button
                  onClick={() => {
                    setOpenFollowing(true);
                    handleFollowing();
                  }}
                  className="cursor-pointer font-medium"
                >
                  Following
                </button>
              </div>
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <div className="flex items-center justify-center gap-2 hover:cursor-pointer ">
                    <div className="h-12 w-12 ">
                      <img className="rounded-full" src={user.avatar_url} />
                    </div>
                    <span className="text-2xl">{user.username}</span>
                  </div>
                </Menu.Target>
                <Menu.Dropdown>
                  {user.role === "admin" && (
                    <>
                      <Link to="/dashboard/games" className="text-md">
                        <Menu.Item leftSection={<BarChart4 />}>
                          Dashboard
                        </Menu.Item>
                      </Link>

                      <Menu.Divider />
                    </>
                  )}
                  <Menu.Item
                    onClick={handleLogout}
                    color="red"
                    leftSection={<LogOut />}
                  >
                    Sair
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
          ) : (
            <div className=" flex items-center justify-center gap-3">
              <LoginBtn />
              <SignUpBtn />
            </div>
          )}
        </div>
        <div className="flex md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X color="white" /> : <MenuIcon color="white" />}
          </button>
        </div>

        {isOpen && (
          <div className="mt-4 flex basis-full flex-col items-center gap-6 border-t-2 border-neutral-500 pt-8 transition-all md:hidden">
            {!session ? (
              <>
                <LoginBtn />
                <SignUpBtn />
              </>
            ) : (
              <div>Hi</div>
            )}
          </div>
        )}
        <Modal
          opened={openFollowing}
          onClose={() => {
            setOpenFollowing(false);
          }}
          centered
          title="Following"
        >
          <div className="flex flex-col gap-4">
            {following.length === 0 && (
              <span className="text-white">
                You are not following anyone yet
              </span>
            )}
            {following.map((player) => {
              return (
                <div
                  key={player.players.player_id}
                  className="flex flex-row items-center justify-between "
                >
                  <div className="flex flex-row items-center gap-4">
                    <Link to={`/player/${player.player_id}`}>
                      <img
                        src={player.players.image_url}
                        className="h-12 rounded-full bg-white"
                        alt=""
                      />
                    </Link>

                    <div className="flex flex-col">
                      <span className="text-white">
                        <Link to={`/player/${player.player_id}`}>
                          {player.players.name}
                        </Link>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Modal>
      </header>
    </nav>
  );
};

export default Navbar;
