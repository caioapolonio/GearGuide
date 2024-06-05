import { Link } from "react-router-dom";

const GameCard = ({ game }) => {
  return (
    <div className=" transform rounded-lg bg-[#373644] shadow-md transition-all duration-500 hover:scale-105  hover:bg-[#4a4a5e]">
      <div className="flex justify-center p-2">
        <Link to={`/game/${game.game_id}`} className="w-full">
          <img
            className="h-48 w-full rounded-md object-cover "
            src={game.image_url}
            loading="lazy"
          />
        </Link>
      </div>

      <div className="w-fit pb-3 pl-2">
        <Link to={`/game/${game.game_id}`}>
          <h5 className="text-xl font-semibold tracking-tight text-gray-300  transition-colors duration-300 hover:text-white">
            {game.name}
          </h5>
        </Link>
      </div>
    </div>
  );
};

export default GameCard;

{
  /* // <Link
    //   to={`/game/${game.game_id}`}
    //   className="group mx-auto h-full w-full text-gray-300 sm:mx-0  "
    // >
    //   <div className="flex h-full w-full flex-col overflow-hidden rounded-3xl rounded-b-none ">
    //     <img
    //       className="h-full w-full overflow-hidden object-cover"
    //       src={game.image_url}
    //     />
    //     <div className=" z-10 rounded-3xl rounded-t-none bg-[#252833] p-2 text-center text-xl font-medium transition-colors duration-300 hover:text-white 	">
    //       {game.name}
    //     </div>
    //   </div>
    // </Link> */
}
