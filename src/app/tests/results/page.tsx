'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Container } from '@/components'
import Button from '@/components/ui/Button'

export default function TestResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  
  const testId = searchParams.get('testId')
  const sessionId = searchParams.get('sessionId')

  useEffect(() => {
    // Simulate loading time to show the completion message
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleGoHome = () => {
    router.push('/')
  }

  const handleTakeAnotherTest = () => {
    router.push('/tests')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Processing your test results...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <Container size="md">
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Test Completed Successfully!
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-2">
            Thank you for completing the test. Your answers have been submitted successfully.
          </p>
          
          {sessionId && (
            <p className="text-sm text-gray-500 mb-8">
              Session ID: <span className="font-mono">{sessionId}</span>
            </p>
          )}

          {/* Additional Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-8">
            <p className="text-blue-800 text-sm">
              Your test results have been recorded and will be reviewed. 
              You will be contacted if further action is needed.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto">
            <Button
              onClick={handleGoHome}
              variant="primary"
              className="flex-1"
            >
              Go to Home
            </Button>
            <Button
              onClick={handleTakeAnotherTest}
              variant="secondary"
              className="flex-1"
            >
              Take Another Test
            </Button>
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              If you have any questions about your test submission, please contact support.
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}
