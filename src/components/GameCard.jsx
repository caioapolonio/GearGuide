import { Link } from "react-router-dom";

const GameCard = ({ game }) => {
  return (
    <div className=" transform rounded-lg border bg-white shadow-md transition duration-500 hover:scale-105 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex justify-center p-2">
        <img
          className="h-48 w-full rounded-md object-cover "
          src={game.image_url}
          loading="lazy"
        />
      </div>

      <div className="px-4 pb-3">
        <div>
          <a href="#">
            <h5 className="text-xl font-semibold tracking-tight text-gray-900 hover:text-violet-800 dark:text-white dark:hover:text-violet-300 ">
              {game.name}
            </h5>
          </a>
        </div>
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
