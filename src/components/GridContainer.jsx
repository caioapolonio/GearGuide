const GridContainer = ({ children }) => {
  return (
    <div className="grid grid-cols-1 gap-12 pt-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {children}
    </div>
  );
};

export default GridContainer;
