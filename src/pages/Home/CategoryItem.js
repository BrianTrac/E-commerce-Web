function CategoryItem (props) {
  const { image, title } = props;
  return (
    <div className="flex flex-col items-center p-2 hover:shadow-md transition-shadow rounded-lg cursor-pointer group">
      <div className="w-16 h-16 mb-2 overflow-hidden group-hover:scale-105 transition-transform">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-contain"
        />
      </div>
      <p className="text-xs text-gray-700 text-center leading-tight max-w-[80px]">
        {title}
      </p>
    </div>
  );
};

export default CategoryItem;