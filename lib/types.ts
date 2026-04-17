export interface User {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  address: string | null
  role: 'customer' | 'admin'
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  brand: string | null
  category: string | null
  price: number
  stock: number
  image_url: string | null
  tags: string[] | null
  created_at: string
}

export interface Order {
  id: string
  user_id: string | null
  total_price: number
  payment_method: string | null
  shipping_method: string | null
  shipping_address: string | null
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  quantity: number
  price: number
  product?: Product
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[]
}

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  product?: Product
}

export interface Review {
  id: string
  user_id: string
  product_id: string
  order_id: string | null
  rating: number
  comment: string | null
  created_at: string
  user?: Pick<User, 'id' | 'name'>
}

export interface Notification {
  id: string
  user_id: string
  message: string
  link: string | null
  read_status: boolean
  type: string
  created_at: string
}

export interface OTPCode {
  id: string
  email: string
  code_hash: string
  created_at: string
  expires_at: string
  verified_at: string | null
  attempts: number
  last_attempt_at: string | null
}
