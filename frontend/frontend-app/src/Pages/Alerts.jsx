import React, { useState } from "react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { Bell, CheckCircle, XCircle, AlertCircle, Clock, Filter, Eye } from "lucide-react";

const Alerts = () => {
  const [filter, setFilter] = useState("all");
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "Patent Filing",
      title: "New patent filing by MedTech Corp",
      description: "US Patent Application #2024012345 - AI-based Medical Imaging System",
      ipAsset: "AI-based Medical Imaging System",
      jurisdiction: "US",
      status: "Published",
      timestamp: "2026-02-17T10:30:00",
      read: false,
      severity: "info"
    },
    {
      id: 2,
      type: "Status Change",
      title: "Patent status changed to Granted",
      description: "Electric Vehicle Battery Technology (EP20231234) has been granted",
      ipAsset: "Electric Vehicle Battery Technology",
      jurisdiction: "EP",
      status: "Granted",
      timestamp: "2026-02-16T15:45:00",
      read: false,
      severity: "success"
    },
    {
      id: 3,
      type: "Competitor Activity",
      title: "New competitor filing detected",
      description: "Tesla filed new patent in semiconductor technology",
      ipAsset: "Semiconductor Device Architecture",
      jurisdiction: "US",
      status: "Filed",
      timestamp: "2026-02-16T09:20:00",
      read: true,
      severity: "warning"
    },
    {
      id: 4,
      type: "Legal Status",
      title: "Patent expired - renewal required",
      description: "Smart Agriculture Device patent needs renewal by March 2026",
      ipAsset: "Smart Agriculture Device",
      jurisdiction: "IN",
      status: "Expiring",
      timestamp: "2026-02-15T14:30:00",
      read: true,
      severity: "error"
    },
    {
      id: 5,
      type: "Trademark",
      title: "New trademark application",
      description: "Nike filed 'AirMax Pro' trademark in multiple jurisdictions",
      ipAsset: "AirMax Pro",
      jurisdiction: "US, EP, JP",
      status: "Applied",
      timestamp: "2026-02-15T11:10:00",
      read: false,
      severity: "info"
    }
  ]);

  const getSeverityIcon = (severity) => {
    switch(severity) {
      case "success": return <CheckCircle size={18} className="text-green-500" />;
      case "warning": return <AlertCircle size={18} className="text-yellow-500" />;
      case "error": return <XCircle size={18} className="text-red-500" />;
      default: return <Bell size={18} className="text-blue-500" />;
    }
  };

  const getSeverityBg = (severity) => {
    switch(severity) {
      case "success": return "bg-green-500/10 border-green-500/20";
      case "warning": return "bg-yellow-500/10 border-yellow-500/20";
      case "error": return "bg-red-500/10 border-red-500/20";
      default: return "bg-blue-500/10 border-blue-500/20";
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date.toLocaleDateString();
  };

  const markAsRead = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, read: true })));
  };

  const deleteAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const filteredAlerts = filter === "all" 
    ? alerts 
    : filter === "unread" 
      ? alerts.filter(a => !a.read)
      : alerts.filter(a => a.type.toLowerCase().includes(filter.toLowerCase()));

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Alerts & Notifications
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Stay updated with IP activities and changes
            </p>
          </div>
          
          <div className="flex gap-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm"
              >
                <CheckCircle size={16} />
                Mark All Read
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Alerts</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {alerts.length}
            </h3>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Unread</p>
            <h3 className="text-2xl font-bold text-yellow-600 mt-1">
              {unreadCount}
            </h3>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Patent Alerts</p>
            <h3 className="text-2xl font-bold text-blue-600 mt-1">
              {alerts.filter(a => a.type.includes("Patent")).length}
            </h3>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Trademark Alerts</p>
            <h3 className="text-2xl font-bold text-purple-600 mt-1">
              {alerts.filter(a => a.type.includes("Trademark")).length}
            </h3>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
            </div>
            
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                filter === "all" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              All
            </button>
            
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                filter === "unread" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Unread ({unreadCount})
            </button>
            
            <button
              onClick={() => setFilter("patent")}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                filter === "patent" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Patent
            </button>
            
            <button
              onClick={() => setFilter("trademark")}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                filter === "trademark" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Trademark
            </button>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-8 text-center">
              <Bell size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No alerts found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === "all" 
                  ? "You don't have any alerts yet." 
                  : `No ${filter} alerts available.`}
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow border ${
                  !alert.read ? 'border-l-4 border-l-blue-500' : 'border-gray-200 dark:border-gray-700'
                } p-6 transition hover:shadow-lg`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-2 rounded-lg ${getSeverityBg(alert.severity)}`}>
                      {getSeverityIcon(alert.severity)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {alert.title}
                        </h3>
                        {!alert.read && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                            New
                          </span>
                        )}
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={12} />
                          {formatTime(alert.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {alert.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          {alert.type}
                        </span>
                        <span className="text-gray-500">
                          {alert.ipAsset}
                        </span>
                        <span className="text-gray-500">
                          {alert.jurisdiction}
                        </span>
                        <span className={`px-2 py-1 rounded-full ${
                          alert.status === "Granted" ? "bg-green-100 text-green-600" :
                          alert.status === "Published" ? "bg-blue-100 text-blue-600" :
                          alert.status === "Expiring" ? "bg-red-100 text-red-600" :
                          "bg-gray-100 text-gray-600"
                        }`}>
                          {alert.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => markAsRead(alert.id)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                      title="Mark as read"
                    >
                      <Eye size={16} className="text-gray-500" />
                    </button>
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition"
                      title="Delete"
                    >
                      <XCircle size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Alerts;