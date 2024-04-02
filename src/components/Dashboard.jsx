import { Link, useLocation } from "react-router-dom";

const Dashboard = ({ children }) => {
  const inactiveLink = "flex gap-1 p-1";
  const activelink = inactiveLink + " bg-white text-[#1F1C2B] rounded-l-md";

  let location = useLocation();
  console.log(location);
  return (
    <div className="flex min-h-screen bg-[#1F1C2B]">
      <aside className="p-4 pr-0 text-white transition-all">
        <Link to="/" className="flex gap-1 pb-8 pr-4 text-4xl">
          <span>GearGuide</span>
        </Link>
        <nav className="flex flex-col gap-1 font-bold">
          <Link
            to="/dashboard/games"
            className={
              location.pathname === "/dashboard/games"
                ? activelink
                : inactiveLink
            }
          >
            Games
          </Link>
          <Link
            to="/dashboard/players"
            className={
              location.pathname === "/dashboard/players"
                ? activelink
                : inactiveLink
            }
          >
            Players
          </Link>
          <Link
            to="/dashboard/earphones"
            className={
              location.pathname === "/dashboard/earphones"
                ? activelink
                : inactiveLink
            }
          >
            Earphones
          </Link>
          <Link
            to="/dashboard/headsets"
            className={
              location.pathname === "/dashboard/headsets"
                ? activelink
                : inactiveLink
            }
          >
            Headsets
          </Link>
          <Link
            to="/dashboard/mice"
            className={
              location.pathname === "/dashboard/mice"
                ? activelink
                : inactiveLink
            }
          >
            Mice
          </Link>
          <Link
            to="/dashboard/mousepads"
            className={
              location.pathname === "/dashboard/mousepads"
                ? activelink
                : inactiveLink
            }
          >
            Mousepads
          </Link>
          <Link
            to="/dashboard/monitors"
            className={
              location.pathname === "/dashboard/monitors"
                ? activelink
                : inactiveLink
            }
          >
            Monitors
          </Link>
          <Link
            to="/dashboard/keyboards"
            className={
              location.pathname === "/dashboard/keyboards"
                ? activelink
                : inactiveLink
            }
          >
            Keyboards
          </Link>
        </nav>
      </aside>
      <div className="mb-2 mr-2 mt-2 flex-grow rounded-md bg-white p-10">
        {children}
      </div>
    </div>
  );
};

export default Dashboard;
