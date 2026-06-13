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
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Pencil, Plus, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { usePricingMap } from '@/features/models/hooks/use-pricing-map'
import { PricingEditPopover } from '@/features/models/components/pricing-edit-popover'
import { formatPriceCompact } from '@/features/models/lib/pricing-utils'
import { cn } from '@/lib/utils'

type ModelPricingSummaryProps = {
  selectedModels: string[]
  className?: string
}

export function ModelPricingSummary({
  selectedModels,
  className,
}: ModelPricingSummaryProps) {
  const { t } = useTranslation()
  const { pricingMap, isLoading } = usePricingMap()
  const [isOpen, setIsOpen] = useState(true)

  // Count models without pricing configured
  const notSetModels = selectedModels.filter((modelName) => {
    const pricing = pricingMap?.get(modelName)
    return !pricing || pricing.mode === 'not-set'
  })

  const notSetCount = notSetModels.length

  // Auto-expand if there are models without pricing when models selection changes
  useEffect(() => {
    if (notSetCount > 0) {
      setIsOpen(true)
    }
  }, [notSetCount])

  if (selectedModels.length === 0 || isLoading) {
    return null
  }

  return (
    <div
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-xs overflow-hidden mt-3 transition-all',
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between p-3 cursor-pointer bg-muted/40 hover:bg-muted/60 select-none transition-colors border-b',
          !isOpen && 'border-b-0'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {t('💰 Model Pricing')}
          </span>
          {notSetCount > 0 ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="size-3" />
              {t('{{count}} models not configured', { count: notSetCount })}
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              {t('All configured')}
            </span>
          )}
        </div>
        <button type="button" className="text-muted-foreground hover:text-foreground">
          {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>
      </div>

      {/* Table Body */}
      {isOpen && (
        <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/20 text-muted-foreground font-medium">
                <th className="p-2.5 pl-3 w-1/2">{t('Model')}</th>
                <th className="p-2.5">{t('Pricing Type')}</th>
                <th className="p-2.5 text-right pr-3">{t('Price')}</th>
              </tr>
            </thead>
            <tbody>
              {selectedModels.map((modelName) => {
                const pricing = pricingMap?.get(modelName) || { mode: 'not-set' as const }
                const isNotSet = pricing.mode === 'not-set'

                return (
                  <tr
                    key={modelName}
                    className={cn(
                      'border-b last:border-b-0 hover:bg-accent/40 transition-colors',
                      isNotSet && 'bg-amber-500/5 dark:bg-amber-500/[0.03]'
                    )}
                  >
                    <td className="p-2.5 pl-3 font-medium flex items-center gap-2 truncate max-w-[200px]">
                      {isNotSet && (
                        <AlertTriangle className="size-3.5 text-amber-500 shrink-0" />
                      )}
                      <span className="truncate">{modelName}</span>
                    </td>
                    <td className="p-2.5 text-muted-foreground">
                      {pricing.mode === 'per-token' && t('Per Token')}
                      {pricing.mode === 'per-request' && t('Per Request')}
                      {pricing.mode === 'expression' && t('Expression')}
                      {pricing.mode === 'not-set' && (
                        <span className="text-amber-500 font-medium">
                          {t('Not Set')}
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 text-right pr-3 font-mono">
                      <PricingEditPopover modelName={modelName} initialPricing={pricing}>
                        <button
                          type="button"
                          className={cn(
                            'group inline-flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors cursor-pointer border border-transparent hover:border-border hover:bg-accent',
                            isNotSet
                              ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
                              : 'text-foreground'
                          )}
                        >
                          {isNotSet ? (
                            <>
                              <Plus className="size-3" />
                              <span>{t('Set Price')}</span>
                            </>
                          ) : (
                            <>
                              <span>{formatPriceCompact(pricing)}</span>
                              <Pencil className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </>
                          )}
                        </button>
                      </PricingEditPopover>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
