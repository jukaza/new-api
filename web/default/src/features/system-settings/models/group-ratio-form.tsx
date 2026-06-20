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
import { memo } from 'react'
import { type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { SettingsPageActionsPortal } from '../components/settings-page-context'
import { SimpleGroupDiscountEditor } from './group-ratio-visual-editor'

// Simplified group model: only GroupRatio (multiplier) + UserUsableGroups (description)
// are actively managed. The remaining keys are kept in the schema for backward
// compatibility but are no longer exposed in the UI.
type GroupFormValues = {
  GroupRatio: string
  UserUsableGroups: string
  // legacy fields — kept so the form type matches what ratio-settings-card passes
  TopupGroupRatio: string
  GroupGroupRatio: string
  AutoGroups: string
  DefaultUseAutoGroup: boolean
  GroupSpecialUsableGroup: string
}

type GroupRatioFormProps = {
  form: UseFormReturn<GroupFormValues>
  onSave: (values: GroupFormValues) => Promise<void>
  isSaving: boolean
}

export const GroupRatioForm = memo(function GroupRatioForm({
  form,
  onSave,
  isSaving,
}: GroupRatioFormProps) {
  const { t } = useTranslation()

  return (
    <div className='space-y-6'>
      <Form {...form}>
        <SettingsPageActionsPortal>
          <Button
            type='button'
            size='sm'
            onClick={form.handleSubmit(onSave)}
            disabled={isSaving}
          >
            {isSaving ? t('Saving...') : t('Save group ratios')}
          </Button>
        </SettingsPageActionsPortal>

        <SimpleGroupDiscountEditor
          groupRatio={form.watch('GroupRatio')}
          userUsableGroups={form.watch('UserUsableGroups')}
          onChange={(field, value) =>
            form.setValue(field as keyof GroupFormValues, value, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
        />
      </Form>
    </div>
  )
})