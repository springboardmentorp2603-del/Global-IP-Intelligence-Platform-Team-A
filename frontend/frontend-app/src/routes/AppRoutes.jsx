import { Routes, Route } from "react-router-dom";
import LandingPage from "../components/LandingPage";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import UserDashboard from "../Pages/UserDashboard";
import AdminDashboard from "../Pages/AdminDashboard";
import AnalystDashboard from "../Pages/AnalystDashboard";
import ProtectedRoute from "./ProtectedRoute";
import IPDetails from "../Pages/IPDetails";
import Alerts from "../Pages/Alerts";
import Analytics from "../Pages/Analytics";
import RegistrationChoice from "../Pages/RegistrationChoice";
import AnalystRegistration from "../Pages/AnalystRegistration";
import AdminRequestManagement from "../Pages/AdminRequestManagement";
import SystemLogs from "../Pages/SystemLogs.jsx";
import ActivityLogs from "../Pages/ActivityLogs.jsx";
import Profile from "../Pages/Profile.jsx";
import EditProfile from "../Pages/EditProfile.jsx";
import UpdatePassword from "../Pages/UpdatePassword.jsx";
import OAuth2Success from "../Pages/OAuth2Success";

import SearchPage from "../Pages/SearchPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegistrationChoice />} />
      <Route path="/oauth2-success" element={<OAuth2Success />} />

      <Route path="/register/user" element={<Register />} />
      <Route path="/register/analyst" element={<AnalystRegistration />} />


      {/* Protected Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/update-password"
        element={
          <ProtectedRoute>
            <UpdatePassword />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute feature="SEARCH">
            <SearchPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ip/:id"
        element={
          <ProtectedRoute feature="SEARCH">
            <IPDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/alerts"
        element={
          <ProtectedRoute feature="TRACKING">
            <Alerts />
          </ProtectedRoute>
        }
      />

      {/* Role-specific dashboards */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute feature="ADMIN_DASHBOARD">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analyst-dashboard"
        element={
          <ProtectedRoute feature="ANALYST_DASHBOARD">
            <AnalystDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute feature="USER_DASHBOARD">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute feature="ANALYTICS">
            <Analytics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute feature="USER_MANAGEMENT">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/logs"
        element={
          <ProtectedRoute feature="API_MONITORING">
            <div><SystemLogs /></div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/activity"
        element={
          <ProtectedRoute feature="API_MONITORING">
            <ActivityLogs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/analyst-requests"
        element={
          <ProtectedRoute feature="USER_MANAGEMENT">
            <AdminRequestManagement />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;