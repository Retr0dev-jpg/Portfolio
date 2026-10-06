/** Shared by the form inputs (maxLength) and the server-side schema. */
export const CONTACT_LIMITS = {
  name: 100,
  email: 320,
  subject: 200,
  message: 5000,
} as const;
