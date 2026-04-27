import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { ClientAuthProvider } from "./context/ClientAuthContext";
import AdminProtectedRoute from "./components/admin/auth/AdminProtectedRoute";
import ClientProtectedRoute from "./components/client/auth/ClientProtectedRoute";
import Home from "./pages/Home";
import PlayPage from "./pages/PlayPage";
import PricingPage from "./pages/PricingPage";
import ContactPage from "./pages/ContactPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import LeadsPage from "./pages/admin/LeadsPage";
import LeadDetailsPage from "./pages/admin/LeadDetailsPage";
import ClientLoginPage from "./pages/client/ClientLoginPage";
import ClientProjectsPage from "./pages/client/ClientProjectsPage";
import ClientDashboardPage from "./pages/client/ClientDashboardPage";
import ClientDocumentViewerPage from "./pages/client/ClientDocumentViewerPage";
import ClientDocumentsPage from "./pages/client/ClientDocumentsPage";
import ClientUpdatesPage from "./pages/client/ClientUpdatesPage";
import AdminCompaniesPage from "./pages/admin/AdminCompaniesPage";
import AdminProjectDetailsPage from "./pages/admin/AdminProjectDetailsPage";
import AdminCompanyDetailsPage from "./pages/admin/AdminCompanyDetailsPage";

function AdminAuthLayout() {
  return (
    <AdminAuthProvider>
      <Outlet />
    </AdminAuthProvider>
  );
}

function ClientAuthLayout() {
  return (
    <ClientAuthProvider>
      <Outlet />
    </ClientAuthProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<PlayPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Admin routes */}
        <Route element={<AdminAuthLayout />}>
          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin/leads" element={<LeadsPage />} />
            <Route path="/admin/leads/:leadId" element={<LeadDetailsPage />} />
            <Route path="/admin" element={<AdminCompaniesPage />} />
            <Route
              path="/admin/:companyId"
              element={<AdminCompanyDetailsPage />}
            />
            <Route
              path="/admin/:companyId/:projectId"
              element={<AdminProjectDetailsPage />}
            />
          </Route>
        </Route>

        {/* Client routes */}
        <Route element={<ClientAuthLayout />}>
          <Route path="/client/login" element={<ClientLoginPage />} />

          <Route element={<ClientProtectedRoute />}>
            <Route path="/client" element={<ClientProjectsPage />} />
            <Route
              path="/client/:projectId"
              element={<ClientDashboardPage />}
            />
            <Route
              path="/client/:projectId/documents"
              element={<ClientDocumentsPage />}
            />
            <Route
              path="/client/:projectId/documents/:documentId"
              element={<ClientDocumentViewerPage />}
            />
            <Route
              path="/client/:projectId/updates"
              element={<ClientUpdatesPage />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
