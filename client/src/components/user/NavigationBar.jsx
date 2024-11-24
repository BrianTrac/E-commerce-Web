import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectCategory } from '../../redux/reducers/user/categoryReducer';
import { fetchAncestorCategories } from '../../redux/actions/user/categoryAction';
import { fetchProductById } from '../../service/productApi';
import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { resetSearchQuery } from '../../redux/reducers/user/searchReducer';

const NavigationBar = () => {
    const dispatch = useDispatch();
    const { id, url_key, keyword } = useParams();
    const { ancestorCategories, error, status } = useSelector(selectCategory);
    const [productName, setProductName] = useState('');
    let pId = 0;
    let productId = 0;

    if (id) {
        pId = parseInt(id.replace('c', ''), 10);
    } else if (url_key) {
        const parts = url_key.split('-');
        productId = parseInt(parts[parts.length - 1].replace('p', ''), 10);
        pId = productId;
    }
    else {
        //
    }

    // Fetch ancestor categories
    useEffect(() => {
        if (id) {
            dispatch(fetchAncestorCategories({ id: pId }));
            setProductName('');
        } else if (url_key) {
            const fetchData = async () => {
                try {    
                    const product = await fetchProductById(productId);
                    setProductName(product.name);
                    dispatch(fetchAncestorCategories({ id: product.category_id }));
                } catch (err) {
                    console.error('Failed to fetch product details', err);
                }
            }
            
            fetchData();
        }
    }, [dispatch, id, url_key]);


    useEffect(() => {
        if (!ancestorCategories || ancestorCategories.length <= 1 || (!id && !url_key)) {
            dispatch(resetSearchQuery());
        }
    }, [ancestorCategories, id, url_key, dispatch]);


    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (status === 'loading') {
        return <Spin />;
    }

    const handleNavigationChange = () => {
        dispatch(resetSearchQuery()); 
    };

    if (!ancestorCategories || ancestorCategories.length <= 1 || (!id && !url_key)) {

        return (
            <div className="ml-36 text-sm font-medium flex items-center">
                <Link to="/" className="text-blue-500 hover:underline">Shopbee</Link>
                {
                    (url_key) && (
                    <span className="flex items-center">
                        <span className="mx-2">/</span>
                        <span className="text-blue-500 pointer-events-none">{productName}</span>
                    </span>
                    )
                }
                {
                    (keyword) && (
                        <span className="flex items-center">
                            <span className="mx-2"> / </span>
                            <span className="text-blue-500 pointer-events-none"> Kết quả tìm kiếm: {keyword}</span>
                        </span>
                    )
                }
            </div>
        );
    }

     // Exclude the last item (Shopbee) and reverse the array to go from descendant to ancestor
     const categoriesToDisplay = ancestorCategories.slice(0, -1).reverse();
    
    return (
      <div className="ml-36 text-sm font-medium flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
        <Link to="/" className='text-blue-500 hover:underline'>Shopbee</Link>
            {categoriesToDisplay.map((category, index) => (
                <span key={category.id} className="flex items-center">
                    <span className="mx-2">/</span>
                    <Link
                        to={`/${category.url_path.split('/')[0]}/c${category.id}`}
                        className="text-blue-500 hover:underline"
                    >
                        {category.name}
                    </Link>
                </span>
            ))}
            {productName && (
                <span className="flex items-center">
                    <span className="mx-2">/</span>
                    <p
                        className="text-blue-500 pointer-events-none"
                    >
                        {productName}
                    </p>
                </span>
            )}
    </div>
  );
};

export default NavigationBar;