import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import MovieManagement from './pages/MovieManagement';
import ContentModeration from './pages/ContentModeration';
import PlatformSettings from './pages/PlatformSettings';
import NotificationManagement from './pages/NotificationManagement';
import MovieDetail from './pages/MovieDetails';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/Home" replace />} />

      <Route
        path="/Home"
        element={
          <Layout currentPageName="Home">
            <Home />
          </Layout>
        }
      />

      <Route
        path="/MovieDetail"
        element={
          <Layout currentPageName="MovieDetail">
            <MovieDetail />
          </Layout>
        }
      />

      <Route
        path="/AdminDashboard"
        element={
          <Layout currentPageName="AdminDashboard">
            <AdminDashboard />
          </Layout>
        }
      />

      <Route
        path="/UserManagement"
        element={
          <Layout currentPageName="UserManagement">
            <UserManagement />
          </Layout>
        }
      />

      <Route
        path="/MovieManagement"
        element={
          <Layout currentPageName="MovieManagement">
            <MovieManagement />
          </Layout>
        }
      />

      <Route
        path="/ContentModeration"
        element={
          <Layout currentPageName="ContentModeration">
            <ContentModeration />
          </Layout>
        }
      />

      <Route
        path="/PlatformSettings"
        element={
          <Layout currentPageName="PlatformSettings">
            <PlatformSettings />
          </Layout>
        }
      />

      <Route
        path="/NotificationManagement"
        element={
          <Layout currentPageName="NotificationManagement">
            <NotificationManagement />
          </Layout>
        }
      />

      <Route path="*" element={<Navigate to="/Home" replace />} />
    </Routes>
  );
}
