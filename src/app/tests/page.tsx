'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTestStore } from '@/store/testStore'
import { useEffect } from 'react'
import { Container, Button, LoadingSpinner } from '@/components'
import { fetch_test } from '@/utils/api_client'
import { JSX } from 'react'

const test_rules_test = [
  {
    strong: <>Ko&apos;chirmachilik qilmang:</>,
    text: (
      <>
        Ruxsatsiz manbalardan foydalanish yoki boshqalar bilan hamkorlik qilish
        kabi har qanday aldov taqiqlanadi va darhol diskvalifikatsiya qilinadi.
      </>
    ),
  },
  {
    strong: <>Tab/Ilova almashtirish mumkin emas:</>,
    text: (
      <>
        Boshqa oynalarga o&apos;tish, ilovalarni almashtirish yoki test
        oynasidan chiqish testning avtomatik bekor bo&apos;lishiga olib keladi.
      </>
    ),
  },
  {
    strong: <>To&apos;liq ekran rejimi:</>,
    text: (
      <>
        Test to&apos;liq ekran rejimida topshirilishi kerak. To&apos;liq
        ekrandan chiqish testni yakunlashga sabab bo&apos;ladi.
      </>
    ),
  },
  {
    strong: <>Vaqt cheklovi:</>,
    text: (
      <>
        Testni ajratilgan vaqt ichida yakunlang. Vaqt tugaganda test avtomatik
        topshiriladi.
      </>
    ),
  },
  {
    strong: <>Bitta urinish.</>,
    text: (
      <>
        Bu testni yakunlash uchun sizda faqat bitta urinish bor. Boshlanganidan
        so&apos;ng qayta boshlash mumkin emas.
      </>
    ),
  },
  {
    strong: <>Texnik talablar.</>,
    text: (
      <>
        Doimiy internetga ega bo&apos;ling. Test davomida yuzaga kelgan texnik
        muammolar qayta topshirishga ruxsat bermasligi mumkin.
      </>
    ),
  },
]

export default function TestInstructionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const testId = searchParams.get('id')
  const { currentTest, setError, setLoading, isLoading } = useTestStore()

  useEffect(() => {
    // If no test ID or no test data, redirect to home
    if (testId && !currentTest) handleFetchTest()
    if (!testId && !currentTest) {
      setError('Test ID da xato borga oxshaydi')
      router.push('/')
    }
  }, [testId, currentTest, router, setError])

  const handleFetchTest = async () => {
    try {
      setLoading(true)
      const res = await fetch_test(testId)
      if (res) {
        useTestStore.getState().setCurrentTest(res)
      } else {
        setError(
          'Test topilmadi. Iltimos, bosh sahifadagi togri test ID ni kiriting.'
        )
        router.push('/')
      }
    } catch (error) {
      console.error('Testni olishda xatolik:', error)
      setError(
        'Testni olishda xatolik yuz berdi. Keyinroq qayta urinib koring.'
      )
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleProceedToTest = () => {
    if (testId) {
      // Redirect to user details page instead of directly to test
      router.push(`/tests/user-details?id=${testId}`)
    }
  }

  const handleGoBack = () => {
    router.push('/')
  }

  if (!testId || !currentTest || isLoading) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <LoadingSpinner size='lg' text='Yo‘naltirilmoqda...' />
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8 sm:py-12'>
      <Container size='lg'>
        {/* Header Section */}
        <div className='mb-8 sm:mb-12 text-center'>
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-red-600 mb-2 sm:mb-4'>
            Test ko&apos;rsatmalari
          </h1>
          <h2 className='text-lg sm:text-xl lg:text-2xl text-gray-700 mb-2 sm:mb-4'>
            {currentTest.title || 'Dusel Onlayn Test'}
          </h2>
          <p className='text-sm sm:text-base text-gray-600 px-4 sm:px-0'>
            Davom etishdan oldin quyidagi ko&apos;rsatmalarni diqqat bilan
            o&apos;qing.
          </p>
        </div>

        {/* Warning Alert */}
        <div className='bg-yellow-50 border-l-4 border-yellow-400 p-4 sm:p-6 mb-6 sm:mb-8 rounded-r-lg'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg
                className='h-5 w-5 text-yellow-400'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='ml-3'>
              <h3 className='text-sm font-medium text-yellow-800'>
                Muhim ogohlantirish
              </h3>
              <div className='mt-2 text-sm text-yellow-700'>
                <p>
                  Bu kuzatuv ostidagi onlayn test. Iltimos, barcha qoidalarga
                  rioya qiling.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rules Section */}
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8'>
          <h3 className='text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6'>
            Test qoidalari va yo&apos;riqnomalar
          </h3>

          {test_rules_test.map(
            (
              rule: { strong: JSX.Element; text: JSX.Element },
              index: number
            ) => (
              <div key={index} className='flex items-start'>
                <div className='flex-shrink-0 mt-1'>
                  <div className='w-2 h-2 bg-red-600 rounded-full'></div>
                </div>
                <div className='ml-3 sm:ml-4'>
                  <p className='text-sm sm:text-base text-gray-700 leading-relaxed'>
                    <strong className='text-gray-900'>{rule.strong}</strong>{' '}
                    {rule.text}
                  </p>
                </div>
              </div>
            )
          )}
        </div>

        {/* Consequences Section */}
        <div className='bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8'>
          <h3 className='text-lg sm:text-xl font-semibold text-red-800 mb-2 sm:mb-3'>
            Qoidabuzarlik oqibatlari
          </h3>
          <p className='text-sm sm:text-base text-red-700 leading-relaxed'>
            Yuqoridagi qoidalarni buzish testning darhol yakunlanishiga va
            diskvalifikatsiyaga olib keladi. Urinish muvaffaqiyatsiz deb
            baholanadi va qayta topshirishga ruxsat berilmaydi.
          </p>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center'>
          <Button variant='secondary' onClick={handleGoBack} fullWidth>
            Orqaga qaytish
          </Button>
          <Button
            variant='primary'
            size='lg'
            onClick={handleProceedToTest}
            fullWidth
          >
            Tushundim — Davom etish
          </Button>
        </div>

        {/* Disclaimer */}
        <div className='mt-4 sm:mt-6 text-center'>
          <p className='text-xs sm:text-sm text-gray-500 px-4 sm:px-0'>
            &#34;Davom etish&#34; tugmasini bosish orqali siz barcha test
            qoidalarini o&apos;qib chiqqaningiz va ularga rioya qilishga rozilik
            bildirganingizni tasdiqlaysiz.
          </p>
        </div>
      </Container>
    </div>
  )
}