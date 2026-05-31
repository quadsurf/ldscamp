import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AdultLeaderRegistrationForm } from './AdultLeaderRegistrationForm';
import React from 'react';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock the ImageKit uploader
vi.mock('../ui/ImageKitUploader', () => ({
  ImageKitUploader: ({ onSuccess }: any) => (
    <button data-testid="mock-ik-upload" type="button" onClick={() => onSuccess('https://example.com/avatar.jpg')}>
      Upload Image
    </button>
  ),
}));

describe('AdultLeaderRegistrationForm', () => {
  it('renders all form fields correctly', () => {
    render(<AdultLeaderRegistrationForm stakeSlug="test-stake" roles={['adult_team_captain']} />);
    expect(screen.getByLabelText(/First Name/i)).toBeTruthy();
    expect(screen.getByLabelText(/Last Name/i)).toBeTruthy();
    expect(screen.getByLabelText(/Email/i)).toBeTruthy();
    expect(screen.getByLabelText(/Phone/i)).toBeTruthy();
  });
});
