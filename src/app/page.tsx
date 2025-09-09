'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTestStore } from '@/store/testStore'
import { Container, Input, Button, Alert } from '@/components'
import { fetch_test } from '@/utils/api_client'

export default function Home() {
  const [testId, setTestId] = useState('')
  const router = useRouter()
  const { setCurrentTest, setLoading, setError, isLoading, error } =
    useTestStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanTestId = testId.trim()

    if (!cleanTestId) return

    setLoading(true)
    setError(null)

    try {
      const testData = await fetch_test(cleanTestId)
      setCurrentTest(testData)
      router.push(`/tests?id=${cleanTestId}`)
    } catch (error: any) {
      setError(
        error.message ||
          'Test topilmadi. Iltimos, ID raqamini tekshirib qayta urinib ko‘ring.'
      )
    }
  }

  return (
    <div className='min-h-screen bg-white flex items-center justify-center p-4'>
      <Container size='sm'>
        <div className='text-center'>
          <h1 className='text-3xl sm:text-4xl font-bold text-red-600 mb-4'>
            Dusel Onlayn Test
          </h1>

          <p className='text-gray-600 mb-8 text-base sm:text-lg'>
            Test ID raqamini kiriting va testni boshlang
          </p>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='flex flex-col sm:flex-row gap-3'>
              <Input
                type='text'
                value={testId}
                onChange={(e) => setTestId(e.target.value)}
                placeholder='Test UUID ni kiriting'
                required
                disabled={isLoading}
                className='flex-1 border-2 border-red-200 focus:border-red-500 focus:ring-red-200'
              />
              <Button
                type='submit'
                disabled={isLoading}
                loading={isLoading}
                className='whitespace-nowrap'
              >
                {isLoading ? 'Yuklanmoqda...' : 'Yuborish'}
              </Button>
            </div>

            {error && <Alert variant='error'>{error}</Alert>}
          </form>
        </div>
      </Container>
    </div>
  )
}
