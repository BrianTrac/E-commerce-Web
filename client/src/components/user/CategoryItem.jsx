function CategoryItem(props) {
  const { thumbnail, name, navigateTo } = props;

  return (
    <div
      className="flex flex-col items-center p-3 hover:shadow-lg transition-shadow rounded-lg cursor-pointer group bg-white bg-opacity-80 hover:bg-opacity-90"
      onClick={navigateTo}
    >
      {/* Responsive image container */}
      <div className="w-16 h-16 mb-2 overflow-hidden group-hover:scale-105 transition-transform">
        <img
          src={thumbnail}
          alt={name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Responsive text */}
      <p className="text-sm sm:text-base text-gray-800 text-center leading-tight max-w-[100px] font-medium">
        {name}
      </p>
    </div>
  );
};

export default CategoryItem;