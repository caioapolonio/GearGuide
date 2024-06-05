const SkeletonGameCard = () => {
  return Array(5)
    .fill()
    .map((_, index) => (
      <div className="rounded-lg bg-[#373644] shadow-md" key={index}>
        <div className="flex justify-center p-2">
          <div className="shimmer h-48 w-full rounded-md "></div>
        </div>
        <div className=" px-2 pb-3">
          <div className="shimmer h-5 w-full rounded-full"></div>
        </div>
      </div>
    ));
};

export default SkeletonGameCard;
