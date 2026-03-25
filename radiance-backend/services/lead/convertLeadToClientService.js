const db = require("../dbClient");
const { supabaseAdmin } = require("../supabaseClient");
const convertLeadToClientQuery = require("../../db/lead/convertLeadToClient.sql");

async function convertLeadToClientService({
  leadId,
  companyName,
  email,
  phone,
  projectType,
  projectName,
  firstName,
  lastName,
}) {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const normalizedCompanyName = companyName.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone?.trim() || null;
    const normalizedProjectType = projectType.trim().toLowerCase();
    const normalizedFirstName = firstName?.trim() || null;
    const normalizedLastName = lastName?.trim() || null;

    const resolvedProjectName =
      projectName?.trim() ||
      `${normalizedCompanyName} - ${normalizedProjectType}`;

    const companyResult = await client.query(
      convertLeadToClientQuery.insertCompany,
      [normalizedCompanyName, normalizedEmail, normalizedPhone],
    );

    const company = companyResult.rows[0];

    const projectResult = await client.query(
      convertLeadToClientQuery.insertProject,
      [company.id, resolvedProjectName],
    );

    const project = projectResult.rows[0];

    const { data: createdUserData, error: createUserError } =
      await supabaseAdmin.auth.admin.createUser({
        email: normalizedEmail,
        email_confirm: true,
        user_metadata: {
          first_name: normalizedFirstName,
          last_name: normalizedLastName,
        },
      });

    if (createUserError) {
      const error = new Error(
        createUserError.message || "Failed to create client auth user.",
      );
      error.statusCode = 400;
      throw error;
    }

    const authUserId = createdUserData?.user?.id;

    if (!authUserId) {
      const error = new Error("Auth user was created without an id.");
      error.statusCode = 500;
      throw error;
    }

    const clientUserResult = await client.query(
      convertLeadToClientQuery.insertClientUser,
      [
        authUserId,
        company.id,
        normalizedEmail,
        normalizedFirstName,
        normalizedLastName,
      ],
    );

    const clientUser = clientUserResult.rows[0];

    const updatedLeadResult = await client.query(
      convertLeadToClientQuery.updateLeadStatusToConverted,
      [leadId],
    );

    const updatedLead = updatedLeadResult.rows[0];

    await client.query("COMMIT");

    return {
      message:
        "Lead converted to client successfully. The client can now use first-time setup with an email code.",
      company,
      project,
      clientUser,
      lead: updatedLead,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { convertLeadToClientService };
