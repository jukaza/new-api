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
import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ModelMappingEditor } from '@/features/channels/components/model-mapping-editor'

export function GlobalModelMappingSection() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [mappingValue, setMappingValue] = useState('')
  const [isDirty, setIsDirty] = useState(false)

  const { data: optionData, isLoading: isLoadingOption } = useQuery({
    queryKey: ['option', 'GlobalModelMapping'],
    queryFn: async () => {
      const response = await fetch('/api/option')
      if (!response.ok) throw new Error('Failed to fetch option')
      const data = await response.json() as Record<string, string>
      return data.GlobalModelMapping ?? ''
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (value: string) => {
      const response = await fetch('/api/option', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'GlobalModelMapping',
          value,
        }),
      })
      if (!response.ok) throw new Error('Failed to update option')
      return response.json()
    },
    onSuccess: () => {
      setIsDirty(false)
      queryClient.invalidateQueries({ queryKey: ['option', 'GlobalModelMapping'] })
    },
  })

  useEffect(() => {
    if (optionData !== undefined) {
      setMappingValue(optionData)
      setIsDirty(false)
    }
  }, [optionData])

  const handleChange = (value: string) => {
    setMappingValue(value)
    setIsDirty(true)
  }

  const handleSave = () => {
    updateMutation.mutate(mappingValue)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Global Model Mapping')}</CardTitle>
        <CardDescription>
          {t('Set default model mappings that apply to all channels. Channel-level mappings override global settings.')}
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {isLoadingOption ? (
          <div className='text-muted-foreground text-center py-8'>
            {t('Loading...')}
          </div>
        ) : (
          <>
            <ModelMappingEditor
              value={mappingValue}
              onChange={handleChange}
              disabled={updateMutation.isPending}
            />
            <div className='flex justify-end gap-2'>
              <Button
                variant='outline'
                onClick={() => {
                  if (optionData !== undefined) {
                    setMappingValue(optionData)
                    setIsDirty(false)
                  }
                }}
                disabled={!isDirty || updateMutation.isPending}
              >
                {t('Cancel')}
              </Button>
              <Button
                onClick={handleSave}
                disabled={!isDirty || updateMutation.isPending}
              >
                {updateMutation.isPending ? t('Saving...') : t('Save')}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
