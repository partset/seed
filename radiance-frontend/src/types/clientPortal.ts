export interface ClientProjectSummary {
  projectName: string;
  companyName: string;
  websiteStatus: string;
  currentPhase: string;
  nextStep: string;
  balanceDue: string;
  invoiceDueDate: string;
}

export interface ClientProjectUpdate {
  id: string;
  title: string;
  description: string;
  dateLabel: string;
  createdAt: string;
}

export interface ClientProjectDocument {
  id: string;
  title: string;
  fileType: string;
  uploadedAtLabel: string;
  uploadedAt: string;
  category: string;
  fileSizeLabel: string;
  description: string;
  embedUrl: string;
}

export interface ClientProjectMilestone {
  id: string;
  label: string;
  status: "complete" | "current" | "upcoming";
}

export interface ClientBillingSummary {
  invoiceLabel: string;
  amountDue: string;
  dueDate: string;
  status: string;
}

export interface ClientSupportSummary {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  officeHours: string;
}
