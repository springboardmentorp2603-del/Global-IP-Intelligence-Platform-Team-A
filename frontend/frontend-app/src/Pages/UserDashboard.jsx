import DashboardLayout from "../components/layouts/DashboardLayout";

const UserDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Overview of your activity
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Total Searches
            </p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              24
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Saved Patents
            </p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              12
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Active Alerts
            </p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              5
            </h2>
          </div>

        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700 dark:text-gray-300">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-3 text-left font-medium">Title</th>
                  <th className="py-3 text-left font-medium">Date</th>
                  <th className="py-3 text-left font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <td className="py-3">Patent Search - AI System</td>
                  <td className="py-3">12 Feb 2026</td>
                  <td className="py-3 font-medium">Completed</td>
                </tr>

                <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <td className="py-3">Saved Patent - Smart Device</td>
                  <td className="py-3">10 Feb 2026</td>
                  <td className="py-3 font-medium">Saved</td>
                </tr>

                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <td className="py-3">Alert Created - Robotics</td>
                  <td className="py-3">08 Feb 2026</td>
                  <td className="py-3 font-medium">Active</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
