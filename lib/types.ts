export interface User {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  role: "customer" | "admin";
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  brand: string | null;
  category: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  tags: string[] | null;
  tax_rate: number; // Percentage (0-100)
  payment_methods: string[]; // Array of payment methods: 'card', 'cod'
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  total_price: number;
  payment_method: string | null;
  shipping_method: string | null;
  shipping_address: string | null;
  status:
    | "pending"
    | "processing"
    | "confirmed"
    | "preparing"
    | "shipped"
    | "delivered"
    | "cancelled";
  order_number: string | null; // Unique order number for invoice
  invoice_url: string | null; // URL to invoice/receipt
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  quantity: number;
  price: number;
  product?: Product;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  product?: Product;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  order_id: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
  user?: Pick<User, "id" | "name">;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  link: string | null;
  read_status: boolean;
  type: string;
  created_at: string;
}

export interface OTPCode {
  id: string;
  email: string;
  code_hash: string;
  created_at: string;
  expires_at: string;
  verified_at: string | null;
  attempts: number;
  last_attempt_at: string | null;
}

export interface SavedPaymentMethod {
  id: string;
  user_id: string;
  method_type: "card" | "bank_account"; // Type of payment method
  card_number: string | null; // Last 4 digits stored
  card_holder: string | null;
  card_brand: string | null; // Mastercard, Visa, Citrus, etc.
  expiry_date: string | null; // MM/YY format
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
