import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { BarChart4, List, LogOut, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../db/supabaseClient";
import LoginBtn from "./LoginBtn";
import SignUpBtn from "./SignUpBtn";
import { useEffect, useState } from "react";

const Navbar = ({ session, setSession }) => {
  const [user, setUser] = useState([]); // Add this line
  let navigate = useNavigate();

  useEffect(() => {
    handleUser();
  }, [session]);

  const handleUser = async () => {
    const { data: user } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id);
    setUser(user[0]);
    console.log("USER", user);
  };
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("handleLogout", error);
      return;
    }
    navigate("/");
    console.log("SESSION AFTER LOGOUT", session);
  };

  return (
    <nav>
      <header className="flex h-20 w-full justify-between bg-[#1b1a25] px-16">
        <div className="flex items-center">
          <Link to="/" className="text-4xl font-bold text-white ">
            GearGuide
          </Link>
        </div>
        <div className="flex items-center gap-5 text-white ">
          <input
            type="text"
            className="rounded-md p-1 text-black shadow-inner outline-none"
          />
          {session ? (
            <div>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <div className="flex items-center justify-center gap-2 hover:cursor-pointer ">
                    <div className="h-12 w-12 ">
                      <img className="rounded-full" src={user.avatar_url} />
                    </div>
                    <span className="text-2xl">{user.username}</span>
                  </div>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[300px] rounded-md bg-[#494657] p-4 shadow-md"
                    sideOffset={2}
                    align="end"
                    alignOffset={-20}
                  >
                    <DropdownMenu.Item className=" group flex items-center gap-1 rounded-md py-1 text-[#CDC6CD] outline-none transition-all hover:cursor-pointer hover:text-white">
                      <UserRound />
                      <span className="text-md ">Meu Perfil</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="h-[1px] bg-[#CDC6CD] " />
                    {user.role === "admin" && (
                      <DropdownMenu.Item className="group flex items-center gap-1 rounded-md py-1 text-[#CDC6CD] outline-none transition-all hover:cursor-pointer hover:text-white">
                        <BarChart4 />
                        <Link to="/dashboard/games" className="text-md">
                          Dashboard
                        </Link>
                      </DropdownMenu.Item>
                    )}

                    <DropdownMenu.Separator className="h-[1px] bg-[#CDC6CD]  " />

                    <DropdownMenu.Item className=" group flex items-center gap-1 rounded-md py-1 text-[#CDC6CD] outline-none transition-all hover:cursor-pointer hover:text-white">
                      <LogOut />
                      <button onClick={handleLogout}>Sair</button>
                    </DropdownMenu.Item>

                    <DropdownMenu.Arrow className="fill-[#494657]" />
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          ) : (
            <div className=" flex items-center justify-center gap-3">
              <LoginBtn session={session} setSession={setSession} />
              <SignUpBtn />
            </div>
          )}
        </div>
      </header>
    </nav>
  );
};

export default Navbar;
