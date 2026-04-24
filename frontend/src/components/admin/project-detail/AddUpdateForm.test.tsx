import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import AddUpdateForm from "./AddUpdateForm";

describe("AddUpdateForm", () => {
  it("submits trimmed values and default visibility", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<AddUpdateForm onSubmit={onSubmit} />);

    await user.type(
      screen.getByPlaceholderText(/enter update title/i),
      "  New feature  ",
    );
    await user.type(
      screen.getByPlaceholderText(/describe what changed/i),
      "  Added dashboard cards  ",
    );
    await user.click(screen.getByRole("button", { name: /save update/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: "New feature",
      description: "Added dashboard cards",
      isVisibleToClient: true,
    });
  });

  it("allows toggling client visibility before submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<AddUpdateForm onSubmit={onSubmit} />);

    await user.type(
      screen.getByPlaceholderText(/enter update title/i),
      "Internal update",
    );
    await user.type(
      screen.getByPlaceholderText(/describe what changed/i),
      "Private note",
    );
    await user.click(
      screen.getByRole("checkbox", { name: /visible to client/i }),
    );
    await user.click(screen.getByRole("button", { name: /save update/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: "Internal update",
      description: "Private note",
      isVisibleToClient: false,
    });
  });

  it("does not submit when title is blank", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<AddUpdateForm onSubmit={onSubmit} />);

    await user.type(
      screen.getByPlaceholderText(/describe what changed/i),
      "Something happened",
    );
    await user.click(screen.getByRole("button", { name: /save update/i }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("does not submit when description is blank", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<AddUpdateForm onSubmit={onSubmit} />);

    await user.type(
      screen.getByPlaceholderText(/enter update title/i),
      "Status update",
    );
    await user.click(screen.getByRole("button", { name: /save update/i }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("resets fields after successful submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<AddUpdateForm onSubmit={onSubmit} />);

    const titleInput = screen.getByPlaceholderText(/enter update title/i);
    const descriptionInput = screen.getByPlaceholderText(
      /describe what changed/i,
    );
    const checkbox = screen.getByRole("checkbox", {
      name: /visible to client/i,
    });

    await user.type(titleInput, "Launch prep");
    await user.type(descriptionInput, "QA complete");
    await user.click(checkbox);
    await user.click(screen.getByRole("button", { name: /save update/i }));

    expect(titleInput).toHaveValue("");
    expect(descriptionInput).toHaveValue("");
    expect(checkbox).toBeChecked();
  });
});
