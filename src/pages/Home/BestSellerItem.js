function BestSellerItem (props) {
  const { image, title, price, isTop } = props;
  return (
    <div className="relative group cursor-pointer">
      {isTop && (
        <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-md z-10">
          TOP
        </div>
      )}
      <div className="bg-white p-4 rounded-lg hover:shadow-lg transition-shadow">
        <div className="relative aspect-square mb-3 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h3 className="text-sm text-gray-800 font-medium mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-red-500 font-semibold">
          {parseInt(price).toLocaleString('vi-VN')}đ
        </p>
      </div>
    </div>
  );
};

export default BestSellerItem;
