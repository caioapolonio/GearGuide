import Navbar from "../components/Navbar";

const Home = ({ session, setSession }) => {
  return (
    <div>
      <div className="h-screen bg-[#1F1C2B]">
        <Navbar session={session} setSession={setSession} />
        <div className="flex flex-col items-center justify-center "></div>
      </div>
    </div>
  );
};

export default Home;
