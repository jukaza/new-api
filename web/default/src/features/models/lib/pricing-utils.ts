import { formatBillingCurrencyFromUSD } from '@/lib/currency'
import { safeJsonParse } from '@/features/system-settings/utils/json-parser'

export type PricingDisplayInfo = {
  mode: 'per-token' | 'per-request' | 'expression' | 'not-set'
  inputPrice?: number    // $/1M tokens
  outputPrice?: number   // $/1M tokens
  requestPrice?: number  // $/request
  billingMode?: string
  billingExpr?: string
}

/**
 * Convert internal ratio to price in USD per 1M tokens (ratio * 2)
 */
export function ratioToPrice(ratio: number): number {
  return ratio * 2
}

/**
 * Convert price in USD per 1M tokens to internal ratio (price / 2)
 */
export function priceToRatio(price: number): number {
  return price / 2
}

/**
 * Get pricing display info for a specific model from raw option string values
 */
export function getPricingForModel(
  modelName: string,
  maps: {
    ModelPrice?: string
    ModelRatio?: string
    CompletionRatio?: string
    'billing_setting.billing_mode'?: string
    'billing_setting.billing_expr'?: string
  }
): PricingDisplayInfo {
  // Check if billing expression is configured for this model
  const billingModeMap = safeJsonParse<Record<string, string>>(
    maps['billing_setting.billing_mode'] || '{}',
    { fallback: {}, silent: true }
  )
  const billingExprMap = safeJsonParse<Record<string, string>>(
    maps['billing_setting.billing_expr'] || '{}',
    { fallback: {}, silent: true }
  )
  
  if (billingModeMap[modelName] === 'tiered_expr' && billingExprMap[modelName]) {
    return {
      mode: 'expression',
      billingMode: 'tiered_expr',
      billingExpr: billingExprMap[modelName],
    }
  }

  const priceMap = safeJsonParse<Record<string, number>>(maps.ModelPrice || '{}', {
    fallback: {},
    silent: true,
  })
  const ratioMap = safeJsonParse<Record<string, number>>(maps.ModelRatio || '{}', {
    fallback: {},
    silent: true,
  })
  const completionMap = safeJsonParse<Record<string, number>>(
    maps.CompletionRatio || '{}',
    { fallback: {}, silent: true }
  )

  const price = priceMap[modelName]
  const ratio = ratioMap[modelName]
  const completionRatio = completionMap[modelName]

  if (price !== undefined && price !== null) {
    return {
      mode: 'per-request',
      requestPrice: price,
    }
  }

  if (ratio !== undefined && ratio !== null) {
    const inputPrice = ratioToPrice(ratio)
    const outRatio =
      completionRatio !== undefined && completionRatio !== null
        ? completionRatio
        : 1
    const outputPrice = inputPrice * outRatio
    return {
      mode: 'per-token',
      inputPrice,
      outputPrice,
    }
  }

  return {
    mode: 'not-set',
  }
}

/**
 * Get a compact display string for the pricing info
 */
export function formatPriceCompact(info: PricingDisplayInfo): string {
  if (info.mode === 'expression') {
    return 'Expression'
  }
  const opts = { digitsLarge: 4, digitsSmall: 6, abbreviate: false }
  if (info.mode === 'per-request') {
    return info.requestPrice !== undefined ? formatBillingCurrencyFromUSD(info.requestPrice, opts) : '—'
  }
  if (info.mode === 'per-token') {
    const inputStr =
      info.inputPrice !== undefined ? formatBillingCurrencyFromUSD(info.inputPrice, { ...opts, digitsLarge: 2, digitsSmall: 4 }) : '—'
    const outputStr =
      info.outputPrice !== undefined ? formatBillingCurrencyFromUSD(info.outputPrice, { ...opts, digitsLarge: 2, digitsSmall: 4 }) : '—'
    return `${inputStr} / ${outputStr}`
  }
  return '—'
}
