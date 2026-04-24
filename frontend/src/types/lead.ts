export type LeadStatus =
  | "New"
  | "Reviewing"
  | "Contacted"
  | "Meeting Scheduled"
  | "Proposal Sent"
  | "Converted to Client"
  | "Closed / Not Moving Forward";

export interface Lead {
  id: string;
  company_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  project_type?: string | null;
  message?: string | null;
  status: LeadStatus;
  created_at: string;
}
