import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Boxes, 
  Truck, 
  MapPin, 
  Search, 
  Filter, 
  X 
} from 'lucide-react';
import Sidebar from './Sidebar';

const Resources = () => {
  const [activeTab, setActiveTab] = useState('tracking');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResourceTypes, setSelectedResourceTypes] = useState([]);

  // Mock data with more detailed resources
  const resourceInventory = [
    { 
      id: 'RES-001', 
      name: 'Medical Kits', 
      type: 'Medical', 
      total: 5000, 
      available: 3250, 
      location: 'Warehouse A',
      lastUpdated: '2024-03-25 10:30 AM'
    },
    { 
      id: 'RES-002', 
      name: 'Non-Perishable Food Supplies', 
      type: 'Food', 
      total: 10000, 
      available: 6750, 
      location: 'Warehouse B',
      lastUpdated: '2024-03-25 09:15 AM'
    },
    { 
      id: 'RES-003', 
      name: 'Shelter Tents', 
      type: 'Shelter', 
      total: 2000, 
      available: 1500, 
      location: 'Warehouse C',
      lastUpdated: '2024-03-25 11:45 AM'
    },
    { 
      id: 'RES-004', 
      name: 'Water Purification Units', 
      type: 'Water', 
      total: 500, 
      available: 350, 
      location: 'Warehouse A',
      lastUpdated: '2024-03-25 08:50 AM'
    },
    { 
      id: 'RES-005', 
      name: 'Emergency Blankets', 
      type: 'Shelter', 
      total: 3000, 
      available: 2200, 
      location: 'Warehouse B',
      lastUpdated: '2024-03-25 10:05 AM'
    }
  ];

  const resourceAllocationData = [
    { 
      id: 'ALL-001',
      incident: 'Chennai Flood', 
      status: 'Pending',
      resources: [
        { name: 'Medical Kits', quantity: 250 },
        { name: 'Water Purification Units', quantity: 20 }
      ], 
      optimizedRoute: 'Warehouse A → Incident Site',
      estimatedArrival: '6-8 hours'
    },
    { 
      id: 'ALL-002',
      incident: 'Mumbai Earthquake', 
      status: 'In Progress',
      resources: [
        { name: 'Shelter Tents', quantity: 150 },
        { name: 'Emergency Blankets', quantity: 300 }
      ], 
      optimizedRoute: 'Warehouse B → Incident Site',
      estimatedArrival: '3-5 hours'
    }
  ];

  // Filtered and searched resources
  const filteredResources = useMemo(() => {
    return resourceInventory.filter(resource => {
      const matchesSearch = !searchQuery || 
        Object.values(resource).some(value => 
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        );
      
      const matchesTypeFilter = selectedResourceTypes.length === 0 || 
        selectedResourceTypes.includes(resource.type);
      
      return matchesSearch && matchesTypeFilter;
    });
  }, [searchQuery, selectedResourceTypes, resourceInventory]);

  // Resource type filter toggle
  const toggleResourceTypeFilter = (type) => {
    setSelectedResourceTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // Get unique resource types
  const resourceTypes = [...new Set(resourceInventory.map(r => r.type))];

  return (
    <div className="flex bg-[#0F172A] min-h-screen text-white">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <Package className="w-8 h-8 mr-3 text-blue-400" />
            Resources Management
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search resources..."
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
            <div className="relative">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
                <Filter className="w-5 h-5 mr-2" /> Filters
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-[#1E293B] rounded-lg shadow-lg border border-gray-700 p-3">
                <div className="text-sm font-semibold mb-2">Resource Types</div>
                {resourceTypes.map(type => (
                  <label 
                    key={type} 
                    className="flex items-center space-x-2 mb-1 cursor-pointer"
                  >
                    <input 
                      type="checkbox" 
                      checked={selectedResourceTypes.includes(type)}
                      onChange={() => toggleResourceTypeFilter(type)}
                      className="form-checkbox h-4 w-4 text-blue-600 bg-gray-800 border-gray-700 rounded"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex mb-6 space-x-4">
          {[
            { key: 'tracking', label: 'RFID Tracking', icon: Boxes },
            { key: 'allocation', label: 'Resource Allocation', icon: Truck }
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
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'tracking' && (
          <div className="bg-[#1E293B] rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-green-400" />
                Live RFID Tracking
                {searchQuery && (
                  <span className="ml-3 text-sm text-gray-400">
                    ({filteredResources.length} results)
                  </span>
                )}
              </h2>
            </div>

            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.map((resource) => (
                  <div 
                    key={resource.id} 
                    className="bg-[#0F172A] p-4 rounded-lg border border-gray-700 hover:border-blue-600 transition-all"
                  >
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">{resource.name}</span>
                      <span className="text-green-400">
                        {((resource.available / resource.total) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="bg-[#1E293B] rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{width: `${(resource.available / resource.total) * 100}%`}}
                      ></div>
                    </div>
                    <div className="mt-2 text-sm">
                      <div className="flex justify-between text-gray-400">
                        <span>Available</span>
                        <span>{resource.available} / {resource.total}</span>
                      </div>
                      <div className="flex justify-between text-gray-400 mt-1">
                        <span>Location</span>
                        <span>{resource.location}</span>
                      </div>
                      <div className="flex justify-between text-gray-400 mt-1">
                        <span>Last Updated</span>
                        <span>{resource.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No resources found matching your search.
              </div>
            )}
          </div>
        )}

        {activeTab === 'allocation' && (
          <div className="bg-[#1E293B] rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <Truck className="w-6 h-6 mr-2 text-blue-400" />
                Resource Allocation Dashboard
              </h2>
            </div>

            <div className="space-y-4">
              {resourceAllocationData.map((allocation) => (
                <div 
                  key={allocation.id}
                  className="bg-[#0F172A] p-4 rounded-lg border border-gray-700 hover:border-blue-600 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-lg">{allocation.incident}</div>
                      <div className="text-sm text-gray-400 mt-1">
                        <span 
                          className={`
                            px-2 py-1 rounded-full text-xs
                            ${allocation.status === 'Pending' 
                              ? 'bg-yellow-500/20 text-yellow-400' 
                              : 'bg-green-500/20 text-green-400'}
                          `}
                        >
                          {allocation.status}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="text-sm font-medium">Resources:</div>
                        {allocation.resources.map((resource) => (
                          <div 
                            key={resource.name} 
                            className="text-sm text-gray-400 flex justify-between"
                          >
                            <span>{resource.name}</span>
                            <span>{resource.quantity} units</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-sm text-gray-400 mt-2">
                        Optimized Route: {allocation.optimizedRoute}
                      </div>
                      <div className="text-sm text-gray-400">
                        Estimated Arrival: {allocation.estimatedArrival}
                      </div>
                    </div>
                    <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-700">
                      Deploy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;