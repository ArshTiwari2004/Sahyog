import React from 'react';
import Sidebar from './Sidebar';

const Dashboard = () => {
  return (
    <div className="flex bg-dark-blue-950 min-h-screen text-white">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {/* Overview Cards */}
          <div className="bg-dark-blue-900 p-4 rounded-lg shadow-lg text-center">
            <div className="text-sm text-gray-400">Active Incidents</div>
            <div className="text-3xl font-bold text-red-500">27</div>
            <div className="text-xs text-red-300">+5 in last 24hrs</div>
          </div>
          <div className="bg-dark-blue-900 p-4 rounded-lg shadow-lg text-center">
            <div className="text-sm text-gray-400">Response Teams</div>
            <div className="text-3xl font-bold text-blue-500">15</div>
            <div className="text-xs text-green-300">All Operational</div>
          </div>
          <div className="bg-dark-blue-900 p-4 rounded-lg shadow-lg text-center">
            <div className="text-sm text-gray-400">Resources Deployed</div>
            <div className="text-3xl font-bold text-yellow-500">68%</div>
            <div className="text-xs text-gray-400">Current Allocation</div>
          </div>
          <div className="bg-dark-blue-900 p-4 rounded-lg shadow-lg text-center">
            <div className="text-sm text-gray-400">Avg. Response Time</div>
            <div className="text-3xl font-bold text-green-500">18m</div>
            <div className="text-xs text-gray-400">Last Hour</div>
          </div>
        </div>

        {/* Disaster Map */}
        <div className="bg-dark-blue-900 rounded-lg p-4 mb-6 h-96">
          <h2 className="text-xl font-semibold mb-4">Disaster Map</h2>
          <div className="bg-gray-800 h-full rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Map Placeholder</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Active Alerts */}
          <div className="bg-dark-blue-900 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Active Alerts</h2>
            <div className="space-y-2">
              <div className="bg-red-900/30 p-3 rounded-lg border border-red-700">
                <div className="flex justify-between items-center">
                  <span className="text-red-300">Severe Flooding - Chennai</span>
                  <span className="text-xs text-gray-400">15 mins ago</span>
                </div>
              </div>
              <div className="bg-yellow-900/30 p-3 rounded-lg border border-yellow-700">
                <div className="flex justify-between items-center">
                  <span className="text-yellow-300">Heavy Rain - Cuddalore</span>
                  <span className="text-xs text-gray-400">32 mins ago</span>
                </div>
              </div>
              <div className="bg-green-900/30 p-3 rounded-lg border border-green-700">
                <div className="flex justify-between items-center">
                  <span className="text-green-300">Cyclone Warning Issued</span>
                  <span className="text-xs text-gray-400">1 hr ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resource Status */}
          <div className="bg-dark-blue-900 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Resource Status</h2>
            <div className="space-y-4">
              {[
                { name: 'Medical Kits', color: 'blue', percentage: 75 },
                { name: 'Food Supplies', color: 'yellow', percentage: 60 },
                { name: 'Shelters', color: 'green', percentage: 85 },
                { name: 'Response Teams', color: 'red', percentage: 50 }
              ].map((resource) => (
                <div key={resource.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{resource.name}</span>
                    <span>{resource.percentage}%</span>
                  </div>
                  <div className="bg-dark-blue-800 rounded-full h-2">
                    <div 
                      className={`bg-${resource.color}-600 h-2 rounded-full`}
                      style={{ width: `${resource.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;