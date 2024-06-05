const SkeletonPlayerCard = () => {
  return Array(10)
    .fill()
    .map((_, index) => (
      <div
        className="group mx-auto h-full w-full text-gray-300 sm:mx-0"
        key={index}
      >
        <div className="flex h-full w-full flex-col items-center gap-8 rounded-3xl bg-[#373644] p-4 ">
          <div className="shimmer h-36 w-36 rounded-full ring-2 ring-white/20"></div>
          <div className="flex w-full flex-col items-center gap-1 ">
            <div className="shimmer h-4 w-full rounded-full"></div>
            <div className="shimmer h-4 w-full rounded-full"></div>
          </div>
        </div>
      </div>
    ));
};

export default SkeletonPlayerCard;
