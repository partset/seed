import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import AddMilestoneForm from "./AddMilestoneForm";

describe("AddMilestoneForm", () => {
  it("shows the next display order in the button label", () => {
    render(<AddMilestoneForm nextDisplayOrder={3} onSubmit={vi.fn()} />);

    expect(screen.getByRole("button", { name: /add #3/i })).toBeInTheDocument();
  });

  it("submits trimmed label with selected status", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<AddMilestoneForm nextDisplayOrder={2} onSubmit={onSubmit} />);

    await user.type(
      screen.getByPlaceholderText(/enter milestone name/i),
      "  API complete  ",
    );
    await user.selectOptions(screen.getByRole("combobox"), "current");
    await user.click(screen.getByRole("button", { name: /add #2/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      label: "API complete",
      status: "current",
    });
  });

  it("does not submit blank labels", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<AddMilestoneForm nextDisplayOrder={1} onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: /add #1/i }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("resets form after submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<AddMilestoneForm nextDisplayOrder={1} onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText(/enter milestone name/i);
    const select = screen.getByRole("combobox");

    await user.type(input, "Deployment");
    await user.selectOptions(select, "complete");
    await user.click(screen.getByRole("button", { name: /add #1/i }));

    expect(input).toHaveValue("");
    expect(select).toHaveValue("upcoming");
  });
});
