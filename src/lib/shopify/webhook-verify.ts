import { createHmac, timingSafeEqual } from 'crypto'

/**
 * Verify Shopify webhook HMAC signature.
 * Shopify signs the raw body with the webhook secret using HMAC-SHA256.
 */
export function verifyShopifyWebhook(
  rawBody: string,
  shopifyHmacHeader: string,
  webhookSecret: string
): boolean {
  try {
    const hash = createHmac('sha256', webhookSecret)
      .update(rawBody, 'utf8')
      .digest('base64')

    const trusted = Buffer.from(hash)
    const received = Buffer.from(shopifyHmacHeader)

    if (trusted.length !== received.length) return false

    return timingSafeEqual(trusted, received)
  } catch {
    return false
  }
}
