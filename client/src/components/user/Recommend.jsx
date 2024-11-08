import RecommendItem from "./RecommendItem";

const Recommend = () => {
  const recommendations = [
    {
      id: 1,
      image: "https://cbu01.alicdn.com/img/ibank/O1CN01RHqmvH1b2SGMc5rAM_!!4216593407-0-cib.jpg",
      title: "Áo Khoác Bomber Unisex Vải Nhung 2 Lớp In Họa Tiết Tùm Lum",
      rating: 4.8,
      sold: "3.8k"
    },
    // Thêm sản phẩm khác tại đây
  ];

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-4">
        <h2 className="text-red-500 font-medium text-xl">GỢI Ý HÔM NAY</h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {recommendations.map(item => (
          <RecommendItem
            key={item.id}
            image={item.image}
            title={item.title}
            rating={item.rating}
            sold={item.sold}
          />
        ))}
      </div>
    </div>
  );
};

export default Recommend;