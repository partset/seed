import { supabase } from "../../../../lib/supabase";
import { checkClient } from "./checkClient";
import type { ClientLoginFormValues } from "../../../../types/clientAuth";

export type LoginClientResult = {
  userId: string;
  accessToken: string;
  isClient: boolean;
};

export async function loginClient(
  values: ClientLoginFormValues,
): Promise<LoginClientResult> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: values.email.trim(),
    password: values.password,
  });

  if (error || !data.user || !data.session) {
    throw new Error(error?.message || "Unable to sign in.");
  }

  try {
    const clientCheck = await checkClient();

    if (!clientCheck.data.isClient) {
      throw new Error("You do not have access to the client portal.");
    }

    return {
      userId: data.user.id,
      accessToken: data.session.access_token,
      isClient: true,
    };
  } catch (error) {
    await supabase.auth.signOut();

    throw error instanceof Error
      ? error
      : new Error("Failed to verify client.");
  }
}
