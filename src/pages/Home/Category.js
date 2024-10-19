import CategoryItem from './CategoryItem';

const Category = () => {
  const categories = [
    {
      id: 1,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdE29Ddw7Rc9SIv4MffPMknnYwCDIEKXRruQ&s",
      title: "Điện Thoại & Phụ Kiện"
    },
    // Thêm các danh mục khác vào đây
  ];

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-red-500 font-medium mb-4 text-xl">DANH MỤC</h2>

      {/* Responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {categories.map(category => (
          <CategoryItem
            key={category.id}
            image={category.image}
            title={category.title}
          />
        ))}
      </div>
    </div>
  );
};

export default Category;
