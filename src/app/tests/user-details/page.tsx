'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTestStore } from '@/store/testStore'
import { useEffect, useState } from 'react'
import { Container, Input, Button, Card, Alert } from '@/components'

export default function UserDetailsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const testId = searchParams.get('id')
  const { currentTest, setError } = useTestStore()
  
  const [userDetails, setUserDetails] = useState({
    name: '',
    phoneNumber: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{name?: string; phoneNumber?: string}>({})

  useEffect(() => {
    // If no test ID or no test data, redirect to home
    if (!testId || !currentTest) {
      setError('Iltimos, bosh sahifadan togri test ID ni kiriting.')
      router.push('/')
    }
  }, [testId, currentTest, router, setError])

  const validateForm = () => {
    const newErrors: { name?: string; phoneNumber?: string } = {}

    if (!userDetails.name.trim()) {
      newErrors.name = 'Ism-sharif majburiy'
    }

    if (!userDetails.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Telefon raqami majburiy'
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(userDetails.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Iltimos, togri telefon raqamini kiriting'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const createTestSession = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/test_session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testId: testId,
          userName: userDetails.name,
          phoneNumber: userDetails.phoneNumber,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Test sessiyasini boshlashda xatolik')
      }

      // On success, navigate to the test with session ID
      router.push(`/tests/${testId}?sessionId=${data.sessionId}`)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Test sessiyasini yaratishda xatolik:', error)
      setError(error.message || 'Test sessiyasini boshlashda xatolik yuz berdi')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoBack = () => {
    router.push(`/tests?id=${testId}`)
  }

  if (!testId || !currentTest) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Yo&apos;naltirilmoqda...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8 sm:py-12'>
      <Container size='md'>
        {/* Header Section */}
        <div className='mb-8 sm:mb-12 text-center'>
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-red-600 mb-2 sm:mb-4'>
            Foydalanuvchi ma&apos;lumotlari
          </h1>
          <h2 className='text-lg sm:text-xl lg:text-2xl text-gray-700 mb-2 sm:mb-4'>
            {currentTest.title || 'Dusel Onlayn Test'}
          </h2>
          <p className='text-sm sm:text-base text-gray-600 px-4 sm:px-0'>
            Test sessiyasini boshlash uchun ma&apos;lumotlaringizni kiriting.
          </p>
        </div>

        {/* Form Section */}
        <Card padding='lg' className='mb-6 sm:mb-8'>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              createTestSession()
            }}
            className='space-y-6'
          >
            {/* Name Field */}
            <Input
              label="To'liq ism-familiya"
              type='text'
              value={userDetails.name}
              onChange={(e) =>
                setUserDetails((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="To'liq ism-familiyangizni kiriting"
              disabled={isSubmitting}
              required
              error={errors.name}
            />

            {/* Phone Number Field */}
            <Input
              label='Telefon raqami'
              type='tel'
              value={userDetails.phoneNumber}
              onChange={(e) =>
                setUserDetails((prev) => ({
                  ...prev,
                  phoneNumber: e.target.value,
                }))
              }
              placeholder='Telefon raqamingizni kiriting'
              disabled={isSubmitting}
              required
              error={errors.phoneNumber}
            />

            {/* Privacy Notice */}
            <Alert variant='info' title='Maxfiylik haqida bildirishnoma'>
              <p>
                Ma&apos;lumotlaringiz faqat test sessiyasini kuzatish va
                tasdiqlash maqsadida ishlatiladi.
              </p>
            </Alert>
          </form>
        </Card>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center'>
          <Button
            variant='secondary'
            onClick={handleGoBack}
            disabled={isSubmitting}
            fullWidth
          >
            Orqaga qaytish
          </Button>
          <Button
            variant='primary'
            size='lg'
            onClick={createTestSession}
            disabled={isSubmitting}
            loading={isSubmitting}
            fullWidth
          >
            {isSubmitting
              ? 'Sessiya boshlanmoqda...'
              : 'Test sessiyasini boshlash'}
          </Button>
        </div>

        {/* Disclaimer */}
        <div className='mt-4 sm:mt-6 text-center'>
          <p className='text-xs sm:text-sm text-gray-500 px-4 sm:px-0'>
            Test sessiyasini boshlash orqali siz kiritilgan ma&apos;lumotlar
            to&apos;g&apos;riligini tasdiqlaysiz.
          </p>
        </div>
      </Container>
    </div>
  )
}
