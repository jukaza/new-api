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
import { useMemo } from 'react'
import {
  useSystemOptions,
  getOptionValue,
} from '@/features/system-settings/hooks/use-system-options'
import { getPricingForModel, type PricingDisplayInfo } from '../lib/pricing-utils'

export type RawPricingMaps = {
  ModelPrice: string
  ModelRatio: string
  CompletionRatio: string
  CacheRatio: string
  CreateCacheRatio: string
  ImageRatio: string
  AudioRatio: string
  AudioCompletionRatio: string
  'billing_setting.billing_mode': string
  'billing_setting.billing_expr': string
}

export function usePricingMap() {
  const { data: systemOptionsData, isLoading, error } = useSystemOptions()

  const defaultModelSettings: RawPricingMaps = {
    ModelPrice: '{}',
    ModelRatio: '{}',
    CompletionRatio: '{}',
    CacheRatio: '{}',
    CreateCacheRatio: '{}',
    ImageRatio: '{}',
    AudioRatio: '{}',
    AudioCompletionRatio: '{}',
    'billing_setting.billing_mode': '{}',
    'billing_setting.billing_expr': '{}',
  }

  const rawMaps = useMemo(() => {
    if (!systemOptionsData?.data) return defaultModelSettings
    return getOptionValue(systemOptionsData.data, defaultModelSettings)
  }, [systemOptionsData])

  const pricingMap = useMemo(() => {
    const map = new Map<string, PricingDisplayInfo>()
    
    // We can extract all distinct model names that have a price or ratio set
    // to build our pricing map.
    const allModelsSet = new Set<string>()
    
    try {
      const priceMap = JSON.parse(rawMaps.ModelPrice || '{}')
      Object.keys(priceMap).forEach(k => allModelsSet.add(k))
    } catch {}

    try {
      const ratioMap = JSON.parse(rawMaps.ModelRatio || '{}')
      Object.keys(ratioMap).forEach(k => allModelsSet.add(k))
    } catch {}

    try {
      const billingExprMap = JSON.parse(rawMaps['billing_setting.billing_expr'] || '{}')
      Object.keys(billingExprMap).forEach(k => allModelsSet.add(k))
    } catch {}

    allModelsSet.forEach((modelName) => {
      map.set(modelName, getPricingForModel(modelName, rawMaps))
    })

    return map
  }, [rawMaps])

  return {
    pricingMap,
    rawMaps,
    isLoading,
    error,
  }
}
