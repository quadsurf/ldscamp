import { z } from 'zod';

export const adultLeaderRegistrationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  profilePicUrl: z.string().min(1, 'Profile picture is required').url('Must be a valid URL'),
});

export type AdultLeaderRegistrationValues = z.infer<typeof adultLeaderRegistrationSchema>;
