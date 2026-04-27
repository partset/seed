export type ClientLoginFormValues = {
  email: string;
  password: string;
};

export type ClientSetupCodeRequestValues = {
  email: string;
};

export type ClientVerifySetupCodeValues = {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
};

export type ClientLoginErrors = {
  email?: string;
  password?: string;
  form?: string;
};
