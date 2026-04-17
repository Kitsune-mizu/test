# API Endpoints Reference

## Payment Methods Endpoints

### Get All Payment Methods
```
GET /api/payment-methods
Authentication: Required
Response: Array of SavedPaymentMethod
```

Example Response:
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "method_type": "card",
    "card_number": "****-****-****-1234",
    "card_holder": "John Doe",
    "card_brand": "visa",
    "expiry_date": "12/25",
    "is_default": true,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### Create Payment Method
```
POST /api/payment-methods
Authentication: Required
Content-Type: application/json

Request Body:
{
  "method_type": "card",
  "card_number": "1234567890123456",
  "card_holder": "John Doe",
  "card_brand": "visa",
  "expiry_date": "12/25",
  "is_default": false
}

Response: SavedPaymentMethod (201 Created)
Error: { "error": "message" } (400/500)
```

### Update Payment Method
```
PATCH /api/payment-methods/{id}
Authentication: Required
Content-Type: application/json

Request Body (optional fields):
{
  "is_default": true,
  "is_active": false
}

Response: Updated SavedPaymentMethod
Error: { "error": "message" } (401/404/500)
```

### Delete Payment Method
```
DELETE /api/payment-methods/{id}
Authentication: Required
Response: { "success": true }
Error: { "error": "message" } (401/404/500)
```

## Order Endpoints

### Get Order Invoice
```
GET /api/orders/{orderId}/invoice
Authentication: Required
Response: HTML document (invoice-{orderNumber}.html)
```

Usage in Component:
```typescript
const response = await fetch(`/api/orders/${orderId}/invoice`)
const html = await response.text()
// Either display in new window or download as file
```

## Order Actions (Server Functions)

### Create Order
```typescript
import { createOrderAction } from "@/app/actions/orders"

const result = await createOrderAction({
  totalPrice: 299.99,
  paymentMethod: "card" | "cod",
  shippingMethod: "standard" | "express",
  shippingAddress: "123 Main St\nCity, State 12345",
  items: [
    {
      product_id: "uuid",
      quantity: 1,
      price: 299.99
    }
  ]
})

// Response:
// Success: { success: true, orderId: "ORD-..." }
// Error: { error: "error message" }
```

### Cancel Order
```typescript
import { cancelOrderAction } from "@/app/actions/orders"

const result = await cancelOrderAction(orderId)

// Response:
// Success: { success: true }
// Error: { error: "error message" }
```

## Database Types

### SavedPaymentMethod
```typescript
interface SavedPaymentMethod {
  id: string
  user_id: string
  method_type: 'card' | 'bank_account'
  card_number: string | null // Last 4 digits masked
  card_holder: string | null
  card_brand: string | null // Mastercard, Visa, Citrus, etc.
  expiry_date: string | null // MM/YY format
  is_default: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}
```

### Product (Extended)
```typescript
interface Product {
  // ... existing fields
  tax_rate: number // Percentage (0-100)
  payment_methods: string[] // Array of payment methods: 'card', 'cod'
}
```

### Order (Extended)
```typescript
interface Order {
  // ... existing fields
  status: 'pending' | 'processing' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled'
  order_number: string | null // e.g., ORD-1704067200000-ABC123XY
  invoice_url: string | null // URL reference to invoice
}
```

## Supported Payment Methods

### Card Brands
- visa
- mastercard
- citrus
- amex (American Express)
- discover

### Payment Method Types
- card: Credit/debit card payments
- cod: Cash on Delivery

## Order Status Flow

### Demo Account Orders
```
pending/processing → confirmed → [ready for shipping]
```

### Real Account Orders
```
pending → [payment confirmation] → confirmed → preparing → shipped → delivered
```

### Cancellable Statuses
Orders can be cancelled only when in: `pending` or `confirmed` status

## Error Handling

### Common Error Responses

```json
// Unauthorized
{ "error": "Unauthorized" }
// Status: 401

// Invalid input
{ "error": "Missing required fields" }
// Status: 400

// Resource not found
{ "error": "Order not found" }
// Status: 404

// Server error
{ "error": "Database error message" }
// Status: 500
```

## Rate Limiting & Security

- All payment-related endpoints require authentication
- User can only access their own payment methods and orders
- Payment card numbers are masked (only last 4 digits visible)
- RLS policies enforce data isolation at database level
- Order creation generates unique order numbers for invoicing

## Webhook Integration (Future)

When implementing webhook support for payment providers:
- Use `/api/orders/{orderId}` as webhook endpoint
- Update order status based on payment provider confirmation
- Trigger notifications for status changes
- Generate and store invoice_url reference

## Testing

### Demo Credentials
- Email: `customer@hikaru.test`
- Password: `DemoPassword123!`

### Test Payment Cards
See demo.ts for available test card numbers

### Manual Testing Steps
1. Create order → Check order_number generation
2. Add payment method → Verify storage and masking
3. Generate invoice → Validate HTML output
4. View success page → Check order details display
