import { useEffect, useState } from "react";
import { useClientAuth } from "./useClientAuth";
import { getProjectPaymentDetails } from "../services/api/project/getProjectPaymentDetails/api";
import type { ProjectPaymentDetails } from "../types/projectPaymentDetails";

export function useProjectPaymentDetails(projectId: string | undefined) {
  const { session } = useClientAuth();

  const accessToken = session?.access_token;

  const [paymentDetails, setPaymentDetails] =
    useState<ProjectPaymentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPaymentDetails() {
      if (!accessToken) {
        setError("No active client session found.");
        setPaymentDetails(null);
        setIsLoading(false);
        return;
      }

      if (!projectId) {
        setError("No project ID provided in URL.");
        setPaymentDetails(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const data = await getProjectPaymentDetails(accessToken, projectId);
        setPaymentDetails(data);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load payment details.";

        setError(message);
        setPaymentDetails(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadPaymentDetails();
  }, [accessToken, projectId]);

  return {
    paymentDetails,
    isLoading,
    error,
  };
}
