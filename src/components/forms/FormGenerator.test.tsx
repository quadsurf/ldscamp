import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { FormGenerator } from './FormGenerator';
import { FormField } from '../../types/forms';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback: string) => fallback || key,
  }),
}));

describe('FormGenerator', () => {
  const mockOnSubmit = vi.fn();

  const mockFields: FormField[] = [
    {
      id: 'f1',
      type: 'text',
      name: 'firstName',
      label: 'First Name',
      placeholder: 'Enter first name',
      required: true,
    },
    {
      id: 'f2',
      type: 'radio_group',
      name: 'allergies',
      label: 'Do you have allergies?',
      options: ['None', 'Has Allergies'],
      required: true,
    },
    {
      id: 'f3',
      type: 'textarea',
      name: 'allergyDetails',
      label: 'Allergy Details',
      placeholder: 'List allergies here',
      required: true,
      conditional: {
        fieldName: 'allergies',
        operator: 'equals',
        value: 'Has Allergies',
      },
    },
    {
      id: 'f4',
      type: 'signature',
      name: 'guardianSignature',
      label: 'Digital Signature',
      required: true,
    },
  ];

  beforeAll(() => {
    // Mock HTML5 Canvas API in jsdom
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      clearRect: vi.fn(),
      drawImage: vi.fn(),
    });
    HTMLCanvasElement.prototype.toDataURL = vi.fn().mockReturnValue('data:image/png;base64,mocksignaturedata');
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders standard and conditional fields correctly', () => {
    render(<FormGenerator fields={mockFields} onSubmit={mockOnSubmit} />);

    // Renders First Name input
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    
    // Renders radio choices
    expect(screen.getByText('None')).toBeInTheDocument();
    expect(screen.getByText('Has Allergies')).toBeInTheDocument();

    // The conditional field 'Allergy Details' should NOT be rendered initially
    expect(screen.queryByLabelText(/Allergy Details/i)).not.toBeInTheDocument();

    // Signature pad is visible
    expect(screen.getByText(/Digital Signature/i)).toBeInTheDocument();
  });

  it('shows conditional field when dependency matches rule', async () => {
    render(<FormGenerator fields={mockFields} onSubmit={mockOnSubmit} />);

    // Click "Has Allergies"
    const radioOption = screen.getByText('Has Allergies');
    fireEvent.click(radioOption);

    // Allergy Details textarea should appear reactively
    await waitFor(() => {
      expect(screen.getByLabelText(/Allergy Details/i)).toBeInTheDocument();
    });
  });

  it('validates required fields and shows error messages', async () => {
    render(<FormGenerator fields={mockFields} onSubmit={mockOnSubmit} />);

    // Press Submit immediately
    const submitBtn = screen.getByRole('button', { name: /Submit Form/i });
    fireEvent.click(submitBtn);

    // Validate that required errors are displayed
    await waitFor(() => {
      expect(screen.getAllByText('This field is required').length).toBeGreaterThan(0);
      expect(screen.getByText('Signature is required and must be drawn')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('successfully submits the form with valid payload', async () => {
    render(<FormGenerator fields={mockFields} onSubmit={mockOnSubmit} />);

    // 1. Fill First Name
    const firstNameInput = screen.getByLabelText(/First Name/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });

    // 2. Select No Allergies (so conditional field is hidden and skipped from validation)
    const radioNone = screen.getByText('None');
    fireEvent.click(radioNone);

    // 3. Simulate Drawing on Canvas to populate signature state
    const canvas = screen.getByTestId('signature-canvas');
    fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10 });
    fireEvent.mouseMove(canvas, { clientX: 20, clientY: 20 });
    fireEvent.mouseUp(canvas);

    // 4. Submit
    const submitBtn = screen.getByRole('button', { name: /Submit Form/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'John',
          allergies: 'None',
          guardianSignature: 'data:image/png;base64,mocksignaturedata',
        })
      );
    });
  });
});
