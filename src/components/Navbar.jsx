import { BarChart4, LogOut, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../db/supabaseClient";
import LoginBtn from "./LoginBtn";
import SignUpBtn from "./SignUpBtn";
import { useEffect, useState } from "react";
import { Modal, Menu } from "@mantine/core";

const Navbar = ({ session, setSession }) => {
  const [openFollowing, setOpenFollowing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({});
  let navigate = useNavigate();

  useEffect(() => {
    if (session) {
      handleUser();
      console.log("user logged in");
    }
  }, [session]);

  const handleUser = async () => {
    const { data: user } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();
    setUser(user);
    console.log("USER", user);
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
      <Modal
        opened={openFollowing}
        onClose={() => setOpenFollowing(false)}
        centered
        title="Following"
      >
        eita bixo
      </Modal>

      <header className="sticky top-0 z-10 mx-auto flex min-h-20 w-full flex-wrap items-center justify-between overflow-hidden bg-[#1b1a25] p-6 md:px-16">
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
                  onClick={() => setOpenFollowing(true)}
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
                      <Menu.Item leftSection={<BarChart4 />}>
                        <Link to="/dashboard/games" className="text-md">
                          Dashboard
                        </Link>
                      </Menu.Item>
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
              <LoginBtn session={session} setSession={setSession} />
              <SignUpBtn />
            </div>
          )}
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X color="white" /> : <Menu color="white" />}
          </button>
        </div>
        {isOpen && (
          <div className="mt-4 flex basis-full flex-col items-center gap-6 border-t-2 border-neutral-500 pt-8 transition-all md:hidden">
            <LoginBtn session={session} setSession={setSession} />
            <SignUpBtn />
          </div>
        )}
      </header>
    </nav>
  );
};

export default Navbar;
