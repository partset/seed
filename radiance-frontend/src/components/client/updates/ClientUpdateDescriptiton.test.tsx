import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ClientUpdateDescription from "./ClientUpdateDescription";

describe("ClientUpdateDescription", () => {
  it("renders full description and no toggle button when text is short", () => {
    render(
      <ClientUpdateDescription description="Short project update description." />,
    );

    expect(
      screen.getByText(/short project update description\./i),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /show more/i }),
    ).not.toBeInTheDocument();
  });

  it("renders truncated description and show more button when text is long", () => {
    const longDescription =
      "This is a very long project update description that should be truncated because it goes beyond the maximum allowed length for the collapsed view.";

    render(
      <ClientUpdateDescription description={longDescription} maxLength={50} />,
    );

    expect(
      screen.getByText(
        /^this is a very long project update description tha\.\.\.$/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /show more/i }),
    ).toBeInTheDocument();
  });

  it("expands and collapses the description", async () => {
    const user = userEvent.setup();
    const longDescription =
      "This is a very long project update description that should be truncated because it goes beyond the maximum allowed length for the collapsed view.";

    render(
      <ClientUpdateDescription description={longDescription} maxLength={50} />,
    );

    const toggleButton = screen.getByRole("button", { name: /show more/i });
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");

    await user.click(toggleButton);

    expect(screen.getByText(longDescription)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /show less/i })).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    await user.click(screen.getByRole("button", { name: /show less/i }));

    expect(
      screen.getByText(
        /^this is a very long project update description tha\.\.\.$/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /show more/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});
