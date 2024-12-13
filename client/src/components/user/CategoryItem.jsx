
function CategoryItem(props) {
  const { thumbnail, name, navigateTo} = props;

  return (
    <div
      className="flex flex-col items-center p-1 hover:shadow-md transition-shadow rounded-lg cursor-pointer group"
      onClick={navigateTo}>
      {/* Responsive image container */}
      <div className="w-12 h-12 mb-2 overflow-hidden group-hover:scale-105 transition-transform">
        <img 
          src={thumbnail} 
          alt={name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Responsive text */}
      <p className="text-xs sm:text-sm text-gray-700 text-center leading-tight max-w-[80px]">
        {name}
      </p>
    </div>
  );
};

export default CategoryItem;
