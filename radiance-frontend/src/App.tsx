import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import AdminProtectedRoute from "./components/admin/auth/AdminProtectedRoute";
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

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<PlayPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin/leads" element={<LeadsPage />} />
            <Route path="/admin/leads/:leadId" element={<LeadDetailsPage />} />
          </Route>
          <Route path="/client/login" element={<ClientLoginPage />} />
          <Route path="/client/dashboard" element={<ClientDashboardPage />} />
          <Route path="/client/documents" element={<ClientDocumentsPage />} />
          <Route
            path="/client/documents/:documentId"
            element={<ClientDocumentViewerPage />}
          />
          <Route path="/client/updates" element={<ClientUpdatesPage />} />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
