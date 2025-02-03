  import React from 'react';
  import Sidebar from '../components/SideBar';
  import { Outlet } from 'react-router';
  import Footer from "../components/Footer";

  const MainLayout = ({ setIsAuthenticated }) => {
    return (
      <div className="flex h-screen poppins-regular">
        <Sidebar setIsAuthenticated={setIsAuthenticated}/>
        <main className="flex-grow bg-gray-100 md:p-6 p-0 overflow-y-auto text-sm">
          <div className='min-h-[100dvh]'>
          <Outlet />
          </div>
          {/* <Footer /> */}
        </main>
      </div>
    );
  };

  export default MainLayout;
