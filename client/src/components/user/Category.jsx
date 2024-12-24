import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CategoryItem from './CategoryItem';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChildrenCategories } from '../../redux/actions/user/categoryAction';
import { selectCategory, clearError } from '../../redux/reducers/user/categoryReducer';
import { Spin } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const Category = ({ id }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { childrenCategories, status, error } = useSelector(selectCategory);
  //  const { url_key, id } = useParams();
  // Track loading state for the new category
  const [isNewCategoryLoaded, setIsNewCategoryLoaded] = useState(false);
  const [isCategoryVisible, setIsCategoryVisible] = useState(false);  // New state for controlling visibility

  let pId = 0;

  if (id) {
    pId = parseInt(id.replace('c', ''), 10);
  }

  useEffect(() => {
    // Reset the loading state when navigating to a new category
    setIsNewCategoryLoaded(false);
    setIsCategoryVisible(false);

    dispatch(fetchChildrenCategories({ parentId: pId }));
  }, [dispatch, id]);

  useEffect(() => {
    // Set loading state to true once new categories are fetched
    if (status === 'succeeded') {
      setIsNewCategoryLoaded(true);
      // Set a delay before showing the category
      setTimeout(() => {
        setIsCategoryVisible(true);
      }, 500); // Delay for 500ms (you can adjust this time as needed)
    }
  }, [status]);

  const chunkedCategories = [];
  for (let i = 0; i < childrenCategories.length; i += 12) {
    chunkedCategories.push(childrenCategories.slice(i, i + 12));
  }

  // Check if chunkedCategories is empty
  if (chunkedCategories.length === 0) {
    return null; // Don't render anything if the categories are empty
  }

  // Render spinner or error message
  if (status === 'loading') return <Spin />;
  if (status === 'failed') return <p className="text-red-500">{error || 'Failed to load categories.'}</p>;

  // Render the old category until the new one is loaded
  if (!isNewCategoryLoaded || !isCategoryVisible) {
    return (<Spin />);
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-red-700 rounded-md overflow-hidden">
      <h2 className=" font-medium mb-4 text-xl">Danh mục</h2>

      {/* Swiper Slider */}

      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={1}// Show 1 slide per view

      >
        {chunkedCategories.map((categoryGroup, index) => (
          <SwiperSlide key={index}>
            <div className="flex flex-col px-4 gap-6">
              {/* All Items */}
              <div className="flex flex-wrap justify-center gap-4 max-w-full bg-slate-600 p-2">
                {categoryGroup.map((category) => (
                  <div
                    key={category.id}
                    className="flex justify-center flex-shrink-0 rounded-lg w-28 bg-transparent-600"
                  >
                    <CategoryItem
                      thumbnail={category.thumbnail_url}
                      name={category.name}
                      navigateTo={() => navigate(`/${category.url_path.split('/')[0]}/c${category.id}`)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );

};

export default Category;