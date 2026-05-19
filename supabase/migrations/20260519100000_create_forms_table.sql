-- Create forms table
CREATE TABLE IF NOT EXISTS public.forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT NOT NULL UNIQUE,
  fields JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on forms table
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;

-- Policies for public.forms
CREATE POLICY "Super admins can manage forms"
ON public.forms
TO authenticated
USING (public.is_super_admin());

CREATE POLICY "Anyone can view forms"
ON public.forms
FOR SELECT
TO authenticated, anon
USING (true);

-- Seed the 5 default camp forms
INSERT INTO public.forms (title, description, slug, fields)
VALUES
  (
    'Youth Registration',
    'Personal details and general information for youth camp attendees.',
    'youth-registration',
    '[
      {
        "id": "field_first_name",
        "type": "text",
        "name": "firstName",
        "label": "First Name",
        "placeholder": "Enter youth''s first name",
        "required": true
      },
      {
        "id": "field_last_name",
        "type": "text",
        "name": "lastName",
        "label": "Last Name",
        "placeholder": "Enter youth''s last name",
        "required": true
      },
      {
        "id": "field_birthdate",
        "type": "date",
        "name": "birthdate",
        "label": "Birthdate",
        "required": true
      },
      {
        "id": "field_gender",
        "type": "select",
        "name": "gender",
        "label": "Gender",
        "options": ["Male", "Female"],
        "required": true
      },
      {
        "id": "field_shirt_size",
        "type": "select",
        "name": "shirtSize",
        "label": "T-Shirt Size",
        "options": ["Youth S", "Youth M", "Youth L", "Adult S", "Adult M", "Adult L", "Adult XL"],
        "required": true
      },
      {
        "id": "field_buddy_request",
        "type": "text",
        "name": "buddyRequest",
        "label": "Buddy Request",
        "placeholder": "Name of a friend they would like to be paired with",
        "required": false
      }
    ]'::jsonb
  ),
  (
    'Medical History & Health Profile',
    'Vital medical details, health history, allergies, and special dietary needs.',
    'medical-release',
    '[
      {
        "id": "field_allergies",
        "type": "radio_group",
        "name": "allergies",
        "label": "Does the attendee have any allergies?",
        "options": ["None", "Has Allergies"],
        "required": true
      },
      {
        "id": "field_allergy_details",
        "type": "textarea",
        "name": "allergyDetails",
        "label": "Allergy Details",
        "placeholder": "Please list all allergies (food, environmental, drugs) and severity",
        "required": false,
        "conditional": {
          "fieldName": "allergies",
          "operator": "equals",
          "value": "Has Allergies"
        }
      },
      {
        "id": "field_medications",
        "type": "radio_group",
        "name": "medications",
        "label": "Will the attendee require regular medications during camp?",
        "options": ["None", "Takes Medications"],
        "required": true
      },
      {
        "id": "field_medication_details",
        "type": "textarea",
        "name": "medicationDetails",
        "label": "Medication Details & Schedule",
        "placeholder": "Please list medication names, dosages, and administration schedules",
        "required": false,
        "conditional": {
          "fieldName": "medications",
          "operator": "equals",
          "value": "Takes Medications"
        }
      },
      {
        "id": "field_dietary",
        "type": "select",
        "name": "dietaryRestrictions",
        "label": "Special Dietary Restrictions",
        "options": ["None", "Gluten-Free", "Dairy-Free", "Vegetarian", "Vegan", "Other"],
        "required": true
      },
      {
        "id": "field_medical_conditions",
        "type": "textarea",
        "name": "medicalConditions",
        "label": "Additional Medical Conditions",
        "placeholder": "Asthma, diabetes, epilepsy, sleepwalking, or any physical limitations",
        "required": false
      },
      {
        "id": "field_physician_name",
        "type": "text",
        "name": "physicianName",
        "label": "Primary Care Physician Name",
        "placeholder": "Dr. Jane Doe",
        "required": true
      },
      {
        "id": "field_physician_phone",
        "type": "text",
        "name": "physicianPhone",
        "label": "Physician Phone Number",
        "placeholder": "(555) 555-5555",
        "required": true
      }
    ]'::jsonb
  ),
  (
    'Emergency Contacts & Insurance Consent',
    'Authorized emergency contacts and health insurance card credentials.',
    'emergency-consent',
    '[
      {
        "id": "field_primary_contact",
        "type": "text",
        "name": "primaryContactName",
        "label": "Primary Emergency Contact Name",
        "placeholder": "Enter contact name",
        "required": true
      },
      {
        "id": "field_primary_phone",
        "type": "text",
        "name": "primaryContactPhone",
        "label": "Primary Contact Phone",
        "placeholder": "(555) 555-5555",
        "required": true
      },
      {
        "id": "field_primary_relationship",
        "type": "text",
        "name": "primaryContactRelationship",
        "label": "Relationship to Youth",
        "placeholder": "e.g., Parent, Guardian",
        "required": true
      },
      {
        "id": "field_secondary_contact",
        "type": "text",
        "name": "secondaryContactName",
        "label": "Secondary Emergency Contact Name",
        "placeholder": "Enter contact name",
        "required": true
      },
      {
        "id": "field_secondary_phone",
        "type": "text",
        "name": "secondaryContactPhone",
        "label": "Secondary Contact Phone",
        "placeholder": "(555) 555-5555",
        "required": true
      },
      {
        "id": "field_insurance_carrier",
        "type": "text",
        "name": "insuranceCarrier",
        "label": "Medical Insurance Carrier",
        "placeholder": "e.g., Blue Cross, Aetna",
        "required": true
      },
      {
        "id": "field_policy_number",
        "type": "text",
        "name": "policyNumber",
        "label": "Policy / Member ID Number",
        "placeholder": "Enter policy number",
        "required": true
      },
      {
        "id": "field_insurance_photo",
        "type": "file",
        "name": "insuranceCardPhoto",
        "label": "Upload Front of Insurance Card",
        "required": true
      },
      {
        "id": "field_consent_agreement",
        "type": "checkbox_group",
        "name": "consentAgreement",
        "label": "Emergency Treatment Consent",
        "options": ["I authorize camp leadership to procure emergency medical treatment if parents/guardians cannot be reached."],
        "required": true
      }
    ]'::jsonb
  ),
  (
    'Parent Volunteer & Leader Consent',
    'Registration and preference selection for adult volunteer leaders.',
    'volunteer-signup',
    '[
      {
        "id": "field_ward_branch",
        "type": "text",
        "name": "wardBranch",
        "label": "LDS Ward or Branch Name",
        "placeholder": "e.g., Oak Hills 2nd Ward",
        "required": true
      },
      {
        "id": "field_volunteer_prefs",
        "type": "checkbox_group",
        "name": "volunteerPreferences",
        "label": "Preferred Leadership Roles",
        "options": ["Camp Counselor", "Kitchen Staff", "Logistics/Setup", "First Aid / Medical", "Crafts/Activities"],
        "required": true
      },
      {
        "id": "field_background_consent",
        "type": "radio_group",
        "name": "backgroundCheckConsent",
        "label": "Do you consent to a standard church leader background check?",
        "options": ["No", "Yes, I consent to a background check"],
        "required": true
      },
      {
        "id": "field_leader_sig",
        "type": "signature",
        "name": "signature",
        "label": "Volunteer Digital Signature",
        "required": true
      }
    ]'::jsonb
  ),
  (
    'Activity Waiver & Digital Signature',
    'General liability waiver, high adventure authorization, and parent signature.',
    'activity-waiver',
    '[
      {
        "id": "field_conduct_agree",
        "type": "checkbox_group",
        "name": "agreeToConduct",
        "label": "Camp Code of Conduct Agreement",
        "options": ["I agree to abide by the camp rules and code of conduct, upholding standard church parameters."],
        "required": true
      },
      {
        "id": "field_high_adventure",
        "type": "radio_group",
        "name": "highAdventureConsent",
        "label": "Permission for High-Adventure ropes course and water activities",
        "options": ["I grant permission", "I do not grant permission"],
        "required": true
      },
      {
        "id": "field_parent_sig",
        "type": "signature",
        "name": "guardianSignature",
        "label": "Parent/Guardian Digital Signature",
        "required": true
      }
    ]'::jsonb
  )
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
    description = EXCLUDED.description,
    fields = EXCLUDED.fields,
    updated_at = now();
