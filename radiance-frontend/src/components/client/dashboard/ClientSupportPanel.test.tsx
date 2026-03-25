import { render, screen } from "@testing-library/react";
import ClientSupportPanel from "./ClientSupportPanel";
import type { ClientSupportSummary } from "../../../types/clientPortal";

describe("ClientSupportPanel", () => {
  const mockSupport: ClientSupportSummary = {
    contactName: "Radiance Project Team",
    contactEmail: "support@radiance.com",
    contactPhone: "(214) 555-1234",
    officeHours: "Mon - Fri, 9 AM - 5 PM",
  };

  it("renders support content and contact details", () => {
    render(<ClientSupportPanel support={mockSupport} />);

    expect(screen.getByText(/need help\?/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /support/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /contact your project team if you have questions about files, billing, or next steps/i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByText(/^team$/i)).toBeInTheDocument();
    expect(screen.getByText(/radiance project team/i)).toBeInTheDocument();

    expect(screen.getByText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/support@radiance.com/i)).toBeInTheDocument();

    expect(screen.getByText(/phone/i)).toBeInTheDocument();
    expect(screen.getByText(/\(214\) 555-1234/i)).toBeInTheDocument();

    expect(screen.getByText(/office hours/i)).toBeInTheDocument();
    expect(screen.getByText(/mon - fri, 9 am - 5 pm/i)).toBeInTheDocument();
  });
});
