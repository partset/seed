import AdminLoginForm from "../../components/admin/auth/AdminLoginForm";
import AuthSplitLayout from "../../components/shared/auth/AuthSplitLayout";

export default function AdminLoginPage() {
  return (
    <AuthSplitLayout
      accessLabel="Internal Access"
      title={
        <>
          ADMIN
          <br />
          PORTAL
        </>
      }
      description="Sign in to manage incoming leads, convert businesses into clients, track project progress, upload documents, and monitor payments."
      featureItems={[
        { label: "Leads" },
        { label: "Clients" },
        { label: "Projects" },
      ]}
      formEyebrow="Welcome Back"
      formTitle="Sign In"
      formDescription="Use your admin credentials to access the internal portal."
    >
      <AdminLoginForm />
    </AuthSplitLayout>
  );
}
