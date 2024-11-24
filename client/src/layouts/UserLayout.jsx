import { Outlet } from 'react-router-dom';
import Footer  from '../components/user/Footer';
import Header from '../components/user/Header';
import NavigationBar from '../components/user/NavigationBar';

const UserLayout = () => {
    return (
        <div className='min-h-screen bg-sky-200 flex flex-col'>
            <Header />
            <NavigationBar /> 
            <Outlet/>
            {/* <main className='flex-grow flex items-center justify-center p-4'>
                <Outlet />
            </main> */}
            <Footer />
        </div>
    );
};

export default UserLayout;