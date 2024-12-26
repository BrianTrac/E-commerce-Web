import { Outlet } from 'react-router-dom';

const SellerLayout = () => {
  return (
    <div className='min-h-screen bg-sky-200 flex flex-col'>
      <h1>Header</h1>
      <Outlet />
      <h1>Footer</h1>
    </div>
  );
};

export default SellerLayout;