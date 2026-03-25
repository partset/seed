import type {
  ClientBillingSummary,
  ClientProjectDocument,
  ClientProjectMilestone,
  ClientProjectSummary,
  ClientProjectUpdate,
  ClientSupportSummary,
} from "../types/clientPortal";

export const clientProjectSummary: ClientProjectSummary = {
  projectName: "Radiance Marketing Website",
  companyName: "Radiance Marketing",
  websiteStatus: "In Progress",
  currentPhase: "Development",
  nextStep: "Review homepage content draft",
  balanceDue: "$1,200",
  invoiceDueDate: "April 12, 2026",
};

export const clientProjectUpdates: ClientProjectUpdate[] = [
  {
    id: "update-1",
    title: "Homepage wireframe approved",
    description:
      "Your homepage layout has been approved and moved into active development. The team has finalized the overall direction and is preparing the approved sections for implementation.",
    dateLabel: "March 20, 2026",
    createdAt: "2026-03-20T10:00:00.000Z",
  },
  {
    id: "update-2",
    title: "Development is underway",
    description:
      "Core page sections are currently being built and styled based on the approved direction. We are focusing on layout structure, typography hierarchy, and responsive behavior first.",
    dateLabel: "March 22, 2026",
    createdAt: "2026-03-22T14:30:00.000Z",
  },
  {
    id: "update-3",
    title: "Content review coming next",
    description:
      "Your next action will be reviewing the homepage and service section copy. Once that content is approved, we can continue building the remaining pages with fewer revisions later.",
    dateLabel: "March 23, 2026",
    createdAt: "2026-03-23T09:15:00.000Z",
  },
  {
    id: "update-4",
    title: "Navigation structure finalized",
    description:
      "The main navigation structure has now been finalized. This includes the primary page hierarchy, menu labels, and the general page flow users will follow throughout the site.",
    dateLabel: "March 24, 2026",
    createdAt: "2026-03-24T08:45:00.000Z",
  },
  {
    id: "update-5",
    title: "Mobile layout review completed",
    description:
      "We completed an internal mobile layout review and identified a few small spacing improvements that will be applied before the next client review round",
    dateLabel: "March 24, 2026",
    createdAt: "2026-03-24T15:10:00.000Z",
  },
];

export const clientProjectDocuments: ClientProjectDocument[] = [
  {
    id: "doc-1",
    title: "Project Proposal",
    fileType: "PDF",
    uploadedAtLabel: "March 3, 2026",
    uploadedAt: "2026-03-03T10:00:00.000Z",
    category: "Planning",
    fileSizeLabel: "248 KB",
    description: "Original proposal outlining scope, goals, and pricing.",
    embedUrl:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "doc-2",
    title: "Signed Contract",
    fileType: "PDF",
    uploadedAtLabel: "March 5, 2026",
    uploadedAt: "2026-03-05T12:30:00.000Z",
    category: "Legal",
    fileSizeLabel: "312 KB",
    description: "Executed agreement for the website project.",
    embedUrl:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "doc-3",
    title: "Content Checklist",
    fileType: "PDF",
    uploadedAtLabel: "March 8, 2026",
    uploadedAt: "2026-03-08T09:15:00.000Z",
    category: "Content",
    fileSizeLabel: "194 KB",
    description: "Checklist of content items needed before launch.",
    embedUrl:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "doc-4",
    title: "Invoice #1004",
    fileType: "PDF",
    uploadedAtLabel: "March 21, 2026",
    uploadedAt: "2026-03-21T14:20:00.000Z",
    category: "Billing",
    fileSizeLabel: "126 KB",
    description: "Current invoice for the active development phase.",
    embedUrl:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "doc-5",
    title: "Homepage Design Preview",
    fileType: "PDF",
    uploadedAtLabel: "March 22, 2026",
    uploadedAt: "2026-03-22T11:00:00.000Z",
    category: "Design",
    fileSizeLabel: "542 KB",
    description: "Preview export of the approved homepage design direction.",
    embedUrl:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "doc-6",
    title: "Development Progress Summary",
    fileType: "PDF",
    uploadedAtLabel: "March 24, 2026",
    uploadedAt: "2026-03-24T08:45:00.000Z",
    category: "Updates",
    fileSizeLabel: "287 KB",
    description:
      "Recent summary of completed work and next implementation steps.",
    embedUrl:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
];

export const clientProjectMilestones: ClientProjectMilestone[] = [
  {
    id: "milestone-1",
    label: "Discovery",
    status: "complete",
  },
  {
    id: "milestone-2",
    label: "Content Collection",
    status: "complete",
  },
  {
    id: "milestone-3",
    label: "Design",
    status: "complete",
  },
  {
    id: "milestone-4",
    label: "Development",
    status: "current",
  },
  {
    id: "milestone-5",
    label: "Revisions",
    status: "upcoming",
  },
  {
    id: "milestone-6",
    label: "Launch",
    status: "upcoming",
  },
];

export const clientBillingSummary: ClientBillingSummary = {
  invoiceLabel: "Invoice #1004",
  amountDue: "$1,200",
  dueDate: "April 12, 2026",
  status: "Unpaid",
};

export const clientSupportSummary: ClientSupportSummary = {
  contactName: "Radiance Project Team",
  contactEmail: "support@radiance.com",
  contactPhone: "(555) 123-4567",
  officeHours: "Mon - Fri, 9:00 AM - 5:00 PM",
};
