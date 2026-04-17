'use server'

export interface AddressValidationResult {
  isValid: boolean
  errors?: string[]
  normalized?: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
}

/**
 * Validate address format
 */
export function validateAddress(address: {
  street?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  phone?: string
}): AddressValidationResult {
  const errors: string[] = []

  // Validate street
  if (!address.street || address.street.trim().length < 5) {
    errors.push('Street address must be at least 5 characters')
  }

  // Validate city
  if (!address.city || address.city.trim().length < 2) {
    errors.push('City is required')
  }

  // Validate state/province
  if (!address.state || address.state.trim().length < 2) {
    errors.push('State/Province is required')
  }

  // Validate ZIP/postal code
  const zipRegex = /^\d{5}(-\d{4})?$/
  if (!address.zip || !zipRegex.test(address.zip)) {
    errors.push('ZIP code must be in valid format (e.g., 12345 or 12345-6789)')
  }

  // Validate country
  if (!address.country || address.country.trim().length < 2) {
    errors.push('Country is required')
  }

  // Validate phone if provided
  if (address.phone) {
    const phoneRegex = /^[\d\s\-\(\)\.+]+$/
    if (!phoneRegex.test(address.phone) || address.phone.replace(/\D/g, '').length < 10) {
      errors.push('Phone number must be valid')
    }
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
    }
  }

  // Normalize address
  return {
    isValid: true,
    normalized: {
      street: address.street?.trim() || '',
      city: address.city?.trim() || '',
      state: address.state?.trim().toUpperCase() || '',
      zip: address.zip?.trim() || '',
      country: address.country?.trim() || '',
    },
  }
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone format
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\(\)\.+]+$/
  const digitsOnly = phone.replace(/\D/g, '')
  return phoneRegex.test(phone) && digitsOnly.length >= 10 && digitsOnly.length <= 15
}

/**
 * Format phone number
 */
export function formatPhone(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, '')

  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`
  }

  if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    return `+1 (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`
  }

  return phone
}

/**
 * Validate name format
 */
export function validateName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 100
}

/**
 * Supported countries for shipping
 */
export const SUPPORTED_COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'MX', name: 'Mexico' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'JP', name: 'Japan' },
  { code: 'AU', name: 'Australia' },
]

/**
 * Get US states for dropdown
 */
export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
]
