const Footer = () => {
  return (
    <footer className="sticky mx-auto flex min-h-20 w-full flex-wrap items-center justify-between overflow-hidden bg-[#1b1a25] p-6 text-white md:px-16">
      <div className="flex w-full items-start justify-between">
        <div className="max-w-lg">
          <span className="text-xs">
            <span className="line text-sm font-medium">GearGuide </span>
            is an esports database. We research and provide accurate data,
            guides, analysis, and reviews on the most used computer hardware and
            in-game settings of professional gamers.
          </span>
        </div>
        <span className="text-xs">
          As an Amazon Associate we earn from qualifying purchases. We also use
          targeted ads.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
