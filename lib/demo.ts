/**
 * Demo Mode Configuration
 *
 * This module handles demo/test account detection and provides test payment
 * methods for the specified demo accounts. Regular users are unaffected.
 */

// Demo account emails
const DEMO_ACCOUNTS = ["customer@hikaru.test", "admin@hikaru.test"];

// Test card numbers for demo mode
export const DEMO_CARDS = {
  success: {
    number: "4242424242424242",
    expiry: "12/25",
    cvc: "123",
    name: "Test User",
  },
  decline: {
    number: "4000000000000002",
    expiry: "12/25",
    cvc: "123",
    name: "Test User",
  },
  processing: {
    number: "4000002500003155",
    expiry: "12/25",
    cvc: "123",
    name: "Test User",
  },
};

/**
 * Check if an email belongs to a demo account
 */
export function isDemoAccount(email: string | null | undefined): boolean {
  if (!email) return false;
  return DEMO_ACCOUNTS.includes(email.toLowerCase());
}

/**
 * Get demo mode status for a user
 */
export function getDemoModeInfo(email: string | null | undefined) {
  const isDemo = isDemoAccount(email);
  return {
    isDemo,
    message: isDemo ? "Test Mode - No real payment required" : null,
    testCardNumber: isDemo ? DEMO_CARDS.success.number : null,
    testExpiry: isDemo ? DEMO_CARDS.success.expiry : null,
    testCVC: isDemo ? DEMO_CARDS.success.cvc : null,
  };
}
