import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  AlertTriangle, 
  Package, 
  Users, 
  BarChart, 
  Settings,
  Zap,
  Map,
  Bell,
  LogOut,
  ChevronDown,
  ChevronRight
} from "lucide-react";

const Sidebar = ({ 
  brandName = "Sahyog", 
  onTabChange,
  defaultActiveTab = 'dashboard',
  userRole = 'admin' // Default to admin, can be 'operator' or 'viewer'
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(defaultActiveTab);
  const [collapsedSections, setCollapsedSections] = useState({});
  const [unreadAlerts, setUnreadAlerts] = useState(3); // Mock unread alerts count

  // Define menu structure with permissions
  const menuStructure = {
    main: [
      { 
        name: 'Dashboard', 
        icon: Home, 
        route: '/dashboard', 
        key: 'dashboard',
        roles: ['admin', 'operator', 'viewer']
      },
      { 
        name: 'Incidents', 
        icon: AlertTriangle, 
        route: '/incidents', 
        key: 'incidents',
        count: 5, // Mock incident count
        roles: ['admin', 'operator', 'viewer']
      },
      // this will be used for the map and we will build this in the future
      // { 
      //   name: 'Disaster Map', 
      //   icon: Map, 
      //   route: '/map', 
      //   key: 'map',
      //   roles: ['admin', 'operator']
      // }
    ],
    management: [
      { 
        name: 'Resources', 
        icon: Package, 
        route: '/resources', 
        key: 'resources',
        roles: ['admin', 'operator']
      },
      { 
        name: 'Response Teams', 
        icon: Users, 
        route: '/response-teams', 
        key: 'response-teams',
        roles: ['admin']
      },
      // Uncomment this when we have the alerts feature ready
      // this will be used for the alerts and we will build this in the future
      // { 
      //   name: 'Alerts', 
      //   icon: Bell, 
      //   route: '/alerts', 
      //   key: 'alerts',
      //   count: unreadAlerts,
      //   roles: ['admin', 'operator']
      // }
    ],
    analytics: [
      { 
        name: 'Reports', 
        icon: BarChart, 
        route: '/analytics', 
        key: 'analytics',
        roles: ['admin', 'operator', 'viewer']
      }
    ],
    admin: [
      { 
        name: 'Settings', 
        icon: Settings, 
        route: '/settings', 
        key: 'settings',
        roles: ['admin']
      }
    ]
  };

  // Toggle section collapse
  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Filter menu items based on user role
  const getFilteredMenu = () => {
    return Object.entries(menuStructure).reduce((acc, [section, items]) => {
      const filteredItems = items.filter(item => item.roles.includes(userRole));
      if (filteredItems.length > 0) {
        acc[section] = filteredItems;
      }
      return acc;
    }, {});
  };

  // Sync active tab with current route
  useEffect(() => {
    const currentRoute = location.pathname;
    // Flatten all menu items to find the current route
    const allItems = Object.values(menuStructure).flat();
    const matchedItem = allItems.find(item => item.route === currentRoute);
    if (matchedItem) {
      setActiveTab(matchedItem.key);
    }
  }, [location.pathname]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    if (onTabChange) {
      onTabChange(key);
    }
  };

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...');
    navigate('/login');
  };

  const filteredMenu = getFilteredMenu();

  return (
    <div className="w-64 bg-[#1E293B] p-4 border-r border-gray-700 min-h-screen flex flex-col transition-all duration-300">
      {/* Brand Section */}
      <div className="flex items-center mb-8 pl-2 pt-4">
        <div className="relative">
          <Zap className="w-8 h-8 text-blue-400 mr-3 animate-pulse" />
          {unreadAlerts > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadAlerts}
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-white">{brandName}</h1>
      </div>
      
      {/* Navigation */}
      <nav className="flex-grow space-y-1">
        {Object.entries(filteredMenu).map(([section, items]) => (
          <div key={section} className="mb-4">
            {/* Section Header */}
            {section !== 'main' && (
              <div 
                className="flex items-center justify-between px-2 py-2 text-gray-400 uppercase text-xs font-semibold cursor-pointer"
                onClick={() => toggleSection(section)}
              >
                <span>{section}</span>
                {collapsedSections[section] ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            )}
            
            {/* Menu Items */}
            {(!collapsedSections[section] || section === 'main') && items.map((item) => (
              <Link 
                key={item.key}
                to={item.route}
                className={`
                  w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center justify-between
                  ${activeTab === item.key 
                    ? 'bg-blue-600/90 text-white shadow-lg' 
                    : 'hover:bg-[#2C3E5A] text-gray-300'}
                `}
                onClick={() => handleTabChange(item.key)}
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </div>
                {item.count && (
                  <span className="bg-gray-700 text-white text-xs rounded-full px-2 py-1">
                    {item.count}
                  </span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="mt-auto mb-4">
        <div className="flex items-center p-3 rounded-lg bg-gray-800/50 mb-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
            {userRole.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-400">{userRole}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-700 text-center">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} {brandName}
        </p>
        <p className="text-[10px] text-gray-500 mt-1">v1.2.0</p>
      </div>
    </div>
  );
};

export default Sidebar;