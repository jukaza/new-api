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
import { Settings, Zap, BarChart3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AnimateInView } from '@/components/animate-in-view'

export function HowItWorks() {
  const { t } = useTranslation()

  const steps = [
    {
      num: '1',
      title: 'Đăng ký tài khoản',
      desc: 'Tạo tài khoản miễn phí chỉ trong vài giây và nhận ngay hạn ngạch (quota) dùng thử.',
      icon: <Settings className='size-6' strokeWidth={1.5} />,
    },
    {
      num: '2',
      title: 'Nạp ví & Tạo khóa',
      desc: 'Nạp tiền tự động qua QR ngân hàng (SePay) để nhận quota và tạo các API Key theo nhu cầu.',
      icon: <Zap className='size-6' strokeWidth={1.5} />,
    },
    {
      num: '3',
      title: 'Tích hợp & Sử dụng',
      desc: 'Thay đổi API URL của bạn thành endpoint của chúng tôi và bắt đầu sử dụng các mô hình AI.',
      icon: <BarChart3 className='size-6' strokeWidth={1.5} />,
    },
  ]

  return (
    <section className='border-border/40 relative z-10 border-t px-6 py-24 md:py-32'>
      <div className='mx-auto max-w-6xl'>
        <AnimateInView className='mb-16 text-center md:mb-20'>
          <p className='text-muted-foreground mb-3 text-xs font-medium tracking-widest uppercase'>
            Quy trình hoạt động
          </p>
          <h2 className='text-2xl font-bold tracking-tight md:text-3xl'>
            3 Bước Đơn Giản Để Bắt Đầu
          </h2>
        </AnimateInView>

        <div className='grid gap-8 md:grid-cols-3 md:gap-12'>
          {steps.map((step, i) => (
            <AnimateInView
              key={step.num}
              delay={i * 150}
              animation='fade-up'
              className='relative flex flex-col items-center text-center'
            >
              <div className='relative mb-6'>
                <div className='text-muted-foreground border-border/50 bg-muted/30 flex size-16 items-center justify-center rounded-2xl border transition-colors'>
                  {step.icon}
                </div>
                <div className='bg-foreground text-background absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full text-xs font-bold'>
                  {step.num}
                </div>
              </div>
              <h3 className='mb-2 text-base font-semibold'>{step.title}</h3>
              <p className='text-muted-foreground max-w-[240px] text-sm leading-relaxed'>
                {step.desc}
              </p>
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  )
}
