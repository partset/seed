import { render, screen } from "@testing-library/react";
import ClientOverviewCard from "./ClientOverviewCard";

describe("ClientOverviewCard", () => {
  it("renders eyebrow, title, and description", () => {
    render(
      <ClientOverviewCard
        eyebrow="Website Status"
        title="In Progress"
        description="This is the current overall state of your project."
      />,
    );

    expect(screen.getByText(/website status/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /in progress/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/this is the current overall state of your project/i),
    ).toBeInTheDocument();
  });
});
