import type {
  ClientBillingSummary,
  ClientProjectDocument,
  ClientProjectMilestone,
  ClientProjectSummary,
  ClientProjectUpdate,
  ClientSupportSummary,
} from "../types/clientPortal";

export type ClientProjectCard = {
  id: string;
  projectName: string;
  companyName: string;
  websiteStatus: string;
  currentPhase: string;
  nextStep: string;
  clientVisibleSummary: string;
};

export type ClientProjectDetail = {
  summary: ClientProjectSummary;
  updates: ClientProjectUpdate[];
  documents: ClientProjectDocument[];
  milestones: ClientProjectMilestone[];
  billing: ClientBillingSummary;
  support: ClientSupportSummary;
};

export const clientProjects: ClientProjectCard[] = [
  {
    id: "project-radiance-marketing-website",
    projectName: "Radiance Marketing Website",
    companyName: "Radiance Marketing",
    websiteStatus: "In Progress",
    currentPhase: "Development",
    nextStep: "Review homepage content draft",
    clientVisibleSummary:
      "Main marketing website project covering planning, design, development, and launch preparation.",
  },
  {
    id: "project-radiance-client-portal",
    projectName: "Radiance Client Portal",
    companyName: "Radiance Marketing",
    websiteStatus: "In Progress",
    currentPhase: "UI Review",
    nextStep: "Approve project selection flow",
    clientVisibleSummary:
      "Private portal where clients can review updates, documents, billing, and project progress.",
  },
  {
    id: "project-radiance-brand-refresh",
    projectName: "Radiance Brand Refresh",
    companyName: "Radiance Marketing",
    websiteStatus: "Planned",
    currentPhase: "Discovery",
    nextStep: "Confirm visual direction references",
    clientVisibleSummary:
      "Brand exploration project focused on typography, visual consistency, and design direction.",
  },
];

export const clientProjectDetailsById: Record<string, ClientProjectDetail> = {
  "project-radiance-marketing-website": {
    summary: {
      projectName: "Radiance Marketing Website",
      companyName: "Radiance Marketing",
      websiteStatus: "In Progress",
      currentPhase: "Development",
      nextStep: "Review homepage content draft",
      balanceDue: "$1,200",
      invoiceDueDate: "April 12, 2026",
    },
    updates: [
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
    ],
    documents: [
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
        description:
          "Preview export of the approved homepage design direction.",
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
    ],
    milestones: [
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
    ],
    billing: {
      invoiceLabel: "Invoice #1004",
      amountDue: "$1,200",
      dueDate: "April 12, 2026",
      status: "Unpaid",
    },
    support: {
      contactName: "Radiance Project Team",
      contactEmail: "support@radiance.com",
      contactPhone: "(555) 123-4567",
      officeHours: "Mon - Fri, 9:00 AM - 5:00 PM",
    },
  },

  "project-radiance-client-portal": {
    summary: {
      projectName: "Radiance Client Portal",
      companyName: "Radiance Marketing",
      websiteStatus: "In Progress",
      currentPhase: "UI Review",
      nextStep: "Approve project selection flow",
      balanceDue: "$850",
      invoiceDueDate: "April 18, 2026",
    },
    updates: [
      {
        id: "portal-update-1",
        title: "Portal login flow completed",
        description:
          "The client login and first-time setup flow are now working in the frontend and ready for integration with live API data.",
        dateLabel: "March 25, 2026",
        createdAt: "2026-03-25T11:00:00.000Z",
      },
      {
        id: "portal-update-2",
        title: "Project selection page planned",
        description:
          "The portal is being updated so clients first see all of their company projects before opening one specific project dashboard.",
        dateLabel: "March 28, 2026",
        createdAt: "2026-03-28T12:30:00.000Z",
      },
    ],
    documents: [
      {
        id: "portal-doc-1",
        title: "Portal UI Notes",
        fileType: "PDF",
        uploadedAtLabel: "March 27, 2026",
        uploadedAt: "2026-03-27T10:00:00.000Z",
        category: "Planning",
        fileSizeLabel: "214 KB",
        description: "Notes for client portal route structure and UI updates.",
        embedUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
    ],
    milestones: [
      {
        id: "portal-milestone-1",
        label: "Auth Setup",
        status: "complete",
      },
      {
        id: "portal-milestone-2",
        label: "Client Login",
        status: "complete",
      },
      {
        id: "portal-milestone-3",
        label: "Project Selection",
        status: "current",
      },
      {
        id: "portal-milestone-4",
        label: "Project Detail Routing",
        status: "current",
      },
      {
        id: "portal-milestone-5",
        label: "API Integration",
        status: "upcoming",
      },
    ],
    billing: {
      invoiceLabel: "Invoice #1007",
      amountDue: "$850",
      dueDate: "April 18, 2026",
      status: "Unpaid",
    },
    support: {
      contactName: "Radiance Project Team",
      contactEmail: "support@radiance.com",
      contactPhone: "(555) 123-4567",
      officeHours: "Mon - Fri, 9:00 AM - 5:00 PM",
    },
  },

  "project-radiance-brand-refresh": {
    summary: {
      projectName: "Radiance Brand Refresh",
      companyName: "Radiance Marketing",
      websiteStatus: "Planned",
      currentPhase: "Discovery",
      nextStep: "Confirm visual direction references",
      balanceDue: "$0",
      invoiceDueDate: "Not scheduled",
    },
    updates: [
      {
        id: "brand-update-1",
        title: "Discovery prep started",
        description:
          "We are organizing references and planning the first round of visual direction exploration.",
        dateLabel: "March 26, 2026",
        createdAt: "2026-03-26T09:00:00.000Z",
      },
    ],
    documents: [
      {
        id: "brand-doc-1",
        title: "Brand Reference Deck",
        fileType: "PDF",
        uploadedAtLabel: "March 26, 2026",
        uploadedAt: "2026-03-26T13:00:00.000Z",
        category: "Discovery",
        fileSizeLabel: "398 KB",
        description: "Early moodboard and visual reference deck.",
        embedUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
    ],
    milestones: [
      {
        id: "brand-milestone-1",
        label: "Kickoff",
        status: "upcoming",
      },
      {
        id: "brand-milestone-2",
        label: "Moodboard Review",
        status: "upcoming",
      },
      {
        id: "brand-milestone-3",
        label: "Visual System Draft",
        status: "upcoming",
      },
    ],
    billing: {
      invoiceLabel: "Invoice #1010",
      amountDue: "$0",
      dueDate: "Not scheduled",
      status: "Draft",
    },
    support: {
      contactName: "Radiance Project Team",
      contactEmail: "support@radiance.com",
      contactPhone: "(555) 123-4567",
      officeHours: "Mon - Fri, 9:00 AM - 5:00 PM",
    },
  },
};
