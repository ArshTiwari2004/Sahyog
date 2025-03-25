import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { 
  Shield, 
  Bell, 
  Database, 
  Webhook, 
  Zap, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';

const Settings = () => {
  const [userRole, setUserRole] = useState('admin');
  const [notifications, setNotifications] = useState({
    sms: true,
    email: false,
    pushNotification: true
  });

  const [apiStatus, setApiStatus] = useState({
    kafka: 'Disconnected',
    vertexAI: 'Disconnected',
    gemini: 'Disconnected'
  });

  // Simulate API connection status check
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        // Simulated API checks
        const kafkaStatus = Math.random() > 0.2 ? 'Connected' : 'Disconnected';
        const vertexAIStatus = Math.random() > 0.1 ? 'Connected' : 'Disconnected';
        const geminiStatus = Math.random() > 0.15 ? 'Connected' : 'Disconnected';

        setApiStatus({
          kafka: kafkaStatus,
          vertexAI: vertexAIStatus,
          gemini: geminiStatus
        });
      } catch (error) {
        console.error('API status check failed', error);
      }
    };

    // Initial check
    checkApiStatus();

    // Periodic status check
    const intervalId = setInterval(checkApiStatus, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const SettingSection = ({ title, children, icon: Icon }) => (
    <div className="bg-slate-900 rounded-xl p-6 space-y-4 shadow-lg">
      <div className="flex items-center space-x-3 border-b border-slate-700 pb-3">
        <Icon className="text-blue-400" size={24} />
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );

  const ToggleSwitch = ({ isActive, onChange }) => (
    <div 
      onClick={onChange} 
      className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${
        isActive 
          ? 'bg-blue-600' 
          : 'bg-slate-700'
      }`}
    >
      <div 
        className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
          isActive 
            ? 'translate-x-6' 
            : 'translate-x-0'
        }`} 
      />
    </div>
  );

  return (
    <div className="flex bg-[#0F172A] min-h-screen text-white">
        <Sidebar />
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <h1 className="text-4xl font-bold mb-10 text-center text-blue-400">
          System Configuration
        </h1>

        <div className="space-y-8">
          {/* User Roles & Permissions */}
          <SettingSection title="User Roles & Permissions" icon={Shield}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Role
                </label>
                <select 
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
                >
                  <option value="admin">Admin</option>
                  <option value="responder">Responder</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>

              <div className="bg-slate-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-3 text-blue-300">Role Permissions</h3>
                {userRole === 'admin' && (
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 text-green-500" size={16} />
                      Full System Access
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 text-green-500" size={16} />
                      Manage Users
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 text-green-500" size={16} />
                      Resource Allocation
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 text-green-500" size={16} />
                      Generate Alerts
                    </li>
                  </ul>
                )}
                {userRole === 'responder' && (
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 text-green-500" size={16} />
                      View Incidents
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 text-green-500" size={16} />
                      Update Team Status
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 text-green-500" size={16} />
                      Resource Tracking
                    </li>
                    <li className="flex items-center">
                      <XCircle className="mr-2 text-red-500" size={16} />
                      User Management
                    </li>
                  </ul>
                )}
                {userRole === 'viewer' && (
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 text-green-500" size={16} />
                      View Dashboard
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 text-green-500" size={16} />
                      View Reports
                    </li>
                    <li className="flex items-center">
                      <XCircle className="mr-2 text-red-500" size={16} />
                      Resource Allocation
                    </li>
                    <li className="flex items-center">
                      <XCircle className="mr-2 text-red-500" size={16} />
                      Team Management
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </SettingSection>

          {/* Notification Preferences */}
          <SettingSection title="Alert Preferences" icon={Bell}>
            <div className="space-y-4">
              <div className="bg-slate-800 p-4 rounded-lg flex justify-between items-center">
                <span>SMS Notifications</span>
                <ToggleSwitch 
                  isActive={notifications.sms}
                  onChange={() => setNotifications(prev => ({...prev, sms: !prev.sms}))}
                />
              </div>

              <div className="bg-slate-800 p-4 rounded-lg flex justify-between items-center">
                <span>Email Notifications</span>
                <ToggleSwitch 
                  isActive={notifications.email}
                  onChange={() => setNotifications(prev => ({...prev, email: !prev.email}))}
                />
              </div>

              <div className="bg-slate-800 p-4 rounded-lg flex justify-between items-center">
                <span>Push Notifications</span>
                <ToggleSwitch 
                  isActive={notifications.pushNotification}
                  onChange={() => setNotifications(prev => ({...prev, pushNotification: !prev.pushNotification}))}
                />
              </div>
            </div>
          </SettingSection>

          {/* API Status Monitor */}
          <SettingSection title="Critical Integrations" icon={Webhook}>
            <div className="space-y-4">
              {Object.entries(apiStatus).map(([service, status]) => (
                <div 
                  key={service} 
                  className="bg-slate-800 p-4 rounded-lg flex justify-between items-center"
                >
                  <div className="flex items-center space-x-3">
                    <Zap 
                      className={
                        status === 'Connected' 
                          ? 'text-green-500' 
                          : 'text-red-500'
                      } 
                      size={20} 
                    />
                    <span className="capitalize">{service}</span>
                  </div>
                  <span 
                    className={`
                      font-semibold 
                      ${status === 'Connected' ? 'text-green-500' : 'text-red-500'}
                    `}
                  >
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </SettingSection>
        </div>

        <div className="mt-8 text-center text-slate-500">
          <p>Version 1.0.0 • Last Updated: March 2025</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;