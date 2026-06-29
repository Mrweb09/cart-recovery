import { Resend } from 'resend'
import type { GeneratedEmail } from '@/types'

interface SendEmailInput {
  resendApiKey: string
  fromEmail: string
  fromName: string
  toEmail: string
  toName: string | null
  email: GeneratedEmail
  cartId: string
  appUrl: string
}

interface SendResult {
  messageId: string | null
  error: string | null
}

export async function sendRecoveryEmail(input: SendEmailInput): Promise<SendResult> {
  const resend = new Resend(input.resendApiKey)

  const fromAddress = `${input.fromName} <${input.fromEmail}>`
  const toAddress = input.toName ? `${input.toName} <${input.toEmail}>` : input.toEmail

  // Inject real unsubscribe URL into HTML body
  const unsubscribeUrl = `${input.appUrl}/api/unsubscribe?cart=${input.cartId}`
  const bodyWithUnsubscribe = input.email.html_body.replace(
    /\{\{unsubscribe_url\}\}/g,
    unsubscribeUrl
  )

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: toAddress,
      subject: input.email.subject,
      html: bodyWithUnsubscribe,
      headers: {
        'X-Cart-ID': input.cartId,
        'List-Unsubscribe': `<${unsubscribeUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    })

    if (error) {
      return { messageId: null, error: error.message }
    }

    return { messageId: data?.id ?? null, error: null }
  } catch (err) {
    return { messageId: null, error: String(err) }
  }
}
