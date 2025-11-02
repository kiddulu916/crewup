/**
 * Constants for employer profiles and job postings
 */

export const COMPANY_SIZES = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '500+', label: '500+ employees' },
];

export const BUSINESS_TYPES = [
  { value: 'general_contractor', label: 'General Contractor' },
  { value: 'subcontractor', label: 'Subcontractor' },
  { value: 'residential_builder', label: 'Residential Builder' },
  { value: 'commercial_builder', label: 'Commercial Builder' },
  { value: 'remodeling', label: 'Remodeling/Renovation' },
  { value: 'specialty_trade', label: 'Specialty Trade' },
  { value: 'property_management', label: 'Property Management' },
  { value: 'facilities_maintenance', label: 'Facilities Maintenance' },
  { value: 'other', label: 'Other' },
];

export const JOB_TYPES = [
  { value: 'standard', label: 'Standard Job' },
  { value: 'day_labor', label: 'Day Labor' },
];

export const PAY_TYPES = [
  { value: 'hourly', label: 'Hourly Rate' },
  { value: 'salary', label: 'Annual Salary' },
  { value: 'per_project', label: 'Per Project' },
];

export const JOB_DURATION_OPTIONS = [
  { value: '1', label: '1 week' },
  { value: '2', label: '2 weeks' },
  { value: '4', label: '1 month' },
  { value: '8', label: '2 months' },
  { value: '12', label: '3 months' },
  { value: '26', label: '6 months' },
  { value: '52', label: '1 year' },
  { value: '104', label: '2+ years' },
];

export const WORKERS_NEEDED_OPTIONS = [
  { value: '1', label: '1 worker' },
  { value: '2', label: '2 workers' },
  { value: '3', label: '3 workers' },
  { value: '5', label: '5 workers' },
  { value: '10', label: '10 workers' },
  { value: '20', label: '20+ workers' },
];

export const CERTIFICATION_OPTIONS = [
  'OSHA 10-Hour',
  'OSHA 30-Hour',
  'First Aid/CPR',
  'Forklift Certification',
  'Scaffold Certification',
  'Confined Space',
  'Fall Protection',
  'Electrical License',
  'Plumbing License',
  'HVAC License',
  'Welding Certification',
  'Asbestos Awareness',
  'Lead Safety',
  'Crane Operator',
  'CDL License',
];
