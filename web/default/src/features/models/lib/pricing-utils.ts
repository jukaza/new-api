/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
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
  if (info.mode === 'per-request') {
    return `$${info.requestPrice?.toFixed(4)}`
  }
  if (info.mode === 'per-token') {
    const inputStr =
      info.inputPrice !== undefined ? `$${info.inputPrice.toFixed(2)}` : '—'
    const outputStr =
      info.outputPrice !== undefined ? `$${info.outputPrice.toFixed(2)}` : '—'
    return `${inputStr} / ${outputStr}`
  }
  return '—'
}
