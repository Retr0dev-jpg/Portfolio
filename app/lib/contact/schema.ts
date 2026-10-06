import { z } from 'zod';
import { CONTACT_LIMITS } from './limits';

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(CONTACT_LIMITS.name),
  email: z.email().max(CONTACT_LIMITS.email),
  subject: z
    .string()
    .trim()
    .min(1)
    .max(CONTACT_LIMITS.subject)
    // Prevents header injection through the email subject.
    .transform((value) => value.replace(/[\r\n]/g, '')),
  message: z.string().trim().min(1).max(CONTACT_LIMITS.message),
  turnstileToken: z.string().min(1),
});

export type ContactPayload = z.infer<typeof contactSchema>;
