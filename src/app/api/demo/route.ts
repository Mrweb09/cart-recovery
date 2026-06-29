import { NextResponse } from 'next/server'
import { generateRecoveryEmail } from '@/lib/claude/email-generator'
import type { CartProduct } from '@/types'

// Demo data — UrbanThreads streetwear brand
const DEMO_PRODUCTS: CartProduct[] = [
  { id: 1, title: 'Oversized Acid Wash Hoodie', variant_title: 'Stone Grey / XL', price: '89.00', quantity: 1, image_url: null },
  { id: 2, title: 'Relaxed Cargo Trousers', variant_title: 'Olive / 32', price: '79.00', quantity: 1, image_url: null },
  { id: 3, title: 'Box Logo Tee', variant_title: 'White / L', price: '39.00', quantity: 2, image_url: null },
]

const DEMO_CART_VALUE = 246.00
const DEMO_CUSTOMER = 'Jordan'

export async function POST(request: Request) {
  const { emailNumber = 1 } = await request.json() as { emailNumber?: 1 | 2 | 3 }

  try {
    const email = await generateRecoveryEmail({
      emailNumber: emailNumber as 1 | 2 | 3,
      customerName: DEMO_CUSTOMER,
      products: DEMO_PRODUCTS,
      cartValue: DEMO_CART_VALUE,
      checkoutUrl: 'https://urbanthreads.myshopify.com/checkouts/demo',
      brandName: 'UrbanThreads',
      toneOfVoice: 'streetwear',
      primaryColor: '#7C3AED',
    })

    return NextResponse.json({
      ok: true,
      email,
      demo: {
        customer: DEMO_CUSTOMER,
        products: DEMO_PRODUCTS,
        cart_value: DEMO_CART_VALUE,
        brand: 'UrbanThreads',
      },
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
