// Review.js
import { FaStar } from "react-icons/fa";

const ProductReview = ({ review }) => {
    return (
        <div className="py-4">
            <div className="flex items-center gap-2">
                <img
                    src={review.created_by.avatar_url}
                    alt={review.created_by.full_name}
                    className="w-8 h-8 rounded-full"
                />
                <span className="font-medium">{review.created_by.full_name}</span>
            </div>
            <div className="flex items-center gap-1 text-yellow-500 my-2">
                {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} className="text-sm" />
                ))}
                {[...Array(5 - review.rating)].map((_, i) => (
                    <FaStar key={i + review.rating} className="text-sm text-gray-300" />
                ))}
            </div>
            <p className="text-gray-700 text-sm mb-2">{review.content || review.title}</p>
        </div>
    );
};

export default ProductReview;
