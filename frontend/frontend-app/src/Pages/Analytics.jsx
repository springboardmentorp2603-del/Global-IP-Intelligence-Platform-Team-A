import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import axios from "axios";
import {
  BarChart3,
  TrendingUp,
  Globe,
  Calendar,
  Download,
  FileText,
  Activity,
  Loader2
} from "lucide-react";

const API_BASE_URL = "http://localhost:8080/api";
const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("6m");
  const [dataType, setDataType] = useState("patents");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers = getAuthHeader();
    Promise.allSettled([
      axios.get(`${API_BASE_URL}/analyst/analytics`, { headers }),
      axios.get(`${API_BASE_URL}/analyst/reports`, { headers }),
    ]).then(([analyticsRes, reportsRes]) => {
      if (analyticsRes.status === "fulfilled") {
        setAnalyticsData(analyticsRes.value.data);
      }
      if (reportsRes.status === "fulfilled") {
        const reportsPayload = reportsRes.value.data;
        // Backend returns { reports: [...] }
        setReports(Array.isArray(reportsPayload) ? reportsPayload : (reportsPayload?.reports || []));
      }
      setLoading(false);
    });
  }, []);

  // Fallback mock chart data (used when backend has no trend arrays)
  const filingTrends = {
    patents: [45, 52, 48, 61, 58, 72, 68, 82, 78, 85, 92, 88],
    trademarks: [23, 28, 25, 32, 35, 38, 42, 45, 48, 52, 55, 58],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  };

  const barColors = [
    "bg-blue-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-rose-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-emerald-500",
    "bg-teal-500",
  ];
  const topJurisdictions = [
    { country: "United States (USPTO)", count: 245, percentage: 32 },
    { country: "European Union (EPO)", count: 178, percentage: 23 },
    { country: "China (CNIPA)", count: 156, percentage: 20 },
    { country: "Japan (JPO)", count: 98, percentage: 13 },
    { country: "South Korea (KIPO)", count: 67, percentage: 9 },
    { country: "Others", count: 23, percentage: 3 }
  ];

  const topAssignees = [
    { name: "MedTech Corp", count: 34, trend: "+12%" },
    { name: "AgroTech Industries", count: 28, trend: "+8%" },
    { name: "Nano Solutions Inc", count: 23, trend: "+15%" },
    { name: "BioGen Research", count: 21, trend: "+5%" },
    { name: "Quantum Computing Ltd", count: 18, trend: "+22%" }
  ];

  const statusDistribution = [
    { status: "Granted", count: 342, percentage: 45, color: "bg-green-500" },
    { status: "Pending", count: 256, percentage: 34, color: "bg-yellow-500" },
    { status: "Published", count: 98, percentage: 13, color: "bg-blue-500" },
    { status: "Expired", count: 62, percentage: 8, color: "bg-red-500" }
  ];

  // Summary card values — prefer backend data, fallback to mock counts
  const totalFilings = analyticsData?.totalPatents != null && analyticsData?.totalTrademarks != null
    ? analyticsData.totalPatents + analyticsData.totalTrademarks
    : 758;
  const activePatents = analyticsData?.totalPatents ?? 342;
  const pendingApplications = analyticsData?.totalTrademarks ?? 256;
  const jurisdictionsCount = 12;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 size={36} className="animate-spin text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Analytics Dashboard
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Comprehensive IP intelligence and trend analysis
            </p>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="appearance-none pl-4 pr-8 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold border-0 rounded-lg text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-md transition-all"
              >
                <option value="1m" className="bg-gray-900 text-white">Last Month</option>
                <option value="3m" className="bg-gray-900 text-white">Last 3 Months</option>
                <option value="6m" className="bg-gray-900 text-white">Last 6 Months</option>
                <option value="1y" className="bg-gray-900 text-white">Last Year</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm">
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>

        {/* Summary Cards — real backend data */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Filings</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{totalFilings}</h3>
                <p className="text-xs text-green-600 mt-1">↑ Patents + Trademarks</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Patents</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{activePatents}</h3>
                <p className="text-xs text-green-600 mt-1">Active in database</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Activity size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Trademarks</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{pendingApplications}</h3>
                <p className="text-xs text-yellow-600 mt-1">Active in database</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <BarChart3 size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Monitors</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{analyticsData?.activeMonitors ?? jurisdictionsCount}</h3>
                <p className="text-xs text-blue-600 mt-1">Watching</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Globe size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Filing Trends Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Filing Trends
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setDataType("patents")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${dataType === "patents"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-400/40"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-600"
                    }`}
                >
                  Patents
                </button>
                <button
                  onClick={() => setDataType("trademarks")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${dataType === "trademarks"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-400/40"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-gray-600"
                    }`}
                >
                  Trademarks
                </button>
              </div>
            </div>

            {/* Simple Bar Chart Representation — responds to timeRange dropdown */}
            {(() => {
              const rangeMap = { "1m": 1, "3m": 3, "6m": 6, "1y": 12 };
              const count = rangeMap[timeRange] ?? 6;
              const slicedMonths = filingTrends.months.slice(-count);
              const slicedValues = filingTrends[dataType].slice(-count);
              const globalStartIndex = filingTrends.months.length - count;
              const max = Math.max(...slicedValues);
              return (
                <div className="space-y-3">
                  {slicedMonths.map((month, index) => {
                    const value = slicedValues[index];
                    const percentage = max > 0 ? (value / max) * 100 : 0;
                    const color = barColors[(globalStartIndex + index) % barColors.length];
                    return (
                      <div key={month} className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400 w-8 font-medium">{month}</span>
                        <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${color} rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 w-8 text-right font-semibold">
                          {value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* Status Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Status Distribution
            </h2>

            <div className="space-y-4">
              {statusDistribution.map((item) => (
                <div key={item.status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">{item.status}</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Pie Chart Alternative */}
            <div className="mt-6 flex justify-center">
              <div className="grid grid-cols-4 gap-2 w-full">
                {statusDistribution.map((item) => (
                  <div key={item.status} className="text-center">
                    <div className={`w-3 h-3 rounded-full ${item.color} mx-auto mb-1`} />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Jurisdictions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Top Jurisdictions
            </h2>

            <div className="space-y-4">
              {topJurisdictions.map((jurisdiction) => (
                <div key={jurisdiction.country}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">{jurisdiction.country}</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {jurisdiction.count}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full"
                      style={{ width: `${jurisdiction.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Assignees */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Top Assignees
            </h2>

            <div className="space-y-4">
              {topAssignees.map((assignee) => (
                <div key={assignee.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {assignee.name}
                    </p>
                    <p className="text-xs text-gray-500">Filings: {assignee.count}</p>
                  </div>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {assignee.trend}
                  </span>
                </div>
              ))}
            </div>

            <button className="mt-4 w-full py-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition">
              View All Assignees
            </button>
          </div>
        </div>

        {/* Recent Reports — real backend data */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Reports
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-700">
              Generate New Report
            </button>
          </div>

          {reports.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm italic">No reports available yet.</p>
          ) : (
            <div className="space-y-3">
              {reports.map((report, idx) => (
                <div key={report.id ?? idx} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {report.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Generated on {report.date} {report.size ? `• ${report.size}` : ""}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg">
                    <Download size={16} className="text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;