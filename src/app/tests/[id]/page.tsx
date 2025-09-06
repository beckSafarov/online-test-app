'use client'

import { useTestStore } from '@/store/testStore'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function TestPage() {
  const params = useParams()
  const router = useRouter()
  const { currentTest, setCurrentTest, setLoading, setError, isLoading, error } = useTestStore()
  const testId = params.id as string

  useEffect(() => {
    // If no test data in store, try to fetch it
    if (!currentTest && testId) {
      fetchTestData(testId)
    }
  }, [testId, currentTest])

  const fetchTestData = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/questions/${id}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch test')
      }
      
      setCurrentTest(data)
    } catch (error: any) {
      setError(error.message || 'Test not found')
      // Redirect back to home if test not found
      setTimeout(() => {
        router.push('/')
      }, 3000)
    }
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading test...</p>
        </div>
      </div>
    )
  }

  if (error || !currentTest) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-red-600 mb-4'>Test Not Found</h1>
          <p className='text-gray-600 mb-4'>{error || 'The requested test could not be found.'}</p>
          <p className='text-sm text-gray-500 mb-4'>Redirecting to home page...</p>
          <button
            onClick={() => router.push('/')}
            className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700'
          >
            Go Home Now
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white'>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='mb-8'>
            <button
              onClick={() => router.push('/')}
              className='text-red-600 hover:text-red-700 mb-4 flex items-center gap-2'
            >
              ← Back to Home
            </button>
            <h1 className='text-3xl font-bold text-red-600 mb-2'>
              {currentTest.title || 'Dusel Online Test'}
            </h1>
            {currentTest.description && (
              <p className='text-gray-600'>{currentTest.description}</p>
            )}
          </div>

          <div className='bg-gray-50 rounded-lg p-6'>
            <h2 className='text-xl font-semibold mb-4'>Test Information</h2>
            <p className='text-gray-600 mb-4'>
              Test ID: <span className='font-mono bg-gray-200 px-2 py-1 rounded'>{testId}</span>
            </p>
            
            {/* Display test data for debugging */}
            <div className='mt-6 p-4 bg-white rounded border'>
              <h3 className='font-semibold mb-2'>Test Data:</h3>
              <pre className='text-sm text-gray-600 overflow-auto'>
                {JSON.stringify(currentTest, null, 2)}
              </pre>
            </div>
            
            {/* Add your test questions/content here */}
            <div className='mt-6'>
              <p className='text-gray-500'>
                Test implementation coming soon...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
