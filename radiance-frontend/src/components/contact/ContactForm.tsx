import { useState } from "react";
import ContactField from "./ContactField";
import ContactTextarea from "./ContactTextarea";
import type { ContactFormData } from "../../types/contact";
import { PROJECT_TYPE_OPTIONS } from "../../constants/contact";

const initialFormData: ContactFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  projectType: "",
  message: "",
  consent: false,
};

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
  {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
  {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>
  {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitted(false);
    setIsSubmitting(true);

    try
    {
      console.log("Contact form submitted:", formData);

      await new Promise((resolve) => setTimeout(resolve, 800));

      setIsSubmitted(true);
      setFormData(initialFormData);
    }
    catch
    {
      setSubmitError("Something went wrong. Please try again.");
    }
    finally
    {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur md:p-8">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <ContactField
            id="firstName"
            name="firstName"
            label="First name"
            value={formData.firstName}
            placeholder="John"
            required={true}
            onChange={handleInputChange}
          />

          <ContactField
            id="lastName"
            name="lastName"
            label="Last name"
            value={formData.lastName}
            placeholder="Kim"
            required={true}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ContactField
            id="email"
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            placeholder="you@example.com"
            required={true}
            onChange={handleInputChange}
          />

          <ContactField
            id="phone"
            name="phone"
            label="Phone"
            type="tel"
            value={formData.phone}
            placeholder="+1 (555) 123-4567"
            onChange={handleInputChange}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ContactField
            id="company"
            name="company"
            label="Company"
            value={formData.company}
            placeholder="Your business name"
            onChange={handleInputChange}
          />

          <div className="flex flex-col gap-2">
            <label
              htmlFor="projectType"
              className="text-sm font-medium text-foreground"
            >
              Project type
            </label>

            <select
              id="projectType"
              name="projectType"
              value={formData.projectType}
              onChange={handleSelectChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-white/10"
            >
              <option value="">Select a project type</option>
              {PROJECT_TYPE_OPTIONS.map((option) => (
                <option key={option} value={option} className="bg-background-dark">
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ContactTextarea
          id="message"
          name="message"
          label="Message"
          value={formData.message}
          placeholder="Tell us about your goals, timeline, and what kind of website you need."
          required={true}
          rows={7}
          onChange={handleTextareaChange}
        />

        <label className="flex items-start gap-3 text-sm text-foreground/80">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            checked={formData.consent}
            onChange={handleInputChange}
            className="mt-1 h-4 w-4 rounded border border-white/20 bg-white/5"
          />
          <span>
            I agree to the collection of my information for the purpose of responding
            to this inquiry.
          </span>
        </label>

        <div className="flex flex-col gap-3">
            <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-primary/20 bg-primary px-6 py-3 text-sm font-semibold text-background-dark transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
                {isSubmitting ? "Submitting..." : "Send Inquiry"}
            </button>

          {isSubmitted && (
            <p className="text-sm text-green-400">
              Your inquiry has been submitted. We will get back to you soon.
            </p>
          )}

          {submitError && (
            <p className="text-sm text-red-400">
              {submitError}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}