import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('post-disaster');

  // Sample data for charts
  const responseTimeData = [
    { name: 'Jan', time: 45 },
    { name: 'Feb', time: 38 },
    { name: 'Mar', time: 30 },
    { name: 'Apr', time: 25 },
    { name: 'May', time: 22 },
    { name: 'Jun', time: 20 }
  ];

  const resourceUtilizationData = [
    { name: 'Jan', utilization: 60 },
    { name: 'Feb', utilization: 70 },
    { name: 'Mar', utilization: 65 },
    { name: 'Apr', utilization: 75 },
    { name: 'May', utilization: 80 },
    { name: 'Jun', utilization: 85 }
  ];

  const disasterForecastData = [
    { region: 'West', cyclone: 75, flood: 45, landslide: 20 },
    { region: 'North', cyclone: 30, flood: 60, landslide: 40 },
    { region: 'East', cyclone: 55, flood: 35, landslide: 25 },
    { region: 'South', cyclone: 65, flood: 50, landslide: 30 }
  ];

  const riskHeatmapData = [
    { region: 'Coastal', risk: 85 },
    { region: 'Mountainous', risk: 65 },
    { region: 'Plains', risk: 45 },
    { region: 'Urban', risk: 55 }
  ];

  return (
    <div className="flex bg-[#0F172A] min-h-screen text-white">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-300">Analytics</h1>
        
        <div className="flex mb-4 space-x-4">
          <button 
            className={`
              px-4 py-2 rounded-lg transition-all flex items-center
              ${activeTab === 'post-disaster' 
                ? 'bg-blue-600 text-white' 
                : 'bg-[#1E293B] text-gray-400 hover:bg-slate-800'}
            `}
            onClick={() => setActiveTab('post-disaster')}
          >
            Post-Disaster Reports
          </button>
          <button 
            className={`
              px-4 py-2 rounded-lg transition-all flex items-center
              ${activeTab === 'predictive' 
                ? 'bg-blue-600 text-white' 
                : 'bg-[#1E293B] text-gray-400 hover:bg-slate-800'}
            `}
            onClick={() => setActiveTab('predictive')}
          >
            Predictive Insights
          </button>
        </div>

        {activeTab === 'post-disaster' && (
          <div className="bg-[#1E293B] rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Post-Disaster Analysis</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#0F172A] rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-blue-300">Response Time Trends</h3>
                <div className="bg-[#1E293B] h-64 rounded-lg flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={responseTimeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis dataKey="name" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0F172A', 
                          borderColor: '#1E293B' 
                        }} 
                        labelStyle={{ color: '#ffffff' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="time" 
                        stroke="#3b82f6" 
                        strokeWidth={2} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#0F172A] rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-blue-300">Resource Utilization</h3>
                <div className="bg-[#1E293B] h-64 rounded-lg flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={resourceUtilizationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis dataKey="name" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0F172A', 
                          borderColor: '#1E293B' 
                        }} 
                        labelStyle={{ color: '#ffffff' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="utilization" 
                        stroke="#10b981" 
                        strokeWidth={2} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-[#0F172A] rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-blue-400">Operational Insights</h3>
              <div className="bg-[#1E293B] p-4 rounded-lg text-gray-300">
                <p className="font-semibold text-blue-300">Key Findings from Recent Disaster Responses:</p>
                <ul className="list-disc list-inside mt-2 space-y-2">
                  <li>Shelters were 30% underutilized during Kerala floods</li>
                  <li>Average response time improved by 15% compared to previous quarter</li>
                  <li>Medical kit distribution was 22% more efficient in Chennai</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'predictive' && (
          <div className="bg-[#1E293B] rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Predictive Disaster Insights</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#0F172A] rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-blue-300">Disaster Forecast</h3>
                <div className="bg-[#1E293B] h-64 rounded-lg flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={disasterForecastData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis dataKey="region" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0F172A', 
                          borderColor: '#1E293B' 
                        }} 
                        labelStyle={{ color: '#ffffff' }}
                      />
                      <Bar dataKey="cyclone" stackId="a" fill="#3b82f6" />
                      <Bar dataKey="flood" stackId="a" fill="#10b981" />
                      <Bar dataKey="landslide" stackId="a" fill="#f43f5e" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#0F172A] rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-blue-300">Risk Heatmap</h3>
                <div className="bg-[#1E293B] h-64 rounded-lg flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={riskHeatmapData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis dataKey="region" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0F172A', 
                          borderColor: '#1E293B' 
                        }} 
                        labelStyle={{ color: '#ffffff' }}
                      />
                      <Bar 
                        dataKey="risk" 
                        fill="#f43f5e" 
                        radius={[10, 10, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-[#0F172A] rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-blue-400">High-Risk Region Forecast</h3>
              <div className="space-y-3">
                {[
                  { region: 'Coastal Maharashtra', risk: 'High', probability: '75%', type: 'Cyclone' },
                  { region: 'Himalayan Foothills', risk: 'Medium', probability: '55%', type: 'Landslide' },
                  { region: 'North Eastern States', risk: 'Low', probability: '35%', type: 'Flood' }
                ].map((prediction, index) => (
                  <div 
                    key={index} 
                    className="bg-[#1E293B] p-3 rounded-lg flex justify-between items-center hover:bg-slate-800 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-blue-300">{prediction.region}</div>
                      <div className="text-sm text-gray-400">
                        {prediction.type} Risk Assessment
                      </div>
                    </div>
                    <div>
                      <span className={`
                        px-3 py-1 rounded-full text-xs
                        ${prediction.risk === 'High' ? 'bg-red-900/50 text-red-300' : 
                          prediction.risk === 'Medium' ? 'bg-yellow-900/50 text-yellow-300' : 
                          'bg-green-900/50 text-green-300'}
                      `}>
                        {prediction.risk} Risk ({prediction.probability})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;