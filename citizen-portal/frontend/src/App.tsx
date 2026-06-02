import * as React from "react";
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useCitizenStore } from "./store/citizenStore";
import { ToastProvider } from "./components/ui/Toast";

// Layout components
import { Navbar } from "./components/layout/Navbar";
import { Sidebar } from "./components/layout/Sidebar";
import { Footer } from "./components/layout/Footer";
import { Breadcrumbs } from "./components/layout/Breadcrumbs";

// Page modules
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import TrackStatus from "./pages/TrackStatus";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";

// ==========================================
// ROUTE SECURITY CONTROLLERS
// ==========================================

interface GuardProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<GuardProps> = ({ children }) => {
  const { isAuthenticated } = useCitizenStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AdminRoute: React.FC<GuardProps> = ({ children }) => {
  const { isAuthenticated, user } = useCitizenStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role !== "Admin") {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

// ==========================================
// CENTRAL WORKSPACE LAYOUT WRAPPER
// ==========================================

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { initialize, isAuthenticated } = useCitizenStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  // Initialize store and check caches
  React.useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className="h-screen flex flex-row bg-[#f5f5f5] text-[#212121] overflow-hidden">
      {/* Sidebar full-height left pane */}
      {isAuthenticated && (
        <Sidebar 
          isOpen={mobileSidebarOpen} 
          onClose={() => setMobileSidebarOpen(false)} 
        />
      )}
      
      {/* Main interactive screen workspace block (right pane) */}
      <div className="flex-1 flex flex-col min-w-0 w-full h-screen overflow-hidden">
        <div className="flex flex-col w-full shrink-0">
          <Navbar onMobileMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
          <Breadcrumbs />
        </div>
        
        <main className="flex-1 flex flex-col w-full overflow-y-auto overflow-x-hidden bg-[#f5f5f5]">
          {children}
          <Footer />
        </main>
      </div>
    </div>
  );
};

// Router layout router proxy selector to determine home vs dashboard dynamically
const GatewaySelector: React.FC = () => {
  const { isAuthenticated } = useCitizenStore();
  return isAuthenticated ? <Dashboard /> : <Home />;
};

export default function App() {
  return (
    <ToastProvider>
      <Router>
        <AppLayout>
          <Routes>
            {/* Dynamic Root Selector */}
            <Route path="/" element={<GatewaySelector />} />

            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/services" element={<Services />} />

            {/* Secure paths for verified citizen profiles */}
            <Route
              path="/track"
              element={
                <ProtectedRoute>
                  <TrackStatus />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Officer Cleared terminal nodes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />

            {/* Wildcard Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </Router>
    </ToastProvider>
  );
}
