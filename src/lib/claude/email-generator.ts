import Anthropic from '@anthropic-ai/sdk'
import type { CartProduct, GeneratedEmail, ToneOfVoice } from '@/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const TONE_DESCRIPTIONS: Record<ToneOfVoice, string> = {
  professional: 'professional, polished, and authoritative — like a premium B2B brand',
  friendly: 'warm, conversational, and approachable — like a friend recommending something',
  luxury: 'elevated, exclusive, and aspirational — like Harrods or Net-a-Porter',
  streetwear: 'bold, casual, and culturally aware — like Supreme or Palace',
}

const EMAIL_PROMPTS: Record<1 | 2 | 3, string> = {
  1: `Write the FIRST abandoned cart recovery email (sent 1 hour after abandonment).
Tone: warm and curious — "did something go wrong?" energy. NOT pushy. Human.
Goal: remind them what they left, make it easy to return.
Include: a personal note referencing their specific items, the cart total, and a clear CTA to return.`,

  2: `Write the SECOND abandoned cart recovery email (sent 24 hours after abandonment).
Tone: gentle urgency — low stock warning, maybe hint at a discount. Still personal.
Goal: create FOMO without being spammy.
Include: reference their specific items again, urgency signal, possibly mention "we can hold these for a bit longer".`,

  3: `Write the THIRD and FINAL abandoned cart recovery email (sent 48 hours after abandonment).
Tone: soft goodbye — "we understand if it wasn't the right time". Keep the door open.
Goal: last-chance attempt that doesn't burn the relationship.
Include: a gracious, low-pressure goodbye, final CTA, maybe a "come back anytime" close.`,
}

interface GenerateEmailInput {
  emailNumber: 1 | 2 | 3
  customerName: string
  products: CartProduct[]
  cartValue: number
  checkoutUrl: string
  brandName: string
  toneOfVoice: ToneOfVoice
  logoUrl?: string | null
  primaryColor?: string
}

export async function generateRecoveryEmail(
  input: GenerateEmailInput,
  attempt = 1
): Promise<GeneratedEmail> {
  const productList = input.products
    .map((p) => `- ${p.title}${p.variant_title ? ` (${p.variant_title})` : ''}: £${p.price} × ${p.quantity}`)
    .join('\n')

  const prompt = `You are an expert e-commerce email copywriter. Generate an abandoned cart recovery email.

BRAND: ${input.brandName}
BRAND TONE: ${TONE_DESCRIPTIONS[input.toneOfVoice]}
CUSTOMER NAME: ${input.customerName || 'there'}
CART CONTENTS:
${productList}
CART TOTAL: £${input.cartValue.toFixed(2)}
CHECKOUT URL: ${input.checkoutUrl}

${EMAIL_PROMPTS[input.emailNumber]}

OUTPUT FORMAT — respond ONLY with valid JSON, no markdown fences, exactly this structure:
{
  "subject": "the subject line (under 60 chars, no emojis unless streetwear brand)",
  "preview_text": "the preview/preheader text (under 90 chars)",
  "html_body": "complete HTML email with inline CSS — dark-mode aware, mobile responsive, branded with ${input.brandName}"
}

HTML EMAIL REQUIREMENTS:
- Inline CSS only (no <style> tags — Gmail strips them)
- Max width 600px, centered
- Background: #ffffff, text: #1a1a1a
- Prominent button linking to checkout URL
- Product list clearly shown
- Footer with unsubscribe placeholder: <a href="{{unsubscribe_url}}">Unsubscribe</a>
- Feel handcrafted, not like a template
- Primary accent color: ${input.primaryColor || '#F5C842'}
${input.logoUrl ? `- Include brand logo at top: <img src="${input.logoUrl}" alt="${input.brandName}" />` : ''}

Write like a human. No corporate speak. Make it feel personal.`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') throw new Error('Unexpected response type')

    const raw = content.text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()
    const parsed = JSON.parse(raw) as GeneratedEmail
    return parsed
  } catch (err) {
    if (attempt === 1) {
      console.error('[Claude] First attempt failed, retrying:', err)
      await new Promise((r) => setTimeout(r, 2000))
      return generateRecoveryEmail(input, 2)
    }
    throw new Error(`Claude API failed after 2 attempts: ${String(err)}`)
  }
}
