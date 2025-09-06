'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTestStore } from '@/store/testStore'
import { useEffect } from 'react'
import Container from '@/components/Container'

export default function TestInstructionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const testId = searchParams.get('id')
  const { currentTest, setError } = useTestStore()

  useEffect(() => {
    // If no test ID or no test data, redirect to home
    if (!testId || !currentTest) {
      setError('Please enter a valid test ID from the home page.')
      router.push('/')
    }
  }, [testId, currentTest, router, setError])

  const handleProceedToTest = () => {
    if (testId) {
      router.push(`/tests/${testId}`)
    }
  }

  const handleGoBack = () => {
    router.push('/')
  }

  if (!testId || !currentTest) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8 sm:py-12'>
      <Container size='sm'>
        {/* Header Section */}
        <div className='mb-8 sm:mb-12 text-center'>
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-red-600 mb-2 sm:mb-4'>
            Test Instructions
          </h1>
          <h2 className='text-lg sm:text-xl lg:text-2xl text-gray-700 mb-2 sm:mb-4'>
            {currentTest.title || 'Dusel Online Test'}
          </h2>
          <p className='text-sm sm:text-base text-gray-600 px-4 sm:px-0'>
            Please read the following instructions carefully before proceeding.
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
                Important Warning
              </h3>
              <div className='mt-2 text-sm text-yellow-700'>
                <p>
                  This is a monitored online test. Please ensure you follow all
                  rules.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rules Section */}
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8'>
          <h3 className='text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6'>
            Test Rules & Guidelines
          </h3>

          <div className='space-y-4 sm:space-y-6'>
            <div className='flex items-start'>
              <div className='flex-shrink-0 mt-1'>
                <div className='w-2 h-2 bg-red-600 rounded-full'></div>
              </div>
              <div className='ml-3 sm:ml-4'>
                <p className='text-sm sm:text-base text-gray-700 leading-relaxed'>
                  <strong className='text-gray-900'>No Cheating:</strong> Any
                  form of cheating, including using external resources,
                  collaborating with others, or using unauthorized materials is
                  strictly prohibited.
                </p>
              </div>
            </div>

            <div className='flex items-start'>
              <div className='flex-shrink-0 mt-1'>
                <div className='w-2 h-2 bg-red-600 rounded-full'></div>
              </div>
              <div className='ml-3 sm:ml-4'>
                <p className='text-sm sm:text-base text-gray-700 leading-relaxed'>
                  <strong className='text-gray-900'>
                    No Tab/App Switching:
                  </strong>{' '}
                  Switching to other browser tabs, applications, or leaving the
                  test window will result in automatic test failure.
                </p>
              </div>
            </div>

            <div className='flex items-start'>
              <div className='flex-shrink-0 mt-1'>
                <div className='w-2 h-2 bg-red-600 rounded-full'></div>
              </div>
              <div className='ml-3 sm:ml-4'>
                <p className='text-sm sm:text-base text-gray-700 leading-relaxed'>
                  <strong className='text-gray-900'>Full Screen Mode:</strong>{' '}
                  The test must be taken in full screen mode. Exiting full
                  screen will terminate the test.
                </p>
              </div>
            </div>

            <div className='flex items-start'>
              <div className='flex-shrink-0 mt-1'>
                <div className='w-2 h-2 bg-red-600 rounded-full'></div>
              </div>
              <div className='ml-3 sm:ml-4'>
                <p className='text-sm sm:text-base text-gray-700 leading-relaxed'>
                  <strong className='text-gray-900'>Time Limit:</strong>{' '}
                  Complete the test within the allocated time. The test will
                  auto-submit when time expires.
                </p>
              </div>
            </div>

            <div className='flex items-start'>
              <div className='flex-shrink-0 mt-1'>
                <div className='w-2 h-2 bg-red-600 rounded-full'></div>
              </div>
              <div className='ml-3 sm:ml-4'>
                <p className='text-sm sm:text-base text-gray-700 leading-relaxed'>
                  <strong className='text-gray-900'>Single Attempt:</strong> You
                  have only one attempt to complete this test. Once started, you
                  cannot restart.
                </p>
              </div>
            </div>

            <div className='flex items-start'>
              <div className='flex-shrink-0 mt-1'>
                <div className='w-2 h-2 bg-red-600 rounded-full'></div>
              </div>
              <div className='ml-3 sm:ml-4'>
                <p className='text-sm sm:text-base text-gray-700 leading-relaxed'>
                  <strong className='text-gray-900'>
                    Technical Requirements:
                  </strong>{' '}
                  Ensure stable internet connection. Technical issues during the
                  test may not allow for retakes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Consequences Section */}
        <div className='bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8'>
          <h3 className='text-lg sm:text-xl font-semibold text-red-800 mb-2 sm:mb-3'>
            Violation Consequences
          </h3>
          <p className='text-sm sm:text-base text-red-700 leading-relaxed'>
            Any violation of the above rules will result in immediate test
            termination and disqualification. Your test attempt will be marked
            as failed and no retakes will be allowed.
          </p>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center'>
          <button
            onClick={handleGoBack}
            className='w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm sm:text-base'
          >
            Go Back
          </button>
          <button
            onClick={handleProceedToTest}
            className='w-full sm:w-auto px-6 sm:px-8 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors text-sm sm:text-base'
          >
            I Understand - Proceed to Test
          </button>
        </div>

        {/* Disclaimer */}
        <div className='mt-4 sm:mt-6 text-center'>
          <p className='text-xs sm:text-sm text-gray-500 px-4 sm:px-0'>
            By clicking "Proceed to Test", you acknowledge that you have read
            and agree to follow all test rules.
          </p>
        </div>
      </Container>
    </div>
  )
}