jest.mock("../../../services/dbClient", () => ({
  connect: jest.fn(),
}));

jest.mock("../../../services/supabaseClient", () => ({
  supabaseAdmin: {
    auth: {
      admin: {
        createUser: jest.fn(),
      },
    },
  },
}));

jest.mock("../../../db/lead/convertLeadToClient.sql", () => ({
  insertCompany: "INSERT_COMPANY_SQL",
  insertProject: "INSERT_PROJECT_SQL",
  insertClientUser: "INSERT_CLIENT_USER_SQL",
  updateLeadStatusToConverted: "UPDATE_LEAD_STATUS_SQL",
}));

const db = require("../../../services/dbClient");
const { supabaseAdmin } = require("../../../services/supabaseClient");
const {
  convertLeadToClientService,
} = require("../../../services/lead/convertLeadToClientService");
const convertLeadToClientQuery = require("../../../db/lead/convertLeadToClient.sql");

describe("convertLeadToClientService", () => {
  let mockClient;

  beforeEach(() => {
    mockClient = {
      query: jest.fn(),
      release: jest.fn(),
    };

    db.connect.mockResolvedValue(mockClient);
    jest.clearAllMocks();
  });

  it("converts a lead to a client successfully with normalized values", async () => {
    mockClient.query
      .mockResolvedValueOnce() // BEGIN
      .mockResolvedValueOnce({
        rows: [
          {
            id: "company-1",
            name: "Acme Co",
            primary_email: "client@test.com",
            primary_phone: "1234567890",
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: "project-1",
            company_id: "company-1",
            name: "Acme Co - business website",
            status: "began",
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: "client-user-1",
            auth_user_id: "auth-user-1",
            company_id: "company-1",
            email: "client@test.com",
            first_name: "Alex",
            last_name: "Pham",
            is_active: true,
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: "lead-123",
            status: "Converted to Client",
          },
        ],
      })
      .mockResolvedValueOnce(); // COMMIT

    supabaseAdmin.auth.admin.createUser.mockResolvedValue({
      data: {
        user: {
          id: "auth-user-1",
        },
      },
      error: null,
    });

    const result = await convertLeadToClientService({
      leadId: "lead-123",
      companyName: "  Acme Co  ",
      email: "  CLIENT@TEST.COM ",
      phone: " 1234567890 ",
      projectType: " Business Website ",
      projectName: "",
      firstName: "  Alex ",
      lastName: " Pham ",
    });

    expect(db.connect).toHaveBeenCalledTimes(1);

    expect(mockClient.query).toHaveBeenNthCalledWith(1, "BEGIN");

    expect(mockClient.query).toHaveBeenNthCalledWith(
      2,
      convertLeadToClientQuery.insertCompany,
      ["Acme Co", "client@test.com", "1234567890"],
    );

    expect(mockClient.query).toHaveBeenNthCalledWith(
      3,
      convertLeadToClientQuery.insertProject,
      ["company-1", "Acme Co - business website"],
    );

    expect(supabaseAdmin.auth.admin.createUser).toHaveBeenCalledTimes(1);
    expect(supabaseAdmin.auth.admin.createUser).toHaveBeenCalledWith({
      email: "client@test.com",
      email_confirm: true,
      user_metadata: {
        first_name: "Alex",
        last_name: "Pham",
      },
    });

    expect(mockClient.query).toHaveBeenNthCalledWith(
      4,
      convertLeadToClientQuery.insertClientUser,
      ["auth-user-1", "company-1", "client@test.com", "Alex", "Pham"],
    );

    expect(mockClient.query).toHaveBeenNthCalledWith(
      5,
      convertLeadToClientQuery.updateLeadStatusToConverted,
      ["lead-123"],
    );

    expect(mockClient.query).toHaveBeenNthCalledWith(6, "COMMIT");
    expect(mockClient.release).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      message:
        "Lead converted to client successfully. The client can now use first-time setup with an email code.",
      company: {
        id: "company-1",
        name: "Acme Co",
        primary_email: "client@test.com",
        primary_phone: "1234567890",
      },
      project: {
        id: "project-1",
        company_id: "company-1",
        name: "Acme Co - business website",
        status: "began",
      },
      clientUser: {
        id: "client-user-1",
        auth_user_id: "auth-user-1",
        company_id: "company-1",
        email: "client@test.com",
        first_name: "Alex",
        last_name: "Pham",
        is_active: true,
      },
      lead: {
        id: "lead-123",
        status: "Converted to Client",
      },
    });
  });

  it("uses the provided projectName when one is supplied", async () => {
    mockClient.query
      .mockResolvedValueOnce() // BEGIN
      .mockResolvedValueOnce({
        rows: [
          {
            id: "company-1",
            name: "Acme Co",
            primary_email: "client@test.com",
            primary_phone: null,
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: "project-1",
            company_id: "company-1",
            name: "Custom Project Name",
            status: "began",
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: "client-user-1",
            auth_user_id: "auth-user-1",
            company_id: "company-1",
            email: "client@test.com",
            first_name: null,
            last_name: null,
            is_active: true,
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: "lead-123",
            status: "Converted to Client",
          },
        ],
      })
      .mockResolvedValueOnce(); // COMMIT

    supabaseAdmin.auth.admin.createUser.mockResolvedValue({
      data: {
        user: {
          id: "auth-user-1",
        },
      },
      error: null,
    });

    await convertLeadToClientService({
      leadId: "lead-123",
      companyName: "Acme Co",
      email: "client@test.com",
      phone: "",
      projectType: "Business Website",
      projectName: "  Custom Project Name  ",
      firstName: "",
      lastName: "",
    });

    expect(mockClient.query).toHaveBeenNthCalledWith(
      3,
      convertLeadToClientQuery.insertProject,
      ["company-1", "Custom Project Name"],
    );
  });

  it("rolls back and throws when createUser fails", async () => {
    mockClient.query
      .mockResolvedValueOnce() // BEGIN
      .mockResolvedValueOnce({
        rows: [
          {
            id: "company-1",
            name: "Acme Co",
            primary_email: "client@test.com",
            primary_phone: "1234567890",
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: "project-1",
            company_id: "company-1",
            name: "Acme Co - business website",
            status: "began",
          },
        ],
      })
      .mockResolvedValueOnce(); // ROLLBACK

    supabaseAdmin.auth.admin.createUser.mockResolvedValue({
      data: null,
      error: {
        message: "User already exists",
      },
    });

    await expect(
      convertLeadToClientService({
        leadId: "lead-123",
        companyName: "Acme Co",
        email: "client@test.com",
        phone: "1234567890",
        projectType: "Business Website",
        projectName: "",
        firstName: "Alex",
        lastName: "Pham",
      }),
    ).rejects.toMatchObject({
      message: "User already exists",
      statusCode: 400,
    });

    expect(mockClient.query).toHaveBeenLastCalledWith("ROLLBACK");
    expect(mockClient.release).toHaveBeenCalledTimes(1);
  });

  it("rolls back and throws when auth user id is missing", async () => {
    mockClient.query
      .mockResolvedValueOnce() // BEGIN
      .mockResolvedValueOnce({
        rows: [
          {
            id: "company-1",
            name: "Acme Co",
            primary_email: "client@test.com",
            primary_phone: "1234567890",
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: "project-1",
            company_id: "company-1",
            name: "Acme Co - business website",
            status: "began",
          },
        ],
      })
      .mockResolvedValueOnce(); // ROLLBACK

    supabaseAdmin.auth.admin.createUser.mockResolvedValue({
      data: {
        user: null,
      },
      error: null,
    });

    await expect(
      convertLeadToClientService({
        leadId: "lead-123",
        companyName: "Acme Co",
        email: "client@test.com",
        phone: "1234567890",
        projectType: "Business Website",
        projectName: "",
        firstName: "Alex",
        lastName: "Pham",
      }),
    ).rejects.toMatchObject({
      message: "Auth user was created without an id.",
      statusCode: 500,
    });

    expect(mockClient.query).toHaveBeenLastCalledWith("ROLLBACK");
    expect(mockClient.release).toHaveBeenCalledTimes(1);
  });

  it("rolls back and throws when inserting client_users fails", async () => {
    mockClient.query
      .mockResolvedValueOnce() // BEGIN
      .mockResolvedValueOnce({
        rows: [
          {
            id: "company-1",
            name: "Acme Co",
            primary_email: "client@test.com",
            primary_phone: "1234567890",
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: "project-1",
            company_id: "company-1",
            name: "Acme Co - business website",
            status: "began",
          },
        ],
      })
      .mockRejectedValueOnce(new Error("Insert client user failed"))
      .mockResolvedValueOnce(); // ROLLBACK

    supabaseAdmin.auth.admin.createUser.mockResolvedValue({
      data: {
        user: {
          id: "auth-user-1",
        },
      },
      error: null,
    });

    await expect(
      convertLeadToClientService({
        leadId: "lead-123",
        companyName: "Acme Co",
        email: "client@test.com",
        phone: "1234567890",
        projectType: "Business Website",
        projectName: "",
        firstName: "Alex",
        lastName: "Pham",
      }),
    ).rejects.toThrow("Insert client user failed");

    expect(mockClient.query).toHaveBeenLastCalledWith("ROLLBACK");
    expect(mockClient.release).toHaveBeenCalledTimes(1);
  });
});
