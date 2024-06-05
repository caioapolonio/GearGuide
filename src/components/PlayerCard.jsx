import { Link } from "react-router-dom";

const PlayerCard = ({ player }) => {
  return (
    <Link
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
            <img className="h-3" src={player.countries.image_url} alt="" />
          </span>
          <span className="text-md flex flex-row items-center gap-2 font-normal ">
            {player.teams.name}
            <img className="h-5" src={player.teams.image_url} alt="" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PlayerCard;
