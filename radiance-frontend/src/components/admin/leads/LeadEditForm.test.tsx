import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import LeadEditForm, { type LeadEditFormValues } from "./LeadEditForm";

const mockValues: LeadEditFormValues = {
  companyName: "Acme Co",
  firstName: "Alex",
  lastName: "Pham",
  email: "alex@test.com",
  phone: "1234567890",
  projectType: "Business Website",
  message: "Need a website",
  status: "New",
};

function renderLeadEditForm(overrides = {}) {
  const onChange = vi.fn();
  const onSubmit = vi.fn((event) => event.preventDefault());
  const onCancel = vi.fn();

  render(
    <LeadEditForm
      values={mockValues}
      onChange={onChange}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSaving={false}
      error=""
      leadId="lead-123"
      createdAtLabel="March 22, 2026"
      {...overrides}
    />,
  );

  return { onChange, onSubmit, onCancel };
}

describe("LeadEditForm", () => {
  it("renders all lead form values", () => {
    renderLeadEditForm();

    expect(screen.getByDisplayValue("Acme Co")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Alex")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Pham")).toBeInTheDocument();
    expect(screen.getByDisplayValue("alex@test.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1234567890")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Business Website")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Need a website")).toBeInTheDocument();
    expect(screen.getByDisplayValue("New")).toBeInTheDocument();
    expect(screen.getByText("lead-123")).toBeInTheDocument();
    expect(screen.getByText("March 22, 2026")).toBeInTheDocument();
  });

  it("calls onChange when an input value changes", () => {
    const { onChange } = renderLeadEditForm();

    fireEvent.change(screen.getByDisplayValue("Acme Co"), {
      target: { value: "Updated Co" },
    });

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("calls onSubmit when save changes is clicked", () => {
    const { onSubmit } = renderLeadEditForm();

    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when cancel is clicked", () => {
    const { onCancel } = renderLeadEditForm();

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("renders error message when error exists", () => {
    renderLeadEditForm({ error: "Failed to update lead." });

    expect(screen.getByText("Failed to update lead.")).toBeInTheDocument();
  });

  it("disables buttons and shows saving state", () => {
    renderLeadEditForm({ isSaving: true });

    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();
  });
});
