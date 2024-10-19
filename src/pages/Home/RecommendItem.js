import { StarFilled } from '@ant-design/icons';

function RecommendItem (props) {
  const { image, title, rating, sold } = props;

  return (
    <div className="bg-white p-3 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="relative aspect-square mb-3 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm text-gray-800 line-clamp-2">
          {title}
        </h3>
        <div className="flex justify-between items-center flex-wrap">
          <div className="flex items-center">
            <StarFilled className="w-4 h-4 text-yellow-400" />
            <span className="text-sm ml-1">{rating}</span>
          </div>
          <span className="text-gray-500 text-sm">Đã bán {sold}</span>
        </div>
      </div>
    </div>
  );
};

export default RecommendItem;
