import ClientLoginForm from "../../components/client/auth/ClientLoginForm";
import AuthSplitLayout from "../../components/shared/auth/AuthSplitLayout";

export default function ClientLoginPage() {
  return (
    <AuthSplitLayout
      accessLabel="Client Access"
      title={
        <>
          CLIENT
          <br />
          PORTAL
        </>
      }
      description="Sign in to view project updates, shared documents, progress, and important information related to your company’s work with our team."
      featureItems={[
        { label: "Projects" },
        { label: "Files" },
        { label: "Updates" },
      ]}
      formEyebrow="Welcome Back"
      formTitle="Sign In"
      formDescription="Use your email and password to access your client portal. If this is your first time, use the invitation link sent to your email to finish setting up your account."
      footerContent={
        <>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-primary)]">
            First-Time Setup
          </p>
          <p className="mt-2 text-[12px] leading-6 text-[var(--color-muted)]">
            Invited clients should create their password from the secure email
            link before attempting to sign in here.
          </p>
        </>
      }
    >
      <ClientLoginForm />
    </AuthSplitLayout>
  );
}
