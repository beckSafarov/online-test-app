'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTestStore } from '@/store/testStore'

export default function Home() {
  const [testId, setTestId] = useState('')
  const router = useRouter()
  const { setCurrentTest, setLoading, setError, isLoading, error } =
    useTestStore()

  const fetch_test = async (id: string) => {
    try {
      const response = await fetch(`/api/questions/${id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch test')
      }

      return data
    } catch (error) {
      console.error('Error fetching test:', error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanTestId = testId.trim()

    if (!cleanTestId) return

    setLoading(true)
    setError(null)

    try {
      const testData = await fetch_test(cleanTestId)
      setCurrentTest(testData)
      router.push(`/tests/${cleanTestId}`)
    } catch (error: any) {
      setError(
        error.message || 'Test not found. Please check the ID and try again.'
      )
    }
  }

  return (
    <div className='min-h-screen bg-white flex items-center justify-center p-4'>
      <div className='w-full max-w-md text-center'>
        <h1 className='text-4xl font-bold text-red-600 mb-4'>
          Dusel Online Test
        </h1>

        <p className='text-gray-600 mb-8 text-lg'>
          Enter the test ID and take the test
        </p>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='flex gap-3'>
            <input
              type='text'
              value={testId}
              onChange={(e) => setTestId(e.target.value)}
              placeholder='Enter test UUID'
              className='flex-1 px-4 py-3 border-2 border-red-200 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors'
              required
              disabled={isLoading}
            />
            <button
              type='submit'
              disabled={isLoading}
              className='px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? 'Loading...' : 'Send'}
            </button>
          </div>

          {error && (
            <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-red-600 text-sm'>{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
