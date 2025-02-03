import React, { useState } from 'react';
import { NavLink } from 'react-router';
import {
  Home,
  Calendar,
  LogIn,
  ChevronDown,
  ChevronUp,
  Plus,
  Rows3,
  Box,
  School,
  PersonStanding,
  Banknote,
  UserX,
  MessageSquareHeart,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Sidebar = ({ setIsAuthenticated }) => {
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiry')
    setIsAuthenticated(false);
  }

  const menuStructure = [
    { path: '/dashboard', name: 'Dashboard', icon: Home, type: 'link' },
    { path: '/bookingdetails', name: 'Booking Details', icon: Calendar, type: 'link' },
    {
      name: 'Packages',
      icon: Box,
      type: 'submenu',
      submenuItems: [
        { path: '/packages/list', name: 'Package List', icon: Rows3 },
        { path: '/packages/add', name: 'Add Package', icon: Plus },
      ],
    },
    {
      name: 'Rooms',
      icon: School,
      type: 'submenu',
      submenuItems: [
        { path: '/roomtype/list', name: 'Rooms List', icon: Rows3 },
        { path: '/roomtype/add', name: 'Add Room', icon: Plus },
      ],
    },
    {
      name: 'Agent',
      icon: PersonStanding,
      type: 'submenu',
      submenuItems: [
        { path: '/agent/list', name: 'Agents List', icon: Rows3 },
        { path: '/agent/add', name: 'Add Agents', icon: Plus },
      ],
    },
    {
      name: 'Non-Availability',
      icon: UserX,
      type: 'submenu',
      submenuItems: [
        { path: '/nonavailability/list', name: 'Non-Available Rooms List', icon: Rows3 },
        { path: '/nonavailability/add', name: 'Add Non-Availability', icon: Plus },
      ],
    },
    { path: '/PaymentList', name: 'Payment Info', icon: Banknote, type: 'link' },
    { path: '/inquirylist', name: 'Inquiry', icon: MessageSquareHeart, type: 'link' },
  ];

  const handleSubmenuToggle = (submenuName) => {
    setOpenSubmenus((prevState) => ({
      ...prevState,
      [submenuName]: !prevState[submenuName],
    }));
  };

  const renderMenuItem = (item) => {
    if (item.type === 'link') {
      return (
        <NavLink
          to={item.path}
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-150 ${
              isActive
                ? 'bg-gray-800 text-white font-medium'
                : 'text-gray-300 hover:bg-gray-900'
            }`
          }
          onClick={() => setIsSidebarOpen(false)}
        >
          <item.icon className="w-5 h-5" />
          <span>{item.name}</span>
        </NavLink>
      );
    }

    if (item.type === 'submenu') {
      return (
        <>
          <button
            onClick={() => handleSubmenuToggle(item.name)}
            className="w-full flex items-center justify-between space-x-3 px-4 py-3 rounded-lg transition-colors duration-150 text-gray-300 hover:bg-gray-900"
          >
            <div className="flex items-center space-x-3">
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </div>
            {openSubmenus[item.name] ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {openSubmenus[item.name] && (
            <ul className="mt-1 ml-4 space-y-1 mb-1 text-xs">
              {item.submenuItems.map((subItem) => (
                <li key={subItem.path}>
                  <NavLink
                    to={subItem.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-150 ${
                        isActive
                          ? 'bg-gray-800 text-white font-medium'
                          : 'text-gray-300 hover:bg-gray-900'
                      }`
                    }
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <subItem.icon className="w-4 h-4" />
                    <span>{subItem.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </>
      );
    }
  };

  return (
    <>
      {/* Hamburger Menu Button for Mobile */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 text-black"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 h-screen bg-black text-gray-300 flex flex-col flex-shrink-0 text-sm transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-700 flex-shrink-0">
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <span className="w-8 h-8 bg-transparent rounded-lg flex items-center justify-center">
              <span className="text-xl">✈️</span>
            </span>
            <span>Eco Stay</span>
          </h1>
        </div>

        {/* Navigation Section */}
        <nav className="flex-grow overflow-y-auto p-4">
          <div className="mb-4 px-4 text-xs font-semibold text-gray-400 uppercase">
            Main Menu
          </div>
          <ul className="space-y-1">
            {menuStructure.map((item, index) => (
              <li key={item.name || index}>{renderMenuItem(item)}</li>
            ))}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
              <span className="text-sm font-medium text-white">ES</span>
            </div>
            <div className="flex-grow">
              <h3 className="text-sm font-medium text-white">Eco Stay</h3>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
            <button
              onClick={handleLogout}
              className="hover:bg-gray-900 p-2 rounded-md"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;