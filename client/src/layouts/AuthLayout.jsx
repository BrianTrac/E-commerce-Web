import { Outlet, useLocation, useParams } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import cartAuthBg from '../assets/cart_auth_bg.png';

const titleMap = {
    login: "Login",
    register: "Register",
};

const AuthLayout = () => {
    const location = useLocation();
    const params = useParams();
    const path = location.pathname.split('/').pop();

    const title = location.state?.title || titleMap[path] || 'Auth Page';

    return (
        <div className='min-h-screen bg-sky-200 flex flex-col'>
            <header className='bg-white p-4 shadow-md'>
                <div className='flex items-center justify-between'>
                    <ShoppingCart className='text-orange-500' size={32} />
                    <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-semibold">
                        {title}
                    </h1>
                </div>
            </header>
            <main className='flex-grow flex items-center justify-center p-4'>
                <div className="bg-cyan-950 flex gap-8 items-center max-w-6xl w-full">

                    <div className='hidden md:block flex-1 ml-8 mb-24'>
                        <img src={cartAuthBg}
                            alt='AuthImage'
                            className='object-cover w-88 h-88'
                        />
                    </div>
                    <div className='flex items-center justify-center '>
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AuthLayout;