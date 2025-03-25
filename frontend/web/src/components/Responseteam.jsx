import React, { useState } from 'react';
import Sidebar from './Sidebar';
const ResponseTeams = () => {
  const [activeTab, setActiveTab] = useState('status');

  return (
    <div className="flex bg-[#0F172A] min-h-screen text-white">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-300">Response Teams</h1>
        
        <div className="flex mb-4 space-x-4">
          <button 
            className={`
              px-4 py-2 rounded-lg transition-all flex items-center
              ${activeTab === 'status' 
                ? 'bg-blue-600 text-white' 
                : 'bg-[#1E293B] text-gray-400 hover:bg-slate-800'}
            `}
            onClick={() => setActiveTab('status')}
          >
            Team Status
          </button>
          <button 
            className={`
              px-4 py-2 rounded-lg transition-all flex items-center
              ${activeTab === 'optimization' 
                ? 'bg-blue-600 text-white' 
                : 'bg-[#1E293B] text-gray-400 hover:bg-slate-800'}
            `}
            onClick={() => setActiveTab('optimization')}
          >
            Path Optimization
          </button>
        </div>

        {activeTab === 'status' && (
          <div className="bg-[#1E293B] rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Team Status Overview</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0F172A] text-gray-400">
                  <tr>
                    <th className="p-3 text-left">Team ID</th>
                    <th className="p-3 text-left">Location</th>
                    <th className="p-3 text-left">Assigned Incident</th>
                    <th className="p-3 text-left">Skills</th>
                    <th className="p-3 text-left">Availability</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { 
                      id: 'TEAM-01', 
                      location: 'Chennai', 
                      incident: 'Flood Response', 
                      skills: ['Medical', 'Rescue'], 
                      availability: 'Active' 
                    },
                    { 
                      id: 'TEAM-02', 
                      location: 'Mumbai', 
                      incident: 'Earthquake Support', 
                      skills: ['Search', 'First Aid'], 
                      availability: 'On Standby' 
                    },
                    { 
                      id: 'TEAM-03', 
                      location: 'Delhi', 
                      incident: 'No Active Assignment', 
                      skills: ['Logistics', 'Communication'], 
                      availability: 'Available' 
                    }
                  ].map((team) => (
                    <tr key={team.id} className="border-b border-slate-700 hover:bg-slate-800 transition-colors">
                      <td className="p-3">{team.id}</td>
                      <td className="p-3">{team.location}</td>
                      <td className="p-3">{team.incident}</td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          {team.skills.map((skill) => (
                            <span 
                              key={skill} 
                              className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded-full text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`
                          px-2 py-1 rounded-full text-xs
                          ${team.availability === 'Active' ? 'bg-green-900/50 text-green-300' : 
                            team.availability === 'On Standby' ? 'bg-yellow-900/50 text-yellow-300' : 
                            'bg-blue-900/50 text-blue-300'}
                        `}>
                          {team.availability}
                        </span>
                      </td>
                      <td className="p-3">
                        <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-700 transition-colors">
                          Reassign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'optimization' && (
          <div className="bg-[#1E293B] rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Path Optimization Tool</h2>
            <div className="bg-[#0F172A] p-6 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Incident Location
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter location" 
                    className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Disaster Type
                  </label>
                  <select 
                    className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option>Flood</option>
                    <option>Earthquake</option>
                    <option>Cyclone</option>
                    <option>Landslide</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 bg-[#1E293B] rounded-lg h-64 flex items-center justify-center">
                <p className="text-gray-500">
                  Optimal Route Visualization Placeholder
                </p>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-blue-300">Recommended Response Team</h3>
                  <p className="text-gray-400">TEAM-02 (Mumbai)</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-300">Estimated Travel Time</h3>
                  <p className="text-gray-400">2h 15m</p>
                </div>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Optimize and Deploy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponseTeams;