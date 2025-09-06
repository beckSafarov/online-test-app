'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTestStore } from '@/store/testStore'
import { useEffect } from 'react'
import { Container, Button, LoadingSpinner } from '@/components'

const test_rules_test = [
  {
    strong: 'No Cheating:',
    text: ' Any form of cheating, including using unauthorized resources or collaborating with others, is strictly prohibited and will result in immediate disqualification.',
  },
  {
    strong: 'No Tab/App Switching:',
    text: ' Switching to other browser tabs, applications, or leaving the test window will result in automatic test failure.',
  },
  {
    strong: 'Full Screen Mode:',
    text: ' The test must be taken in full screen mode. Exiting full screen will terminate the test.',
  },
  {
    strong: 'Time Limit:',
    text: ' Complete the test within the allocated time. The test will auto-submit when time expires.',
  },
  {
    strong: 'Single Attempt.',
    text: 'You have only one attempt to complete this test. Once started, you cannot restart.',
  },
  {
    strong: 'Technical Requirements.',
    text: 'Ensure stable internet connection. Technical issues during the test may not allow for retakes.',
  },
]

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
      // Redirect to user details page instead of directly to test
      router.push(`/tests/user-details?id=${testId}`)
    }
  }

  const handleGoBack = () => {
    router.push('/')
  }

  if (!testId || !currentTest) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <LoadingSpinner size='lg' text='Redirecting...' />
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8 sm:py-12'>
      <Container size='lg'>
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

          {test_rules_test.map(
            (rule: { strong: string; text: string }, index: number) => (
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
          <Button variant='secondary' onClick={handleGoBack} fullWidth>
            Go Back
          </Button>
          <Button
            variant='primary'
            size='lg'
            onClick={handleProceedToTest}
            fullWidth
          >
            I Understand - Continue
          </Button>
        </div>

        {/* Disclaimer */}
        <div className='mt-4 sm:mt-6 text-center'>
          <p className='text-xs sm:text-sm text-gray-500 px-4 sm:px-0'>
            By clicking "Continue", you acknowledge that you have read and agree
            to follow all test rules.
          </p>
        </div>
      </Container>
    </div>
  )
}