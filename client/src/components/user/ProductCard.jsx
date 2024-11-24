import { StarFilled } from '@ant-design/icons';

const ProductCard = ({ image, name, price, originalPrice, discountRate, quantitySold, ratingAverage, isTopDeal, isFlashSale }) => {
    return (
        <div className="relative group cursor-pointer">
            {(isTopDeal || isFlashSale) && (
                <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-md z-10">
                    {isTopDeal ? 'TOP DEAL' : discountRate + '% OFF'}
                </div>
            )}  
            <div className="bg-white p-4 rounded-lg hover:shadow-lg transition-shadow h-full">
                <div className="relative aspect-square mb-3 overflow-hidden">
                    <img
                        src={image || 'https://via.placeholder.com/150'}
                        alt={name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <p className="text-sm text-gray-800 font-medium mb-2 line-clamp-2 min-h-10 ">
                    {name}
                </p>

                {/* Price and Discount */}
                <div className="flex items-center gap-2 min-h-10">
                    {discountRate > 0 && (
                        <>
                            <span className="text-sm text-gray-500 font-semibold bg-slate-200 p-1 mr-4">
                                -{discountRate}%
                            </span>
                            
                            <span className="text-sm text-gray-500 line-through">
                            {parseInt(originalPrice).toLocaleString('vi-VN')}đ
                            </span>
                        </>
                    )}
                </div>
                <p className="text-red-500 font-semibold min-h-5">
                    {parseInt(price).toLocaleString('vi-VN')}đ
                </p>

                {/* Rating and Quantity Sold */}
                <div className="flex items-center gap-2 mt-2 h-5">
                    <div className="flex items-center gap-1">
                        <StarFilled style={{ color: '#fadb14' }} />
                        <span>{ratingAverage}</span>
                    </div>
                    
                </div>
                <p className="text-gray-500 text-sm text-end align-bottom">{quantitySold} đã bán</p>
            </div>
        </div>
    )
};

export default ProductCard;