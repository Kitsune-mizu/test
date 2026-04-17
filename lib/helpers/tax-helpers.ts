'use server'

/**
 * Tax calculation helper for checkout
 */

const TAX_RATES: Record<string, number> = {
  CA: 0.0825,
  TX: 0.0625,
  NY: 0.08,
  FL: 0.07,
  DEFAULT: 0.08,
}

const SHIPPING_COSTS: Record<string, number> = {
  standard: 10.99,
  express: 24.99,
  overnight: 49.99,
}

export interface TaxCalculationResult {
  subtotal: number
  taxAmount: number
  shippingCost: number
  totalPrice: number
}

/**
 * Calculate tax based on state
 */
export function calculateTax(
  subtotal: number,
  state?: string
): TaxCalculationResult {
  const taxRate = state ? TAX_RATES[state] || TAX_RATES.DEFAULT : TAX_RATES.DEFAULT
  const taxAmount = parseFloat((subtotal * taxRate).toFixed(2))

  return {
    subtotal,
    taxAmount,
    shippingCost: 0,
    totalPrice: subtotal + taxAmount,
  }
}

/**
 * Calculate shipping cost
 */
export function calculateShipping(
  method: 'standard' | 'express' | 'overnight'
): number {
  return SHIPPING_COSTS[method] || SHIPPING_COSTS.standard
}

/**
 * Calculate total with tax and shipping
 */
export function calculateTotal(
  subtotal: number,
  state?: string,
  shippingMethod: 'standard' | 'express' | 'overnight' = 'standard'
): TaxCalculationResult {
  const taxRate = state ? TAX_RATES[state] || TAX_RATES.DEFAULT : TAX_RATES.DEFAULT
  const taxAmount = parseFloat((subtotal * taxRate).toFixed(2))
  const shippingCost = calculateShipping(shippingMethod)
  const totalPrice = parseFloat((subtotal + taxAmount + shippingCost).toFixed(2))

  return {
    subtotal,
    taxAmount,
    shippingCost,
    totalPrice,
  }
}

/**
 * Get tax rate for state
 */
export function getTaxRate(state?: string): number {
  return state ? TAX_RATES[state] || TAX_RATES.DEFAULT : TAX_RATES.DEFAULT
}

/**
 * Get available shipping methods with costs
 */
export function getShippingMethods() {
  return [
    { id: 'standard', name: 'Standard (5-7 business days)', cost: SHIPPING_COSTS.standard },
    { id: 'express', name: 'Express (2-3 business days)', cost: SHIPPING_COSTS.express },
    { id: 'overnight', name: 'Overnight', cost: SHIPPING_COSTS.overnight },
  ]
}
