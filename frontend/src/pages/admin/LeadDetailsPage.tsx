import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LeadDetailsCard from "../../components/admin/leads/LeadDetailsCard";
import LeadEditForm, {
  type LeadEditFormValues,
} from "../../components/admin/leads/LeadEditForm";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { getLead } from "../../services/api/lead/getLead/api";
import { modifyLead } from "../../services/api/lead/modifyLead/api";
import { convertLeadToClient } from "../../services/api/lead/convertToClient/api";
import type { Lead } from "../../types/lead";
import { formatDate } from "../../utils/formatDate";

function mapLeadToFormValues(lead: Lead): LeadEditFormValues {
  return {
    companyName: lead.company_name ?? "",
    firstName: lead.first_name ?? "",
    lastName: lead.last_name ?? "",
    email: lead.email ?? "",
    phone: lead.phone ?? "",
    projectType: lead.project_type ?? "",
    message: lead.message ?? "",
    status: lead.status,
  };
}

export default function LeadDetailsPage() {
  const { leadId } = useParams<{ leadId: string }>();
  const { session } = useAdminAuth();
  const accessToken = session?.access_token;

  const [lead, setLead] = useState<Lead | null>(null);
  const [formValues, setFormValues] = useState<LeadEditFormValues | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [convertError, setConvertError] = useState("");
  const [convertSuccess, setConvertSuccess] = useState("");

  useEffect(() => {
    async function loadLead() {
      if (!accessToken) {
        setError("No active admin session found.");
        setIsLoading(false);
        return;
      }

      if (!leadId) {
        setError("Lead ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const result = await getLead(accessToken, leadId);

        if (!result) {
          setError("Lead not found.");
          setLead(null);
          setFormValues(null);
          return;
        }

        setLead(result);
        setFormValues(mapLeadToFormValues(result));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load lead details.";

        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadLead();
  }, [accessToken, leadId]);

  function handleEditClick() {
    if (!lead) return;

    setFormValues(mapLeadToFormValues(lead));
    setSaveError("");
    setConvertError("");
    setConvertSuccess("");
    setIsEditing(true);
  }

  function handleCancelEdit() {
    if (!lead) return;

    setFormValues(mapLeadToFormValues(lead));
    setSaveError("");
    setIsEditing(false);
  }

  function handleFormChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target;

    setFormValues((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        [name]: value,
      };
    });
  }

  async function handleConvertToClient() {
    if (!accessToken) {
      setConvertError("No active admin session found.");
      return;
    }

    if (!leadId) {
      setConvertError("Lead ID is missing.");
      return;
    }

    if (!lead) {
      setConvertError("Lead details are not available.");
      return;
    }

    try {
      setIsConverting(true);
      setConvertError("");
      setConvertSuccess("");

      const result = await convertLeadToClient(accessToken, leadId, {
        companyName: lead.company_name ?? "",
        email: lead.email ?? "",
        phone: lead.phone ?? "",
        projectType: lead.project_type ?? "",
        projectName:
          lead.company_name && lead.project_type
            ? `${lead.company_name} - ${lead.project_type}`
            : "",
        firstName: lead.first_name ?? "",
        lastName: lead.last_name ?? "",
      });

      const convertedLead: Lead = {
        ...lead,
        status: result.data.lead.status,
      };

      setLead(convertedLead);
      setFormValues(mapLeadToFormValues(convertedLead));
      setConvertSuccess(result.data.message);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to convert lead to client.";

      setConvertError(message);
    } finally {
      setIsConverting(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!accessToken) {
      setSaveError("No active admin session found.");
      return;
    }

    if (!leadId) {
      setSaveError("Lead ID is missing.");
      return;
    }

    if (!formValues) {
      setSaveError("Lead form is not ready.");
      return;
    }

    try {
      setIsSaving(true);
      setSaveError("");

      const updatedLead = await modifyLead(accessToken, leadId, {
        companyName: formValues.companyName,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        phone: formValues.phone,
        projectType: formValues.projectType,
        message: formValues.message,
        status: formValues.status,
      });

      setLead(updatedLead);
      setFormValues(mapLeadToFormValues(updatedLead));
      setIsEditing(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update lead.";

      setSaveError(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--color-background-dark)] px-6 py-10 text-[var(--color-foreground)] md:px-10">
      <section className="mx-auto max-w-7xl space-y-8">
        <div className="hero-grain relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 px-6 py-8 md:px-8 md:py-10">
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[var(--color-primary)]">
                Admin Portal
              </p>

              <h1
                className="text-5xl uppercase md:text-7xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Lead Profile
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)] md:text-base">
                Review the full lead submission before moving the business into
                the next stage of your onboarding workflow.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/admin/leads"
                className="inline-flex items-center rounded-[2px] border border-white/10 px-4 py-3 text-[12px] uppercase tracking-[0.18em] text-[var(--color-foreground)] transition duration-200 hover:bg-white/5"
              >
                Back to Leads
              </Link>

              {!isLoading && !error && lead && !isEditing ? (
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="inline-flex items-center rounded-[2px] border border-[var(--color-primary)] px-4 py-3 text-[12px] uppercase tracking-[0.18em] text-[var(--color-primary)] transition duration-200 hover:bg-[rgba(200,184,154,0.08)]"
                >
                  Edit
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Loading lead details...
            </p>
          </div>
        ) : null}

        {!isLoading && error ? (
          <div className="rounded-3xl border border-[var(--color-error-border)] bg-[rgba(252,165,165,0.08)] px-6 py-8">
            <h2
              className="text-3xl uppercase"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Unable to Load Lead
            </h2>

            <p className="mt-3 text-sm leading-7 text-[var(--color-error)]">
              {error}
            </p>

            <div className="mt-6">
              <Link
                to="/admin/leads"
                className="inline-flex items-center rounded-[2px] border border-white/10 px-4 py-3 text-[12px] uppercase tracking-[0.18em] text-[var(--color-foreground)] transition duration-200 hover:bg-white/5"
              >
                Return to Leads
              </Link>
            </div>
          </div>
        ) : null}

        {!isLoading && !error && convertSuccess ? (
          <div className="rounded-3xl border border-[rgba(134,239,172,0.35)] bg-[rgba(134,239,172,0.08)] px-6 py-4">
            <p className="text-sm leading-7 text-[var(--color-success)]">
              {convertSuccess}
            </p>
          </div>
        ) : null}

        {!isLoading && !error && lead && !isEditing ? (
          <LeadDetailsCard
            lead={lead}
            onConvertToClient={handleConvertToClient}
            isConverting={isConverting}
            convertError={convertError}
          />
        ) : null}

        {!isLoading && !error && lead && isEditing && formValues ? (
          <LeadEditForm
            values={formValues}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            onCancel={handleCancelEdit}
            isSaving={isSaving}
            error={saveError}
            leadId={lead.id}
            createdAtLabel={formatDate(lead.created_at)}
          />
        ) : null}
      </section>
    </main>
  );
}
