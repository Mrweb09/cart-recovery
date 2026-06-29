export type ToneOfVoice = 'professional' | 'friendly' | 'luxury' | 'streetwear'
export type SequenceStatus = 'pending' | 'active' | 'completed' | 'cancelled'
export type LogLevel = 'info' | 'warning' | 'error'

export interface Client {
  id: string
  brand_name: string
  shopify_domain: string
  shopify_webhook_secret: string
  resend_api_key: string
  from_email: string
  logo_url: string | null
  tone_of_voice: ToneOfVoice
  primary_color: string
  active: boolean
  created_at: string
}

export interface CartProduct {
  id: number | string
  title: string
  variant_title?: string | null
  price: string
  quantity: number
  image_url?: string | null
}

export interface AbandonedCart {
  id: string
  client_id: string
  shopify_cart_token: string | null
  customer_email: string
  customer_name: string | null
  cart_value: number
  products: CartProduct[]
  checkout_url: string | null
  abandoned_at: string
  recovered: boolean
  recovered_at: string | null
  recovered_value: number | null
  sequence_status: SequenceStatus
  emails_sent_count: number
  next_email_at: string | null
  created_at: string
}

export interface EmailSent {
  id: string
  cart_id: string
  client_id: string
  email_number: 1 | 2 | 3
  subject: string
  preview_text: string | null
  body: string
  sent_at: string
  resend_message_id: string | null
  opened: boolean
  opened_at: string | null
  clicked: boolean
  clicked_at: string | null
  converted: boolean
}

export interface SystemLog {
  id: string
  client_id: string | null
  cart_id: string | null
  level: LogLevel
  message: string
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface DashboardMetrics {
  total_revenue_recovered: number
  recovery_rate: number
  total_carts: number
  total_emails_sent: number
  open_rate: number
  click_rate: number
  active_sequences: number
}

export interface GeneratedEmail {
  subject: string
  preview_text: string
  html_body: string
}

// Shopify webhook payload shape (simplified)
export interface ShopifyCheckout {
  id: number
  token: string
  cart_token: string | null
  email: string | null
  created_at: string
  updated_at: string
  completed_at: string | null
  abandoned_checkout_url: string
  total_price: string
  line_items: ShopifyLineItem[]
  customer?: {
    first_name?: string
    last_name?: string
    email?: string
  } | null
  billing_address?: {
    first_name?: string
  } | null
}

export interface ShopifyLineItem {
  id: number
  title: string
  variant_title?: string | null
  price: string
  quantity: number
  product_id?: number
  variant_id?: number
  properties?: Array<{ name: string; value: string }>
}

export interface ShopifyOrder {
  id: number
  token: string
  cart_token: string | null
  email: string | null
  total_price: string
  created_at: string
}
