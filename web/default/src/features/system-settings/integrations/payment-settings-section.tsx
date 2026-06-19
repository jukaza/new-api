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
import * as React from 'react'
import * as z from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Code2, Eye, Copy, Check, Landmark, Settings, Wallet, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import {
  SettingsForm,
} from '../components/settings-form-layout'
import { SettingsPageFormActions } from '../components/settings-page-context'
import { SettingsSection } from '../components/settings-section'
import { useUpdateOption } from '../hooks/use-update-option'
import { safeNumberFieldProps } from '../utils/numeric-field'
import { AmountDiscountVisualEditor } from './amount-discount-visual-editor'
import { AmountOptionsVisualEditor } from './amount-options-visual-editor'
import {
  formatJsonForEditor,
  getJsonError,
  normalizeJsonForComparison,
} from './utils'

// Popular VietQR bank configurations
const SUPPORTED_BANKS = [
  { code: 'MB', name: 'MB Bank - Ngân hàng Quân Đội', color: '#0054a6' },
  { code: 'VCB', name: 'Vietcombank - Ngân hàng Ngoại Thương', color: '#74b22e' },
  { code: 'TCB', name: 'Techcombank - Ngân hàng Kỹ Thương', color: '#ee3124' },
  { code: 'ICB', name: 'VietinBank - Ngân hàng Công Thương', color: '#008542' },
  { code: 'BIDV', name: 'BIDV - Ngân hàng Đầu tư và Phát triển', color: '#005294' },
  { code: 'ACB', name: 'ACB - Ngân hàng Á Châu', color: '#00529c' },
  { code: 'VPB', name: 'VPBank - Ngân hàng Thịnh Vượng', color: '#009540' },
  { code: 'TPB', name: 'TPBank - Ngân hàng Tiên Phong', color: '#5c2a74' },
  { code: 'STB', name: 'Sacombank - Ngân hàng Sài Gòn Thương Tín', color: '#005695' },
  { code: 'VIB', name: 'VIB - Ngân hàng Quốc Tế', color: '#0066b3' },
  { code: 'MSB', name: 'MSB - Ngân hàng Hàng Hải', color: '#f37021' },
  { code: 'SHB', name: 'SHB - Ngân hàng Sài Gòn - Hà Nội', color: '#0054a5' },
  { code: 'HDB', name: 'HDBank - Ngân hàng Phát triển TP.HCM', color: '#f58220' },
  { code: 'VBA', name: 'Agribank - Ngân hàng Nông nghiệp', color: '#9b2b2c' },
]

const BANK_NAMES = SUPPORTED_BANKS.reduce((acc, curr) => {
  acc[curr.code] = curr.name.split(' - ')[0]
  return acc
}, {} as Record<string, string>)

const BANK_COLORS = SUPPORTED_BANKS.reduce((acc, curr) => {
  acc[curr.code] = curr.color
  return acc
}, {} as Record<string, string>)

const paymentSchema = z.object({
  PayAddress: z.string().optional(),
  EpayId: z.string().optional(),
  EpayKey: z.string().optional(),
  Price: z.coerce.number().min(0),
  MinTopUp: z.coerce.number().min(0),
  CustomCallbackAddress: z.string().optional(),
  AmountOptions: z.string().superRefine((value, ctx) => {
    const error = getJsonError(value, (parsed) => Array.isArray(parsed))
    if (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: error,
      })
    }
  }),
  AmountDiscount: z.string().superRefine((value, ctx) => {
    const error = getJsonError(
      value,
      (parsed) =>
        !!parsed && typeof parsed === 'object' && !Array.isArray(parsed)
    )
    if (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: error,
      })
    }
  }),
})

type PaymentFormValues = z.infer<typeof paymentSchema>

type PaymentSettingsSectionProps = {
  defaultValues: {
    PayAddress: string
    EpayId: string
    EpayKey: string
    Price: number
    MinTopUp: number
    CustomCallbackAddress: string
    PayMethods: string
    AmountOptions: string
    AmountDiscount: string
  }
}

export function PaymentSettingsSection({
  defaultValues,
}: PaymentSettingsSectionProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const updateOption = useUpdateOption()
  const [copiedWebhook, setCopiedWebhook] = React.useState(false)

  const initialFormValues = React.useMemo<PaymentFormValues>(
    () => ({
      PayAddress: defaultValues.PayAddress || 'MB',
      EpayId: defaultValues.EpayId || '',
      EpayKey: defaultValues.EpayKey || '',
      Price: defaultValues.Price || 25000,
      MinTopUp: defaultValues.MinTopUp || 10000,
      CustomCallbackAddress: defaultValues.CustomCallbackAddress || '',
      AmountOptions: defaultValues.AmountOptions || '[]',
      AmountDiscount: defaultValues.AmountDiscount || '{}',
    }),
    [defaultValues]
  )

  const initialRef = React.useRef(initialFormValues)
  const defaultsSignature = React.useMemo(
    () => JSON.stringify(initialFormValues),
    [initialFormValues]
  )

  const [amountOptionsVisualMode, setAmountOptionsVisualMode] =
    React.useState(true)
  const [amountDiscountVisualMode, setAmountDiscountVisualMode] =
    React.useState(true)

  // Get active Webhook URL
  const webhookUrl = React.useMemo(() => {
    if (typeof window === 'undefined') return ''
    return `${window.location.origin}/api/user/sepay/notify`
  }, [])

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl)
    setCopiedWebhook(true)
    toast.success(t('Copied Webhook URL'))
    setTimeout(() => setCopiedWebhook(false), 2000)
  }

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema) as Resolver<PaymentFormValues>,
    mode: 'onChange',
    defaultValues: {
      ...initialFormValues,
      AmountOptions: formatJsonForEditor(initialFormValues.AmountOptions),
      AmountDiscount: formatJsonForEditor(initialFormValues.AmountDiscount),
    },
  })

  const { isSubmitting } = form.formState

  React.useEffect(() => {
    const parsedDefaults = JSON.parse(defaultsSignature) as PaymentFormValues
    initialRef.current = parsedDefaults
    form.reset({
      ...parsedDefaults,
      AmountOptions: formatJsonForEditor(parsedDefaults.AmountOptions),
      AmountDiscount: formatJsonForEditor(parsedDefaults.AmountDiscount),
    })
  }, [defaultsSignature, form])

  const onSubmit = async (values: PaymentFormValues) => {
    // Automatically generate clean payment method config based on the selected bank
    const selectedBankCode = values.PayAddress || 'MB'
    const friendlyBankName = BANK_NAMES[selectedBankCode] || 'Ngân hàng'
    const bankColor = BANK_COLORS[selectedBankCode] || '#0ea5e9'

    const generatedPayMethods = JSON.stringify([
      {
        name: `Chuyển khoản ${friendlyBankName}`,
        type: 'sepay',
        color: bankColor,
      }
    ], null, 2)

    const sanitized = {
      PayAddress: (values.PayAddress || '').trim(),
      EpayId: (values.EpayId || '').trim(),
      EpayKey: (values.EpayKey || '').trim(),
      Price: values.Price,
      MinTopUp: values.MinTopUp,
      CustomCallbackAddress: (values.CustomCallbackAddress || '').trim().toUpperCase(),
      PayMethods: generatedPayMethods,
      AmountOptions: (values.AmountOptions || '').trim(),
      AmountDiscount: (values.AmountDiscount || '').trim(),
    }

    const initial = {
      PayAddress: (initialRef.current.PayAddress || '').trim(),
      EpayId: (initialRef.current.EpayId || '').trim(),
      EpayKey: (initialRef.current.EpayKey || '').trim(),
      Price: initialRef.current.Price,
      MinTopUp: initialRef.current.MinTopUp,
      CustomCallbackAddress: (initialRef.current.CustomCallbackAddress || '').trim().toUpperCase(),
      PayMethods: defaultValues.PayMethods || '',
      AmountOptions: (initialRef.current.AmountOptions || '').trim(),
      AmountDiscount: (initialRef.current.AmountDiscount || '').trim(),
    }

    const updates: Array<{ key: string; value: string | number | boolean }> = []

    if (sanitized.PayAddress !== initial.PayAddress) {
      updates.push({ key: 'PayAddress', value: sanitized.PayAddress })
    }
    if (sanitized.EpayId !== initial.EpayId) {
      updates.push({ key: 'EpayId', value: sanitized.EpayId })
    }
    if (sanitized.EpayKey && sanitized.EpayKey !== initial.EpayKey) {
      updates.push({ key: 'EpayKey', value: sanitized.EpayKey })
    }
    if (sanitized.Price !== initial.Price) {
      updates.push({ key: 'Price', value: sanitized.Price })
      updates.push({ key: 'USDExchangeRate', value: sanitized.Price })
      updates.push({ key: 'general_setting.custom_currency_exchange_rate', value: sanitized.Price })
    }
    if (sanitized.MinTopUp !== initial.MinTopUp) {
      updates.push({ key: 'MinTopUp', value: sanitized.MinTopUp })
    }
    if (sanitized.CustomCallbackAddress !== initial.CustomCallbackAddress) {
      updates.push({
        key: 'CustomCallbackAddress',
        value: sanitized.CustomCallbackAddress,
      })
    }
    if (
      normalizeJsonForComparison(sanitized.PayMethods) !==
      normalizeJsonForComparison(initial.PayMethods)
    ) {
      updates.push({ key: 'PayMethods', value: sanitized.PayMethods })
    }
    if (
      normalizeJsonForComparison(sanitized.AmountOptions) !==
      normalizeJsonForComparison(initial.AmountOptions)
    ) {
      updates.push({
        key: 'payment_setting.amount_options',
        value: sanitized.AmountOptions,
      })
    }
    if (
      normalizeJsonForComparison(sanitized.AmountDiscount) !==
      normalizeJsonForComparison(initial.AmountDiscount)
    ) {
      updates.push({
        key: 'payment_setting.amount_discount',
        value: sanitized.AmountDiscount,
      })
    }

    if (updates.length === 0) {
      toast.info(t('No changes to save'))
      return
    }

    try {
      for (const update of updates) {
        await updateOption.mutateAsync(update)
      }
      toast.success(t('Đã lưu cấu hình cổng thanh toán SePay thành công!'))
      queryClient.invalidateQueries({ queryKey: ['system-options'] })
    } catch (error) {
      toast.error(t('Lỗi khi lưu cấu hình'))
    }
  }

  return (
    <SettingsSection title={t('Cổng thanh toán tự động SePay')}>
      <Form {...form}>
        <SettingsForm
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6'
          data-no-autosubmit='true'
        >
          <SettingsPageFormActions
            onSave={form.handleSubmit(onSubmit)}
            isSaving={updateOption.isPending || isSubmitting}
            saveLabel='Lưu cài đặt SePay'
          />

          <div className='grid gap-6 lg:grid-cols-2'>
            {/* COLUMN 1: BANK ACCOUNT DETAILS */}
            <div className='rounded-xl border bg-card/30 p-5 space-y-4 shadow-xs'>
              <div className='flex items-center gap-2 pb-2 border-b'>
                <Landmark className='h-5 w-5 text-blue-600' />
                <h3 className='font-bold text-[15px]'>{t('Tài khoản Ngân hàng nhận tiền')}</h3>
              </div>

              <FormField
                control={form.control}
                name='PayAddress'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Chọn Ngân hàng')}</FormLabel>
                    <FormControl>
                      <NativeSelect {...field} className='w-full'>
                        {SUPPORTED_BANKS.map((bank) => (
                          <NativeSelectOption key={bank.code} value={bank.code}>
                            {bank.name}
                          </NativeSelectOption>
                        ))}
                      </NativeSelect>
                    </FormControl>
                    <FormDescription>
                      {t('Ngân hàng tạo mã QR VietQR nhận tiền chuyển khoản.')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='EpayId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Số tài khoản ngân hàng')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ví dụ: 0987654321'
                        className='font-mono font-medium'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('Số tài khoản nhận tiền chuyển khoản.')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='CustomCallbackAddress'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Tên chủ tài khoản ngân hàng')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ví dụ: NGUYEN VAN A'
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('Tên viết hoa không dấu của chủ tài khoản.')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* COLUMN 2: SEPAY Webhook & Token API */}
            <div className='rounded-xl border bg-card/30 p-5 space-y-4 shadow-xs'>
              <div className='flex items-center gap-2 pb-2 border-b'>
                <Settings className='h-5 w-5 text-indigo-600' />
                <h3 className='font-bold text-[15px]'>{t('Tích hợp kết nối SePay')}</h3>
              </div>

              <FormField
                control={form.control}
                name='EpayKey'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('API Key / Webhook Token')}</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Nhập API Key hoặc token bảo mật webhook của SePay'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('Token xác thực gửi kèm trong header từ SePay để đối soát giao dịch an toàn.')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* READ-ONLY Webhook URL for copy-paste */}
              <div className='space-y-2 pt-2'>
                <FormLabel className='text-sm font-medium'>{t('Đường dẫn Webhook (Webhook URL)')}</FormLabel>
                <div className='flex items-center gap-2 bg-muted/60 border rounded-lg p-2.5 font-mono text-xs text-muted-foreground select-all'>
                  <span className='flex-1 truncate'>{webhookUrl}</span>
                  <Button
                    type='button'
                    size='icon'
                    variant='ghost'
                    onClick={copyWebhookUrl}
                    className='h-7 w-7 text-muted-foreground hover:text-foreground shrink-0'
                  >
                    {copiedWebhook ? <Check className='h-3.5 w-3.5 text-green-600' /> : <Copy className='h-3.5 w-3.5' />}
                  </Button>
                </div>
                <FormDescription>
                  {t('Copy link này dán vào cấu hình Webhooks trên trang Dashboard của SePay.vn.')}
                </FormDescription>
              </div>
            </div>
          </div>

          {/* SECTION 3: PRICING, LIMITS & PRESETS */}
          <div className='rounded-xl border bg-card/30 p-5 space-y-5 shadow-xs'>
            <div className='flex items-center gap-2 pb-2 border-b'>
              <Wallet className='h-5 w-5 text-emerald-600' />
              <h3 className='font-bold text-[15px]'>{t('Hạn mức, Mốc nạp & Khuyến mãi')}</h3>
            </div>

            <div className='grid gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='Price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Giá bán mỗi 500.000 Quota (VND)')}</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='1'
                        min={0}
                        {...safeNumberFieldProps(field)}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('Số tiền VND tương ứng với 500.000 đơn vị Quota số dư hệ thống (mặc định: 25000đ).')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='MinTopUp'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Mức nạp tối thiểu (VND)')}</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='1'
                        min={0}
                        {...safeNumberFieldProps(field)}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('Số tiền nạp tối thiểu bằng VND (ví dụ: 10000 đ).')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid gap-6 md:grid-cols-2 md:items-start'>
              <FormField
                control={form.control}
                name='AmountOptions'
                render={({ field }) => (
                  <FormItem>
                    <div className='mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                      <FormLabel>{t('Các mốc nạp gợi ý')}</FormLabel>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() =>
                          setAmountOptionsVisualMode(!amountOptionsVisualMode)
                        }
                        className='w-full sm:w-auto h-7 text-xs px-2.5'
                      >
                        {amountOptionsVisualMode ? (
                          <>
                            <Code2 className='mr-1.5 h-3 w-3' />
                            {t('JSON Editor')}
                          </>
                        ) : (
                          <>
                            <Eye className='mr-1.5 h-3 w-3' />
                            {t('Visual Editor')}
                          </>
                        )}
                      </Button>
                    </div>
                    <FormControl>
                      {amountOptionsVisualMode ? (
                        <AmountOptionsVisualEditor
                          value={field.value}
                          onChange={field.onChange}
                        />
                      ) : (
                        <Textarea
                          rows={4}
                          placeholder='[50000, 100000, 200000, 500000]'
                          {...field}
                          onChange={(event) =>
                            field.onChange(event.target.value)
                          }
                        />
                      )}
                    </FormControl>
                    <FormDescription>
                      {t('Mảng JSON của các mốc nạp nhanh VND gợi ý hiển thị cho khách.')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='AmountDiscount'
                render={({ field }) => (
                  <FormItem>
                    <div className='mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                      <FormLabel>{t('Khuyến mãi giảm giá / Tặng thêm')}</FormLabel>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() =>
                          setAmountDiscountVisualMode(!amountDiscountVisualMode)
                        }
                        className='w-full sm:w-auto h-7 text-xs px-2.5'
                      >
                        {amountDiscountVisualMode ? (
                          <>
                            <Code2 className='mr-1.5 h-3 w-3' />
                            {t('JSON Editor')}
                          </>
                        ) : (
                          <>
                            <Eye className='mr-1.5 h-3 w-3' />
                            {t('Visual Editor')}
                          </>
                        )}
                      </Button>
                    </div>
                    <FormControl>
                      {amountDiscountVisualMode ? (
                        <AmountDiscountVisualEditor
                          value={field.value}
                          onChange={field.onChange}
                        />
                      ) : (
                        <Textarea
                          rows={4}
                          placeholder='{"100000":0.95,"200000":0.9}'
                          {...field}
                          onChange={(event) =>
                            field.onChange(event.target.value)
                          }
                        />
                      )}
                    </FormControl>
                    <FormDescription>
                      {t('Tỷ lệ chiết khấu (ví dụ: nạp 100k chỉ cần trả 95k -> {"100000": 0.95}).')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </SettingsForm>
      </Form>
    </SettingsSection>
  )
}
