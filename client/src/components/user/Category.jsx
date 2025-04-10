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
  const [isNewCategoryLoaded, setIsNewCategoryLoaded] = useState(false);
  const [isCategoryVisible, setIsCategoryVisible] = useState(false);

  let pId = 0;

  if (id) {
    pId = parseInt(id.replace('c', ''), 10);
  }

  useEffect(() => {
    setIsNewCategoryLoaded(false);
    setIsCategoryVisible(false);
    dispatch(fetchChildrenCategories({ parentId: pId }));
  }, [dispatch, id]);

  useEffect(() => {
    if (status === 'succeeded') {
      setIsNewCategoryLoaded(true);
      setTimeout(() => {
        setIsCategoryVisible(true);
      }, 500);
    }
  }, [status]);

  const chunkedCategories = [];
  for (let i = 0; i < childrenCategories.length; i += 12) {
    chunkedCategories.push(childrenCategories.slice(i, i + 12));
  }

  if (chunkedCategories.length === 0) {
    return null;
  }

  if (status === 'loading') return <Spin />;
  if (status === 'failed') return <p className="text-red-500">{error || 'Failed to load categories.'}</p>;

  if (!isNewCategoryLoaded || !isCategoryVisible) {
    return (<Spin />);
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-blue-400 rounded-md overflow-hidden">
      <h2 className="font-medium mb-4 text-xl text-white">Danh mục</h2>

      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={1}
      >
        {chunkedCategories.map((categoryGroup, index) => (
          <SwiperSlide key={index}>
            <div className="flex flex-col px-4 gap-6">
              <div className="flex flex-wrap justify-center gap-4 max-w-full p-2">
                {categoryGroup.map((category) => (
                  <div
                    key={category.id}
                    className="flex justify-center flex-shrink-0 rounded-lg w-28 hover:scale-105 transition-transform duration-200"
                  >
                    <CategoryItem
                      thumbnail={category.thumbnail_url}
                      name={category.name}
                      navigateTo={() => navigate(`/category/${category.url_path.split('/')[0]}/c${category.id}`)}
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