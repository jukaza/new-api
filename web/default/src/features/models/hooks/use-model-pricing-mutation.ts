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
import { useState } from 'react'
import { useUpdateOption } from '@/features/system-settings/hooks/use-update-option'
import { normalizeJsonString } from '@/features/system-settings/models/utils'
import { safeJsonParse } from '@/features/system-settings/utils/json-parser'
import { usePricingMap, type RawPricingMaps } from './use-pricing-map'
import { priceToRatio } from '../lib/pricing-utils'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

export type PricingUpdateData = {
  mode: 'per-token' | 'per-request' | 'clear'
  inputPrice?: number    // $/1M tokens (will convert to ratio)
  outputPrice?: number   // $/1M tokens (will convert to completionRatio)
  requestPrice?: number  // $/request
}

export function useModelPricingMutation() {
  const { rawMaps } = usePricingMap()
  const updateOption = useUpdateOption()
  const [isUpdating, setIsUpdating] = useState(false)
  const queryClient = useQueryClient()

  const updatePricing = async (modelName: string, data: PricingUpdateData) => {
    setIsUpdating(true)
    try {
      // Parse current maps
      const priceMap = safeJsonParse<Record<string, number>>(rawMaps.ModelPrice || '{}', { fallback: {}, silent: true })
      const ratioMap = safeJsonParse<Record<string, number>>(rawMaps.ModelRatio || '{}', { fallback: {}, silent: true })
      const completionMap = safeJsonParse<Record<string, number>>(rawMaps.CompletionRatio || '{}', { fallback: {}, silent: true })
      const cacheMap = safeJsonParse<Record<string, number>>(rawMaps.CacheRatio || '{}', { fallback: {}, silent: true })
      const createCacheMap = safeJsonParse<Record<string, number>>(rawMaps.CreateCacheRatio || '{}', { fallback: {}, silent: true })
      const imageMap = safeJsonParse<Record<string, number>>(rawMaps.ImageRatio || '{}', { fallback: {}, silent: true })
      const audioMap = safeJsonParse<Record<string, number>>(rawMaps.AudioRatio || '{}', { fallback: {}, silent: true })
      const audioCompletionMap = safeJsonParse<Record<string, number>>(rawMaps.AudioCompletionRatio || '{}', { fallback: {}, silent: true })

      // Always clear the model from all maps first to prevent outdated configuration
      delete priceMap[modelName]
      delete ratioMap[modelName]
      delete completionMap[modelName]
      delete cacheMap[modelName]
      delete createCacheMap[modelName]
      delete imageMap[modelName]
      delete audioMap[modelName]
      delete audioCompletionMap[modelName]

      if (data.mode === 'per-request' && data.requestPrice !== undefined) {
        priceMap[modelName] = data.requestPrice
      } else if (data.mode === 'per-token' && data.inputPrice !== undefined) {
        ratioMap[modelName] = priceToRatio(data.inputPrice)
        if (data.outputPrice !== undefined && data.inputPrice > 0) {
          const compRatio = data.outputPrice / data.inputPrice
          // Only save completionRatio if it differs from 1.0 (optionally) or save it anyway
          completionMap[modelName] = compRatio
        }
      }

      // Build list of options that need updates
      const updates: Array<{ key: string; value: string }> = []

      const checkAndUpdate = (key: keyof RawPricingMaps, newMapObj: Record<string, number>) => {
        const newValue = normalizeJsonString(JSON.stringify(newMapObj))
        const oldValue = normalizeJsonString(rawMaps[key] || '{}')
        if (newValue !== oldValue) {
          updates.push({ key, value: newValue })
        }
      }

      checkAndUpdate('ModelPrice', priceMap)
      checkAndUpdate('ModelRatio', ratioMap)
      checkAndUpdate('CompletionRatio', completionMap)
      checkAndUpdate('CacheRatio', cacheMap)
      checkAndUpdate('CreateCacheRatio', createCacheMap)
      checkAndUpdate('ImageRatio', imageMap)
      checkAndUpdate('AudioRatio', audioMap)
      checkAndUpdate('AudioCompletionRatio', audioCompletionMap)

      // Apply updates sequentially to prevent race conditions
      for (const update of updates) {
        await updateOption.mutateAsync(update)
      }

      // Invalidate pricing caches
      queryClient.invalidateQueries({ queryKey: ['system-options'] })
      queryClient.invalidateQueries({ queryKey: ['pricing'] })
      
      toast.success('Successfully updated model pricing')
    } catch (err: any) {
      console.error('Failed to update model pricing', err)
      toast.error('Failed to update model pricing')
      throw err
    } finally {
      setIsUpdating(false)
    }
  }

  return {
    updatePricing,
    isUpdating,
  }
}
