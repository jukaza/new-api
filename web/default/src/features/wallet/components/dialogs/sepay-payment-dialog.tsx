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
import { useState, useEffect, useRef } from 'react'
import { Check, Copy, Loader2, CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface SePayPaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sepayData: {
    tradeNo: string
    amount: number
    bankName: string
    accountNumber: string
    accountName: string
    qrUrl: string
  } | null
  onSuccess: () => void
}

export function SePayPaymentDialog({
  open,
  onOpenChange,
  sepayData,
  onSuccess,
}: SePayPaymentDialogProps) {
  const { t } = useTranslation()
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success'>('pending')
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Copy to clipboard helper
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    toast.success(t('Copied to clipboard'))
    setTimeout(() => setCopiedField(null), 2000)
  }

  // Poll transaction status
  useEffect(() => {
    if (open && sepayData && paymentStatus === 'pending') {
      const pollStatus = async () => {
        try {
          const response = await fetch(`/api/user/topup/status/${sepayData.tradeNo}`)
          const result = await response.json()
          if (result.message === 'success' && result.status === 1) { // 1 means Success
            setPaymentStatus('success')
            toast.success(t('Payment completed successfully!'))
            onSuccess()
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current)
            }
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to check topup status:', error)
        }
      }

      // Start polling every 2.5 seconds
      pollingIntervalRef.current = setInterval(pollStatus, 2500)
      
      // Perform initial check immediately
      pollStatus()
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [open, sepayData, paymentStatus, onSuccess, t])

  // Reset status when modal closes
  useEffect(() => {
    if (!open) {
      setPaymentStatus('pending')
    }
  }, [open])

  if (!sepayData) return null

  // Format currency display (VND)
  const formatVnd = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-sm:w-[calc(100vw-1.5rem)] sm:max-w-md md:max-w-lg overflow-y-auto max-h-[90vh]'>
        {paymentStatus === 'success' ? (
          <div className='flex flex-col items-center justify-center py-8 text-center space-y-4'>
            <CheckCircle2 className='h-16 w-16 text-green-500 animate-bounce' />
            <DialogTitle className='text-2xl font-bold text-green-600'>
              {t('Nạp Tiền Thành Công!')}
            </DialogTitle>
            <DialogDescription className='text-base text-muted-foreground max-w-sm'>
              {t('Hệ thống đã nhận được tiền thanh toán. Số dư của bạn đã được cập nhật tự động.')}
            </DialogDescription>
            <div className='w-full max-w-xs p-4 bg-muted/30 border rounded-lg space-y-2 text-sm text-left'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>{t('Mã giao dịch:')}</span>
                <span className='font-mono font-medium'>{sepayData.tradeNo}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>{t('Số tiền nạp:')}</span>
                <span className='font-semibold text-green-600'>{formatVnd(sepayData.amount)}</span>
              </div>
            </div>
            <Button onClick={() => onOpenChange(false)} className='w-full max-w-xs mt-4'>
              {t('Đóng')}
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className='text-xl font-bold text-center sm:text-2xl'>
                {t('Chuyển Khoản Ngân Hàng')}
              </DialogTitle>
              <DialogDescription className='text-center text-muted-foreground'>
                {t('Quét mã VietQR bằng ứng dụng ngân hàng của bạn để thanh toán tự động')}
              </DialogDescription>
            </DialogHeader>

            <div className='flex flex-col items-center space-y-4 md:flex-row md:items-start md:space-x-6 md:space-y-0 py-2'>
              {/* QR Code container */}
              <div className='flex flex-col items-center justify-center p-3 border rounded-xl bg-white shadow-sm shrink-0 w-56'>
                <img
                  src={sepayData.qrUrl}
                  alt='VietQR Code'
                  className='w-48 h-48 object-contain'
                />
                <div className='mt-2 flex items-center justify-center space-x-1.5 text-xs text-blue-600 font-medium'>
                  <Loader2 className='h-3.5 w-3.5 animate-spin' />
                  <span>{t('Đang chờ thanh toán...')}</span>
                </div>
              </div>

              {/* Bank Transfer Details */}
              <div className='flex-1 w-full space-y-3'>
                <div className='rounded-lg bg-muted/40 border p-3.5 space-y-2.5 text-sm'>
                  {/* Bank Name */}
                  <div className='flex items-center justify-between'>
                    <div>
                      <div className='text-xs text-muted-foreground font-medium'>{t('Ngân hàng')}</div>
                      <div className='font-bold text-foreground text-[14px]'>{sepayData.bankName}</div>
                    </div>
                    <Button
                      size='icon'
                      variant='ghost'
                      onClick={() => copyToClipboard(sepayData.bankName, 'bank')}
                      className='h-8 w-8 text-muted-foreground hover:text-foreground shrink-0'
                    >
                      {copiedField === 'bank' ? <Check className='h-4 w-4 text-green-600' /> : <Copy className='h-4 w-4' />}
                    </Button>
                  </div>

                  {/* Account Number */}
                  <div className='flex items-center justify-between border-t pt-2.5'>
                    <div>
                      <div className='text-xs text-muted-foreground font-medium'>{t('Số tài khoản')}</div>
                      <div className='font-mono font-bold text-foreground text-[15px]'>{sepayData.accountNumber}</div>
                    </div>
                    <Button
                      size='icon'
                      variant='ghost'
                      onClick={() => copyToClipboard(sepayData.accountNumber, 'account')}
                      className='h-8 w-8 text-muted-foreground hover:text-foreground shrink-0'
                    >
                      {copiedField === 'account' ? <Check className='h-4 w-4 text-green-600' /> : <Copy className='h-4 w-4' />}
                    </Button>
                  </div>

                  {/* Account Name */}
                  <div className='flex items-center justify-between border-t pt-2.5'>
                    <div>
                      <div className='text-xs text-muted-foreground font-medium'>{t('Chủ tài khoản')}</div>
                      <div className='font-bold text-foreground text-[14px]'>{sepayData.accountName}</div>
                    </div>
                    <Button
                      size='icon'
                      variant='ghost'
                      onClick={() => copyToClipboard(sepayData.accountName, 'name')}
                      className='h-8 w-8 text-muted-foreground hover:text-foreground shrink-0'
                    >
                      {copiedField === 'name' ? <Check className='h-4 w-4 text-green-600' /> : <Copy className='h-4 w-4' />}
                    </Button>
                  </div>

                  {/* Transfer Amount */}
                  <div className='flex items-center justify-between border-t pt-2.5'>
                    <div>
                      <div className='text-xs text-muted-foreground font-medium'>{t('Số tiền chuyển')}</div>
                      <div className='font-bold text-green-600 text-[16px]'>{formatVnd(sepayData.amount)}</div>
                    </div>
                    <Button
                      size='icon'
                      variant='ghost'
                      onClick={() => copyToClipboard(sepayData.amount.toString(), 'amount')}
                      className='h-8 w-8 text-muted-foreground hover:text-foreground shrink-0'
                    >
                      {copiedField === 'amount' ? <Check className='h-4 w-4 text-green-600' /> : <Copy className='h-4 w-4' />}
                    </Button>
                  </div>

                  {/* Content / Description */}
                  <div className='flex items-center justify-between border-t pt-2.5 bg-yellow-500/10 -mx-3.5 px-3.5 pb-1 rounded-b-lg border-yellow-500/20'>
                    <div>
                      <div className='text-xs text-yellow-700 font-bold uppercase tracking-wider'>{t('Nội dung chuyển khoản')}</div>
                      <div className='font-mono font-bold text-yellow-900 text-[15px] select-all'>{sepayData.tradeNo}</div>
                    </div>
                    <Button
                      size='icon'
                      variant='ghost'
                      onClick={() => copyToClipboard(sepayData.tradeNo, 'content')}
                      className='h-8 w-8 text-yellow-700 hover:text-yellow-900 shrink-0 hover:bg-yellow-500/20'
                    >
                      {copiedField === 'content' ? <Check className='h-4 w-4 text-green-600' /> : <Copy className='h-4 w-4' />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className='rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-900/30 dark:bg-yellow-950/20 p-3.5 text-xs text-yellow-800 dark:text-yellow-400'>
              <ul className='list-disc pl-4 space-y-1.5 font-medium'>
                <li>
                  {t('Vui lòng quét mã QR hoặc copy đúng các thông tin, đặc biệt là')} <strong className='text-red-500 underline'>{t('Nội dung chuyển khoản')}</strong>.
                </li>
                <li>
                  {t('Hệ thống sẽ kiểm tra và cộng tiền tự động sau 1-3 phút kể từ khi tiền được chuyển thành công.')}
                </li>
              </ul>
            </div>

            <div className='flex justify-end space-x-2 pt-2'>
              <Button variant='outline' onClick={() => onOpenChange(false)} className='w-full sm:w-auto'>
                {t('Đóng')}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
