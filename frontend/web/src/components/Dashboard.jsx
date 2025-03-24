import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { 
  AlertTriangle, 
  MapPin, 
  Shield, 
  Clock, 
  BarChart2, 
  Server, 
  Zap 
} from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const overviewCards = [
    {
      icon: <AlertTriangle className="w-6 h-6 text-red-400" />,
      label: "Active Incidents",
      value: "27",
      subtext: "+5 in last 24hrs",
      color: "text-red-400"
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-400" />,
      label: "Response Teams",
      value: "15",
      subtext: "All Operational",
      color: "text-blue-400"
    },
    {
      icon: <Server className="w-6 h-6 text-yellow-400" />,
      label: "Resources Deployed",
      value: "68%",
      subtext: "Current Allocation",
      color: "text-yellow-400"
    },
    {
      icon: <Clock className="w-6 h-6 text-green-400" />,
      label: "Avg. Response Time",
      value: "18m",
      subtext: "Last Hour",
      color: "text-green-400"
    }
  ];

  const activeAlerts = [
    {
      type: "Severe Flooding",
      location: "Chennai",
      time: "15 mins ago",
      severity: "high"
    },
    {
      type: "Heavy Rain",
      location: "Cuddalore",
      time: "32 mins ago",
      severity: "medium"
    },
    {
      type: "Cyclone Warning",
      location: "Coastal Region",
      time: "1 hr ago",
      severity: "low"
    }
  ];

  const resourceStatus = [
    { name: 'Medical Kits', percentage: 75, color: 'blue' },
    { name: 'Food Supplies', percentage: 60, color: 'yellow' },
    { name: 'Shelters', percentage: 85, color: 'green' },
    { name: 'Response Teams', percentage: 50, color: 'red' }
  ];

  const severityColors = {
    high: "bg-red-500/20 border-red-500",
    medium: "bg-yellow-500/20 border-yellow-500",
    low: "bg-green-500/20 border-green-500"
  };

  return (
    <div className="bg-[#0F172A] min-h-screen text-white flex">
      {/* Sidebar */}
      <Sidebar/>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {overviewCards.map((card, index) => (
            <div 
              key={index} 
              className="bg-[#1E293B] p-5 rounded-xl shadow-lg border border-gray-700 hover:border-blue-600 transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-3">
                {card.icon}
                <div className="text-right">
                  <div className="text-sm text-gray-400">{card.label}</div>
                  <div className={`text-3xl font-bold ${card.color}`}>{card.value}</div>
                  <div className="text-xs text-gray-300">{card.subtext}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disaster Map & Alerts */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Disaster Map */}
          <div className="col-span-2 bg-[#1E293B] rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                Disaster Map
              </h2>
              <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs">
                Real-time Tracking
              </div>
            </div>
            <div className="bg-[#0F172A] h-80 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Interactive Map Placeholder</p>
            </div>
          </div>

          {/* Active Alerts */}
          <div className="bg-[#1E293B] rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
              Active Alerts
            </h2>
            <div className="space-y-3">
              {activeAlerts.map((alert, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border ${severityColors[alert.severity]} hover:bg-opacity-30 transition-all`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-white">{alert.type}</div>
                      <div className="text-xs text-gray-300">{alert.location}</div>
                    </div>
                    <span className="text-xs text-gray-400">{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resource Status */}
        <div className="bg-[#1E293B] rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <BarChart2 className="w-5 h-5 mr-2 text-green-400" />
            Resource Status
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {resourceStatus.map((resource) => (
              <div key={resource.name}>
                <div className="flex justify-between text-sm mb-2">
                  <span>{resource.name}</span>
                  <span>{resource.percentage}%</span>
                </div>
                <div className="bg-[#0F172A] rounded-full h-2.5">
                  <div 
                    className={`bg-${resource.color}-500 h-2.5 rounded-full`}
                    style={{ width: `${resource.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;