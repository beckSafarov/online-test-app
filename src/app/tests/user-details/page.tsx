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
      setError('Please enter a valid test ID from the home page.')
      router.push('/')
    }
  }, [testId, currentTest, router, setError])

  const validateForm = () => {
    const newErrors: {name?: string; phoneNumber?: string} = {}
    
    if (!userDetails.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!userDetails.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(userDetails.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid phone number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const createTestSession = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      const formData = new FormData()
      formData.append('test_id', testId!)
      formData.append('candidate_name', userDetails.name.trim())
      formData.append('candidate_phone', userDetails.phoneNumber.trim())
      formData.append('started_at', new Date().toISOString())

      const response = await fetch('/api/test_session', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create test session')
      }

      // Session created successfully, proceed to test with session ID
      const sessionId = data.id
      router.push(`/tests/${testId}?sessionId=${sessionId}`)
    } catch (error: any) {
      setError(error.message || 'Failed to start test session')
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
          <p className='text-gray-600'>Redirecting...</p>
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
            User Information
          </h1>
          <h2 className='text-lg sm:text-xl lg:text-2xl text-gray-700 mb-2 sm:mb-4'>
            {currentTest.title || 'Dusel Online Test'}
          </h2>
          <p className='text-sm sm:text-base text-gray-600 px-4 sm:px-0'>
            Please provide your details to start the test session.
          </p>
        </div>

        {/* Form Section */}
        <Card padding='lg' className='mb-6 sm:mb-8'>
          <form onSubmit={(e) => { e.preventDefault(); createTestSession(); }} className='space-y-6'>
            {/* Name Field */}
            <Input
              label='Full Name'
              type='text'
              value={userDetails.name}
              onChange={(e) => setUserDetails(prev => ({ ...prev, name: e.target.value }))}
              placeholder='Enter your full name'
              disabled={isSubmitting}
              required
              error={errors.name}
            />

            {/* Phone Number Field */}
            <Input
              label='Phone Number'
              type='tel'
              value={userDetails.phoneNumber}
              onChange={(e) => setUserDetails(prev => ({ ...prev, phoneNumber: e.target.value }))}
              placeholder='Enter your phone number'
              disabled={isSubmitting}
              required
              error={errors.phoneNumber}
            />

            {/* Privacy Notice */}
            <Alert variant='info' title='Privacy Notice'>
              <p>Your information will be used solely for test session tracking and verification purposes.</p>
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
            Go Back
          </Button>
          <Button
            variant='primary'
            size='lg'
            onClick={createTestSession}
            disabled={isSubmitting}
            loading={isSubmitting}
            fullWidth
          >
            {isSubmitting ? 'Starting Session...' : 'Start Test Session'}
          </Button>
        </div>

        {/* Disclaimer */}
        <div className='mt-4 sm:mt-6 text-center'>
          <p className='text-xs sm:text-sm text-gray-500 px-4 sm:px-0'>
            By starting the test session, you confirm that the provided information is accurate.
          </p>
        </div>
      </Container>
    </div>
  )
}
