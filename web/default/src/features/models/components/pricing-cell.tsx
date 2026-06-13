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
import { useTranslation } from 'react-i18next'
import { Pencil, Plus, Link } from 'lucide-react'
import { PricingEditPopover } from './pricing-edit-popover'
import { formatPriceCompact, type PricingDisplayInfo } from '../lib/pricing-utils'
import { Skeleton } from '@/components/ui/skeleton'

type PricingCellProps = {
  modelName: string
  pricingMap?: Map<string, PricingDisplayInfo>
  isLoading?: boolean
}

export function PricingCell({
  modelName,
  pricingMap,
  isLoading,
}: PricingCellProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return <Skeleton className="h-6 w-24" />
  }

  const pricing = pricingMap?.get(modelName) || { mode: 'not-set' as const }

  if (pricing.mode === 'not-set') {
    return (
      <PricingEditPopover modelName={modelName} initialPricing={pricing}>
        <button
          type="button"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition-colors cursor-pointer border border-transparent hover:border-amber-500/30"
        >
          <Plus className="size-3" />
          <span>{t('Set Price')}</span>
        </button>
      </PricingEditPopover>
    )
  }

  if (pricing.mode === 'expression') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 select-none">
        <Link className="size-3" />
        <span>{t('Expression')}</span>
      </span>
    )
  }

  const formattedPrice = formatPriceCompact(pricing)

  return (
    <PricingEditPopover modelName={modelName} initialPricing={pricing}>
      <button
        type="button"
        className="group inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-mono font-medium hover:bg-accent text-foreground transition-colors cursor-pointer border border-transparent hover:border-border"
      >
        <span>{formattedPrice}</span>
        <Pencil className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    </PricingEditPopover>
  )
}
