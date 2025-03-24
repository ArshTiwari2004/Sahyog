import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HomeIcon, 
  ExclamationTriangleIcon, 
  CubeIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  CogIcon 
} from '@heroicons/react/24/solid';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { 
      name: 'Dashboard', 
      icon: HomeIcon, 
      route: '/', 
      key: 'dashboard' 
    },
    { 
      name: 'Incidents', 
      icon: ExclamationTriangleIcon, 
      route: '/incidents', 
      key: 'incidents' 
    },
    { 
      name: 'Resources', 
      icon: CubeIcon, 
      route: '/resources', 
      key: 'resources' 
    },
    { 
      name: 'Response Teams', 
      icon: UserGroupIcon, 
      route: '/response-teams', 
      key: 'response-teams' 
    },
    { 
      name: 'Analytics', 
      icon: ChartBarIcon, 
      route: '/analytics', 
      key: 'analytics' 
    },
    { 
      name: 'Settings', 
      icon: CogIcon, 
      route: '/settings', 
      key: 'settings' 
    }
  ];

  return (
    <div className="bg-dark-blue-900 w-64 min-h-screen text-white p-4 shadow-lg">
      <div className="text-2xl font-bold mb-10 text-center">
        Disaster Response
      </div>
      <nav>
        {menuItems.map((item) => (
          <Link 
            key={item.key}
            to={item.route}
            className={`
              flex items-center p-3 mb-2 rounded-lg transition-all duration-200
              ${activeTab === item.key 
                ? 'bg-dark-blue-700 text-blue-300' 
                : 'hover:bg-dark-blue-800 text-gray-300'}
            `}
            onClick={() => setActiveTab(item.key)}
          >
            <item.icon className="w-6 h-6 mr-3" />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;