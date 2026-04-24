export type ContactFormData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    projectType: string;
    message: string;
    consent: boolean;
  };
  
  export type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;