export type AdminLoginFormValues = {
  email: string;
  password: string;
};

export type AdminLoginErrors = {
  email?: string;
  password?: string;
  form?: string;
};
