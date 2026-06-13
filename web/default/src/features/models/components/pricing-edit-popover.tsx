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
import { useState, useEffect, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { type PricingDisplayInfo } from '../lib/pricing-utils'
import { useModelPricingMutation } from '../hooks/use-model-pricing-mutation'
import { cn } from '@/lib/utils'

type PricingEditPopoverProps = {
  modelName: string
  initialPricing?: PricingDisplayInfo
  children: React.ReactElement
}

export function PricingEditPopover({
  modelName,
  initialPricing,
  children,
}: PricingEditPopoverProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const { updatePricing, isUpdating } = useModelPricingMutation()

  // Form states
  const [mode, setMode] = useState<'per-token' | 'per-request'>('per-token')
  const [inputPrice, setInputPrice] = useState('')
  const [outputPrice, setOutputPrice] = useState('')
  const [requestPrice, setRequestPrice] = useState('')

  // Initialize values when popover opens or initialPricing changes
  useEffect(() => {
    if (open) {
      if (initialPricing && initialPricing.mode !== 'not-set') {
        if (initialPricing.mode === 'per-request') {
          setMode('per-request')
          setRequestPrice(initialPricing.requestPrice?.toString() || '')
          setInputPrice('')
          setOutputPrice('')
        } else if (initialPricing.mode === 'per-token' || initialPricing.mode === 'expression') {
          setMode('per-token')
          setInputPrice(initialPricing.inputPrice?.toString() || '')
          setOutputPrice(initialPricing.outputPrice?.toString() || '')
          setRequestPrice('')
        }
      } else {
        setMode('per-token')
        setInputPrice('')
        setOutputPrice('')
        setRequestPrice('')
      }
    }
  }, [open, initialPricing])

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    try {
      if (mode === 'per-token') {
        const inp = parseFloat(inputPrice)
        const out = parseFloat(outputPrice)
        if (isNaN(inp) || inp < 0) {
          return
        }
        await updatePricing(modelName, {
          mode: 'per-token',
          inputPrice: inp,
          outputPrice: isNaN(out) || out < 0 ? inp : out,
        })
      } else {
        const req = parseFloat(requestPrice)
        if (isNaN(req) || req < 0) {
          return
        }
        await updatePricing(modelName, {
          mode: 'per-request',
          requestPrice: req,
        })
      }
      setOpen(false)
    } catch (err) {
      // Error handled in hook
    }
  }

  const handleClear = async () => {
    try {
      await updatePricing(modelName, { mode: 'clear' })
      setOpen(false)
    } catch (err) {
      // Error handled in hook
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={children} />
      <PopoverContent className="w-80 p-4" align="start">
        <PopoverHeader className="mb-3">
          <PopoverTitle className="text-base font-semibold truncate max-w-full">
            {t('Edit Pricing: {{name}}', { name: modelName })}
          </PopoverTitle>
        </PopoverHeader>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          {/* Mode Switcher */}
          <div className="flex rounded-md bg-muted p-1 w-full gap-1">
            <button
              type="button"
              disabled={isUpdating}
              className={cn(
                'flex-1 text-center py-1.5 text-xs font-medium rounded-sm transition-all',
                mode === 'per-token'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => setMode('per-token')}
            >
              {t('Per Token')}
            </button>
            <button
              type="button"
              disabled={isUpdating}
              className={cn(
                'flex-1 text-center py-1.5 text-xs font-medium rounded-sm transition-all',
                mode === 'per-request'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => setMode('per-request')}
            >
              {t('Per Request')}
            </button>
          </div>

          {/* Form Fields */}
          {mode === 'per-token' ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="inputPrice" className="text-xs">
                  {t('Input Price ($/1M tokens)')}
                </Label>
                <Input
                  id="inputPrice"
                  type="number"
                  step="any"
                  min="0"
                  required
                  placeholder="0.00"
                  value={inputPrice}
                  onChange={(e) => setInputPrice(e.target.value)}
                  disabled={isUpdating}
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="outputPrice" className="text-xs">
                  {t('Output Price ($/1M tokens)')}
                </Label>
                <Input
                  id="outputPrice"
                  type="number"
                  step="any"
                  min="0"
                  placeholder={inputPrice || '0.00'}
                  value={outputPrice}
                  onChange={(e) => setOutputPrice(e.target.value)}
                  disabled={isUpdating}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">
                * {t('Internally converted to ModelRatio = Price / 2')}
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="requestPrice" className="text-xs">
                  {t('Price Per Request ($)')}
                </Label>
                <Input
                  id="requestPrice"
                  type="number"
                  step="any"
                  min="0"
                  required
                  placeholder="0.00"
                  value={requestPrice}
                  onChange={(e) => setRequestPrice(e.target.value)}
                  disabled={isUpdating}
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between border-t pt-3 mt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs text-destructive hover:text-destructive-foreground hover:bg-destructive"
              onClick={handleClear}
              disabled={isUpdating}
            >
              {t('Clear Price')}
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => setOpen(false)}
                disabled={isUpdating}
              >
                {t('Cancel')}
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs min-w-[60px]"
                disabled={isUpdating}
              >
                {isUpdating ? <Spinner className="size-3 mr-1" /> : null}
                {t('Save')}
              </Button>
            </div>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
