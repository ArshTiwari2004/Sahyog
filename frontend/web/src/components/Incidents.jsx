import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  Filter, 
  Search, 
  MoreHorizontal, 
  ChevronDown,
  X
} from 'lucide-react';
import Sidebar from './Sidebar';

const Incidents = () => {
  const [activeTab, setActiveTab] = useState('reported-incidents');
  const [searchQuery, setSearchQuery] = useState('');

  const reportedIncidents = [
    { id: 'INC-001', type: 'Flood', location: 'Chennai', severity: 'High', status: 'Assigned' },
    { id: 'INC-002', type: 'Earthquake', location: 'Delhi', severity: 'Medium', status: 'Pending' },
    { id: 'INC-003', type: 'Cyclone', location: 'Mumbai', severity: 'Low', status: 'Resolved' }
  ];

  const predictedDisasters = [
    { type: 'Flood', location: 'Mumbai', confidence: '85%', time: 'Next 24hrs' },
    { type: 'Cyclone', location: 'Chennai', confidence: '65%', time: 'Next 48hrs' },
    { type: 'Landslide', location: 'Kerala', confidence: '45%', time: 'Next 72hrs' }
  ];

  // Filtered incidents based on search query
  const filteredReportedIncidents = useMemo(() => {
    if (!searchQuery) return reportedIncidents;
    
    const lowercaseQuery = searchQuery.toLowerCase();
    return reportedIncidents.filter(incident => 
      Object.values(incident).some(value => 
        String(value).toLowerCase().includes(lowercaseQuery)
      )
    );
  }, [reportedIncidents, searchQuery]);

  // Filtered predicted disasters based on search query
  const filteredPredictedDisasters = useMemo(() => {
    if (!searchQuery) return predictedDisasters;
    
    const lowercaseQuery = searchQuery.toLowerCase();
    return predictedDisasters.filter(disaster => 
      Object.values(disaster).some(value => 
        String(value).toLowerCase().includes(lowercaseQuery)
      )
    );
  }, [predictedDisasters, searchQuery]);

  const getSeverityClasses = (severity) => {
    switch(severity) {
      case 'High': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'Low': return 'bg-green-500/20 text-green-400 border-green-500';
      default: return '';
    }
  };

  return (
    <div className="flex bg-[#0F172A] min-h-screen text-white">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <AlertTriangle className="w-8 h-8 mr-3 text-red-400" />
            Incidents Management
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search incidents..."
                className="bg-[#1E293B] text-white pl-10 pr-10 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
              <Filter className="w-5 h-5 mr-2" /> Filters
            </button>
          </div>
        </div>
        
        <div className="flex mb-6 space-x-4">
          {[
            { key: 'reported-incidents', label: 'Reported Incidents' },
            { key: 'predicted-disasters', label: 'Predicted Disasters' }
          ].map((tab) => (
            <button 
              key={tab.key}
              className={`
                px-4 py-2 rounded-lg transition-all flex items-center
                ${activeTab === tab.key
                  ? 'bg-blue-600 text-white' 
                  : 'bg-[#1E293B] text-gray-400 hover:bg-[#2C3E5A]'}
              `}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'reported-incidents' && (
          <div className="bg-[#1E293B] rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Reported Incidents 
                {searchQuery && (
                  <span className="ml-3 text-sm text-gray-400">
                    ({filteredReportedIncidents.length} results)
                  </span>
                )}
              </h2>
              <button className="text-gray-400 hover:text-white flex items-center">
                Export <ChevronDown className="ml-2 w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              {filteredReportedIncidents.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-[#0F172A] border-b border-gray-700">
                    <tr>
                      {['ID', 'Type', 'Location', 'Severity', 'Status', 'Actions'].map((header) => (
                        <th key={header} className="p-3 text-left text-gray-400 font-medium">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReportedIncidents.map((incident) => (
                      <tr 
                        key={incident.id} 
                        className="border-b border-gray-700 hover:bg-[#2C3E5A] transition-colors"
                      >
                        <td className="p-3">{incident.id}</td>
                        <td className="p-3">{incident.type}</td>
                        <td className="p-3">{incident.location}</td>
                        <td className="p-3">
                          <span className={`
                            px-2 py-1 rounded-full text-xs border
                            ${getSeverityClasses(incident.severity)}
                          `}>
                            {incident.severity}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`
                            px-2 py-1 rounded-full text-xs
                            ${incident.status === 'Assigned' ? 'bg-blue-500/20 text-blue-400' : 
                              incident.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                              'bg-green-500/20 text-green-400'}
                          `}>
                            {incident.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-700">
                              Details
                            </button>
                            <button className="text-gray-400 hover:text-white">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No incidents found matching your search.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'predicted-disasters' && (
          <div className="bg-[#1E293B] rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Predicted Disasters
                {searchQuery && (
                  <span className="ml-3 text-sm text-gray-400">
                    ({filteredPredictedDisasters.length} results)
                  </span>
                )}
              </h2>
              <button className="text-gray-400 hover:text-white flex items-center">
                Generate Report <ChevronDown className="ml-2 w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              {filteredPredictedDisasters.length > 0 ? (
                filteredPredictedDisasters.map((prediction, index) => (
                  <div 
                    key={index} 
                    className="bg-[#0F172A] p-4 rounded-lg flex justify-between items-center border border-gray-700 hover:border-blue-600 transition-all"
                  >
                    <div>
                      <div className="font-semibold text-white flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                        {prediction.type} in {prediction.location}
                      </div>
                      <div className="text-sm text-gray-400">Expected in {prediction.time}</div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">
                        {prediction.confidence} Confidence
                      </span>
                      <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-700">
                        Generate Alert
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No predicted disasters found matching your search.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Incidents;