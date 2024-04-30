import { Link } from "react-router-dom";

const GameCard = ({ game }) => {
  return (
    <Link to={`/game/${game.game_id}`} className="text-md w-full">
      <div className="flex h-[300px] w-full flex-col overflow-hidden rounded-3xl rounded-b-none ">
        <img className="h-full w-full object-cover" src={game.image_url} />
        <div className="rounded-3xl rounded-t-none bg-[#252833] p-2 text-center text-xl font-medium 	">
          {game.name}
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
