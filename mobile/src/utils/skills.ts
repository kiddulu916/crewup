/**
 * Common construction skills and trades
 */

export interface SkillOption {
  id: string;
  name: string;
  category: string;
}

export const COMMON_SKILLS: SkillOption[] = [
  // Carpentry
  { id: 'carpentry-general', name: 'General Carpentry', category: 'Carpentry' },
  { id: 'carpentry-framing', name: 'Framing', category: 'Carpentry' },
  { id: 'carpentry-finish', name: 'Finish Carpentry', category: 'Carpentry' },
  { id: 'carpentry-cabinet', name: 'Cabinet Making', category: 'Carpentry' },

  // Electrical
  { id: 'electrical-general', name: 'General Electrical', category: 'Electrical' },
  { id: 'electrical-residential', name: 'Residential Wiring', category: 'Electrical' },
  { id: 'electrical-commercial', name: 'Commercial Electrical', category: 'Electrical' },
  { id: 'electrical-industrial', name: 'Industrial Electrical', category: 'Electrical' },

  // Plumbing
  { id: 'plumbing-general', name: 'General Plumbing', category: 'Plumbing' },
  { id: 'plumbing-residential', name: 'Residential Plumbing', category: 'Plumbing' },
  { id: 'plumbing-commercial', name: 'Commercial Plumbing', category: 'Plumbing' },
  { id: 'plumbing-pipefitting', name: 'Pipefitting', category: 'Plumbing' },

  // Masonry
  { id: 'masonry-brick', name: 'Bricklaying', category: 'Masonry' },
  { id: 'masonry-concrete', name: 'Concrete Work', category: 'Masonry' },
  { id: 'masonry-stone', name: 'Stonework', category: 'Masonry' },
  { id: 'masonry-tile', name: 'Tile Setting', category: 'Masonry' },

  // HVAC
  { id: 'hvac-installation', name: 'HVAC Installation', category: 'HVAC' },
  { id: 'hvac-maintenance', name: 'HVAC Maintenance', category: 'HVAC' },
  { id: 'hvac-repair', name: 'HVAC Repair', category: 'HVAC' },

  // Roofing
  { id: 'roofing-shingle', name: 'Shingle Roofing', category: 'Roofing' },
  { id: 'roofing-metal', name: 'Metal Roofing', category: 'Roofing' },
  { id: 'roofing-flat', name: 'Flat Roofing', category: 'Roofing' },
  { id: 'roofing-repair', name: 'Roof Repair', category: 'Roofing' },

  // Painting
  { id: 'painting-interior', name: 'Interior Painting', category: 'Painting' },
  { id: 'painting-exterior', name: 'Exterior Painting', category: 'Painting' },
  { id: 'painting-commercial', name: 'Commercial Painting', category: 'Painting' },

  // Drywall
  { id: 'drywall-installation', name: 'Drywall Installation', category: 'Drywall' },
  { id: 'drywall-finishing', name: 'Drywall Finishing', category: 'Drywall' },
  { id: 'drywall-repair', name: 'Drywall Repair', category: 'Drywall' },

  // Welding
  { id: 'welding-arc', name: 'Arc Welding', category: 'Welding' },
  { id: 'welding-mig', name: 'MIG Welding', category: 'Welding' },
  { id: 'welding-tig', name: 'TIG Welding', category: 'Welding' },

  // Equipment Operation
  { id: 'equipment-excavator', name: 'Excavator Operation', category: 'Equipment' },
  { id: 'equipment-forklift', name: 'Forklift Operation', category: 'Equipment' },
  { id: 'equipment-crane', name: 'Crane Operation', category: 'Equipment' },
  { id: 'equipment-bulldozer', name: 'Bulldozer Operation', category: 'Equipment' },

  // General
  { id: 'general-demolition', name: 'Demolition', category: 'General' },
  { id: 'general-landscaping', name: 'Landscaping', category: 'General' },
  { id: 'general-cleanup', name: 'Site Cleanup', category: 'General' },
  { id: 'general-safety', name: 'Safety Management', category: 'General' },
];

export const TRADE_OPTIONS = [
  'Carpenter',
  'Electrician',
  'Plumber',
  'Mason',
  'HVAC Technician',
  'Roofer',
  'Painter',
  'Drywall Installer',
  'Welder',
  'Equipment Operator',
  'General Laborer',
  'Site Supervisor',
  'Project Manager',
  'Safety Officer',
];

export const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level (0-2 years)' },
  { value: 'intermediate', label: 'Intermediate (2-5 years)' },
  { value: 'experienced', label: 'Experienced (5-10 years)' },
  { value: 'expert', label: 'Expert (10+ years)' },
];
