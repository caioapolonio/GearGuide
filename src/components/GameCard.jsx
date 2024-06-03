import { Link } from "react-router-dom";

const GameCard = ({ game }) => {
  return (
    <Link
      to={`/game/${game.game_id}`}
      className="group mx-auto h-full w-full text-gray-300 sm:mx-0  "
    >
      <div className="flex h-full w-full flex-col overflow-hidden rounded-3xl rounded-b-none ">
        <img
          className="h-full w-full overflow-hidden object-cover"
          src={game.image_url}
        />
        <div className=" z-10 rounded-3xl rounded-t-none bg-[#252833] p-2 text-center text-xl font-medium transition-colors duration-300 hover:text-white 	">
          {game.name}
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
