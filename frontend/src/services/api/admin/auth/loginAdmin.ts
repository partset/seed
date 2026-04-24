import { supabase } from "../../../../lib/supabase";
import { checkAdmin } from "./checkAdmin";
import type { AdminLoginFormValues } from "../../../../types/adminAuth";

export type LoginAdminResult = {
  userId: string;
  accessToken: string;
  isAdmin: boolean;
};

export async function loginAdmin(
  values: AdminLoginFormValues,
): Promise<LoginAdminResult> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: values.email.trim(),
    password: values.password,
  });

  if (error || !data.user || !data.session) {
    throw new Error(error?.message || "Unable to sign in.");
  }

  try {
    const adminCheck = await checkAdmin();

    if (!adminCheck.data.isAdmin) {
      throw new Error("You do not have access to the admin portal.");
    }

    return {
      userId: data.user.id,
      accessToken: data.session.access_token,
      isAdmin: true,
    };
  } catch (error) {
    await supabase.auth.signOut();

    throw error instanceof Error ? error : new Error("Failed to verify admin.");
  }
}
