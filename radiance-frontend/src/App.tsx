import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import ClientDashboardPage from "./pages/client/ClientDashboardPage";
import ClientDocumentViewerPage from "./pages/client/ClientDocumentViewerPage";
import ClientDocumentsPage from "./pages/client/ClientDocumentsPage";
import ClientUpdatesPage from "./pages/client/ClientUpdatesPage";
import AdminCompaniesPage from "./pages/admin/AdminCompaniesPage";
import AdminProjectDetailsPage from "./pages/admin/AdminProjectDetailsPage";
import AdminCompanyDetailsPage from "./pages/admin/AdminCompanyDetailsPage";

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <ClientAuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/play" element={<PlayPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />

            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route element={<AdminProtectedRoute />}>
              <Route path="/admin/leads" element={<LeadsPage />} />
              <Route
                path="/admin/leads/:leadId"
                element={<LeadDetailsPage />}
              />
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

            <Route path="/client/login" element={<ClientLoginPage />} />

            <Route element={<ClientProtectedRoute />}>
              <Route
                path="/client/dashboard"
                element={<ClientDashboardPage />}
              />
              <Route
                path="/client/documents"
                element={<ClientDocumentsPage />}
              />
              <Route
                path="/client/documents/:documentId"
                element={<ClientDocumentViewerPage />}
              />
              <Route path="/client/updates" element={<ClientUpdatesPage />} />
            </Route>
          </Routes>
        </ClientAuthProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
