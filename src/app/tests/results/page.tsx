'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Container } from '@/components'
import Button from '@/components/ui/Button'

export default function TestResultsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time to show the completion message
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleGoHome = () => router.push('/')

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4'></div>
          <p className='text-gray-600 font-medium'>
            Test natijalaringiz o&apos;rganilmoqda...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8 sm:py-12'>
      <Container size='md'>
        <div className='bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center'>
          {/* Success Icon */}
          <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6'>
            <svg
              className='w-8 h-8 text-green-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>
            Test muvaffaqiyatli yakunlandi!
          </h1>

          {/* Message */}
          <p className='text-gray-600 mb-2'>
            Testni yakunlaganingiz uchun rahmat. Javoblaringiz muvaffaqiyatli
            topshirildi.
          </p>

          {/* Additional Info */}
          <div className='bg-blue-50 rounded-lg p-4 mb-8'>
            <p className='text-blue-800 text-sm'>
              Test natijalaringiz qayd etildi va ko&apos;rib chiqiladi.
              Qo&apos;shimcha choralar zarur bo&apos;lsa, siz bilan
              bog&apos;lanamiz.
            </p>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto'>
            <Button onClick={handleGoHome} variant='primary' className='flex-1'>
              Bosh sahifaga o&apos;tish
            </Button>
          </div>

          {/* Contact Info */}
          <div className='mt-8 pt-6 border-t border-gray-200'>
            <p className='text-xs text-gray-500'>
              Test topshirish bilan bog&apos;liq savollaringiz bo&apos;lsa,
              qo&apos;llab-quvvatlash xizmatiga murojaat qiling.
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}
