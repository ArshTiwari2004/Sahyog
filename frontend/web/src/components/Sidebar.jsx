import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Home, 
    AlertTriangle, 
    Package, 
    Users, 
    BarChart, 
    Settings,
    Zap 
} from "lucide-react";

const Sidebar = ({ 
  brandName = "Sahyog", 
  onTabChange,
  defaultActiveTab = 'dashboard'
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  const menuItems = [
    { 
      name: 'Dashboard', 
      icon: Home, 
      route: '/dashboard', 
      key: 'dashboard' 
    },
    { 
      name: 'Incidents', 
      icon: AlertTriangle, 
      route: '/incidents', 
      key: 'incidents' 
    },
    { 
      name: 'Resources', 
      icon: Package, 
      route: '/resources', 
      key: 'resources' 
    },
    { 
      name: 'Response Teams', 
      icon: Users, 
      route: '/response-teams', 
      key: 'response-teams' 
    },
    { 
      name: 'Analytics', 
      icon: BarChart, 
      route: '/analytics', 
      key: 'analytics' 
    },
    { 
      name: 'Settings', 
      icon: Settings, 
      route: '/settings', 
      key: 'settings' 
    }
  ];

  const handleTabChange = (key) => {
    setActiveTab(key);
    if (onTabChange) {
      onTabChange(key);
    }
  };

  return (
    <div className="w-64 bg-[#1E293B] p-6 border-r border-gray-700 min-h-screen flex flex-col">
      {/* Brand Section */}
      <div className="flex items-center mb-10">
        <Zap className="w-8 h-8 text-blue-400 mr-3" />
        <h1 className="text-2xl font-bold text-white">{brandName}</h1>
      </div>
      
      {/* Navigation */}
      <nav className="space-y-2 flex-grow">
        {menuItems.map((item) => (
          <Link 
            key={item.key}
            to={item.route}
            className={`
              w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center
              ${activeTab === item.key 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-[#2C3E5A] text-gray-300'}
            `}
            onClick={() => handleTabChange(item.key)}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Footer or Additional Content */}
      <div className="mt-6 pt-4 border-t border-gray-700 text-center">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} {brandName}
        </p>
      </div>
    </div>
  );
};

export default Sidebar;