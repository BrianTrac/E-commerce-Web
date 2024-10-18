import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className='min-h-screen bg-sky-200 flex flex-col'>
            <header className='bg-white p-4 shadow-md'>
                <div className='mx-auto'>
                    <h1 className='text-xl font-semibold'>Main Page</h1>
                </div>
            </header>
            <main className='flex-grow flex items-center justify-center p-4'>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;