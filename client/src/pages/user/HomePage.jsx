import { Suspense, lazy, useState, useEffect } from 'react';
import BestSeller from "../../components/user/BestSeller";
import Recommend from "../../components/user/Recommend";
import ProductSlider from '../../components/user/ProductSlider';
import { getTopDeals, getFlashSale } from '../../service/productApi';
import { Spin } from 'antd';
// Lazy-load Category component
const Category = lazy(() => import("../../components/user/Category"));

const Home = () => {
    const [topDeals, setTopDeals] = useState([]);
    const [flashSale, setFlashSale] = useState([]);

    useEffect(() => {
        
        const fetchTopDeals = async () => {
            const data = await getTopDeals();
            setTopDeals(data);
        };

        const fetchFlashSale = async () => {
            const data = await getFlashSale();
            setFlashSale(data);
        };

        fetchTopDeals();
        fetchFlashSale();
    }, []);

    return (
        <div className="flex flex-wrap flex-col items-center mx-auto max-w-6xl">
            {/* Suspense will show fallback UI until Category is loaded */}
            <Suspense fallback={<Spin/>}>
                <Category />
            </Suspense>
            {/* TOP DEAL */}
            <ProductSlider
                title="Top Deal"
                products={topDeals}
                url="/top-deals"
                isTopDeal={true}
                isFlashSale={false}
            />
            {/* FLASH SALE */}
            { <ProductSlider
                title="Flash Sale"
                products={flashSale}
                url="/flash-sale"
                isTopDeal={false}
                isFlashSale={true}
            /> }




            {/* <BestSeller />
            <Recommend /> */}
        </div>
    );
};

export default Home;
