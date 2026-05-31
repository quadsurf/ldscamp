import { describe, it, expect } from 'vitest';
import { adultLeaderRegistrationSchema } from './adultLeaderRegistration';

describe('adultLeaderRegistrationSchema', () => {
  it('should validate a correct payload', () => {
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      profilePicUrl: 'https://example.com/avatar.jpg',
    };
    const result = adultLeaderRegistrationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail if email is invalid', () => {
    const invalidData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'not-an-email',
      phone: '123-456-7890',
      profilePicUrl: 'https://example.com/avatar.jpg',
    };
    const result = adultLeaderRegistrationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should fail if names are too short', () => {
    const invalidData = {
      firstName: 'J',
      lastName: 'D',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      profilePicUrl: 'https://example.com/avatar.jpg',
    };
    const result = adultLeaderRegistrationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should require profilePicUrl', () => {
    const invalidData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      profilePicUrl: '', // empty
    };
    const result = adultLeaderRegistrationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.message === 'Profile picture is required')).toBe(true);
    }
  });
});
