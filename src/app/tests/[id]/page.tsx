'use client'

import { useTestStore, Question } from '@/store/testStore'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Container from '@/components/Container'

interface Answer {
  questionId: string
  answer: string | string[]
}

export default function TestPage() {
  const params = useParams()
  const router = useRouter()
  const {
    currentTest,
    setCurrentTest,
    setLoading,
    setError,
    isLoading,
    error,
  } = useTestStore()
  const testId = params.id as string
  const [answers, setAnswers] = useState<Answer[]>([])
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)

  useEffect(() => {
    // If no test data in store, try to fetch it
    if (!currentTest && testId) {
      fetchTestData(testId)
    } else if (currentTest?.duration_minutes) {
      // Start timer if test has duration
      setTimeRemaining(currentTest.duration_minutes * 60) // Convert to seconds
    }
  }, [testId, currentTest])

  useEffect(() => {
    // Timer countdown
    if (timeRemaining !== null && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0) {
      // Auto-submit when time runs out
      handleSubmit()
    }
  }, [timeRemaining])

  const fetchTestData = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/questions/${id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch test')
      }

      setCurrentTest(data)

      // Initialize answers array
      if (data.questions) {
        const initialAnswers = data.questions.map((q: Question) => ({
          questionId: q.id,
          answer: q.type === 'multi_select' ? [] : '',
        }))
        setAnswers(initialAnswers)
      }
    } catch (error: any) {
      setError(error.message || 'Test not found')
      setTimeout(() => {
        router.push('/')
      }, 3000)
    }
  }

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers((prev) =>
      prev.map((answer) =>
        answer.questionId === questionId
          ? { ...answer, answer: value }
          : answer
      )
    )
  }

  const handleSubmit = () => {
    // TODO: Submit answers to backend
    console.log('Test submitted:', answers)
    alert('Test submitted successfully!')
    router.push('/')
  }

  const handleReset = () => {
    if (
      confirm(
        'Are you sure you want to reset all your answers? This action cannot be undone.'
      )
    ) {
      if (currentTest?.questions) {
        const resetAnswers = currentTest.questions.map((q: Question) => ({
          questionId: q.id,
          answer: q.type === 'multi_select' ? [] : '',
        }))
        setAnswers(resetAnswers)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4'></div>
          <p className='text-gray-600 font-medium'>Loading test...</p>
        </div>
      </div>
    )
  }

  if (error || !currentTest) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
        <Container size='md'>
          <div className='text-center bg-white rounded-xl shadow-sm p-8 border border-gray-100'>
            <h1 className='text-2xl font-bold text-red-600 mb-4'>
              Test Not Found
            </h1>
            <p className='text-gray-600 mb-4'>
              {error || 'The requested test could not be found.'}
            </p>
            <p className='text-sm text-gray-500 mb-6'>
              Redirecting to home page...
            </p>
            <button
              onClick={() => router.push('/')}
              className='px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium'
            >
              Go Home Now
            </button>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8 sm:py-12'>
      <Container size='md'>
        {/* Header */}
        <div className='bg-white rounded-xl shadow-sm p-6 sm:p-8 mb-8 border border-gray-100'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6'>
            <button
              onClick={() => router.push('/')}
              className='text-red-600 hover:text-red-700 mb-4 sm:mb-0 flex items-center gap-2 text-sm font-medium transition-colors'
            >
              ← Back to Home
            </button>
            {timeRemaining !== null && (
              <div className='flex items-center gap-3'>
                <span className='text-sm text-gray-600 font-medium'>
                  Time Remaining:
                </span>
                <span
                  className={`text-lg font-mono font-bold px-4 py-2 rounded-lg border ${
                    timeRemaining < 300
                      ? 'bg-red-100 text-red-700 border-red-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
                >
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>

          <div className='text-center mb-8'>
            <h1 className='text-3xl sm:text-4xl font-bold text-red-600 mb-6'>
              {currentTest.title || 'Dusel Online Test'}
            </h1>
            {currentTest.description && (
              <p className='text-gray-700 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8'>
                {currentTest.description}
              </p>
            )}
          </div>

          <div className='flex flex-wrap justify-center gap-6 text-sm text-gray-600 bg-gray-50 rounded-lg p-6'>
            <div className='flex items-center gap-2'>
              <span className='font-medium'>Test ID:</span>
              <code className='bg-white px-3 py-1 rounded border font-mono text-gray-800'>
                {testId}
              </code>
            </div>
            {currentTest.questions && (
              <div className='flex items-center gap-2'>
                <span className='font-medium'>Questions:</span>
                <span className='font-semibold text-gray-800'>
                  {currentTest.questions.length}
                </span>
              </div>
            )}
            {currentTest.duration_minutes && (
              <div className='flex items-center gap-2'>
                <span className='font-medium'>Duration:</span>
                <span className='font-semibold text-gray-800'>
                  {currentTest.duration_minutes} minutes
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Questions */}
        {currentTest.questions && currentTest.questions.length > 0 && (
          <div className='space-y-8'>
            {currentTest.questions.map((question: Question, index: number) => {
              const currentAnswer =
                answers.find((a) => a.questionId === question.id)?.answer ||
                (question.type === 'multi_select' ? [] : '')

              return (
                <div
                  key={question.id}
                  className='bg-white rounded-xl shadow-sm p-6 sm:p-8 border border-gray-100'
                >
                  <div className='flex items-start gap-6 mb-8'>
                    <div className='bg-red-600 text-white text-lg font-bold w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0'>
                      {index + 1}
                    </div>
                    <div className='flex-1'>
                      <h3 className='text-xl font-semibold text-gray-900 mb-4 leading-relaxed'>
                        {question.question}
                      </h3>
                      {question.points && (
                        <span className='inline-block bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full'>
                          {question.points} points
                        </span>
                      )}
                    </div>
                  </div>

                  <div className='ml-18'>
                    {/* Multiple Choice Question */}
                    {question.type === 'mcq' && question.options && (
                      <div className='space-y-4'>
                        {question.options.map((option) => (
                          <label
                            key={option.id}
                            className='flex items-center gap-4 cursor-pointer p-4 rounded-lg hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 transition-all duration-200'
                          >
                            <input
                              type='radio'
                              name={question.id}
                              value={option.id}
                              checked={currentAnswer === option.id}
                              onChange={(e) =>
                                handleAnswerChange(question.id, e.target.value)
                              }
                              className='w-5 h-5 text-red-600 focus:ring-red-500 focus:ring-2'
                            />
                            <span className='text-gray-800 font-medium'>
                              {option.text}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Multi-Select Question */}
                    {question.type === 'multi_select' && question.options && (
                      <div className='space-y-4'>
                        {question.options.map((option) => (
                          <label
                            key={option.id}
                            className='flex items-center gap-4 cursor-pointer p-4 rounded-lg hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 transition-all duration-200'
                          >
                            <input
                              type='checkbox'
                              value={option.id}
                              checked={
                                Array.isArray(currentAnswer) &&
                                currentAnswer.includes(option.id)
                              }
                              onChange={(e) => {
                                const currentAnswerArray = Array.isArray(
                                  currentAnswer
                                )
                                  ? currentAnswer
                                  : []
                                if (e.target.checked) {
                                  handleAnswerChange(question.id, [
                                    ...currentAnswerArray,
                                    option.id,
                                  ])
                                } else {
                                  handleAnswerChange(
                                    question.id,
                                    currentAnswerArray.filter(
                                      (id) => id !== option.id
                                    )
                                  )
                                }
                              }}
                              className='w-5 h-5 text-red-600 focus:ring-red-500 focus:ring-2 rounded'
                            />
                            <span className='text-gray-800 font-medium'>
                              {option.text}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Text Question */}
                    {question.type === 'text' && (
                      <div className='max-w-3xl'>
                        <textarea
                          value={
                            typeof currentAnswer === 'string'
                              ? currentAnswer
                              : ''
                          }
                          onChange={(e) =>
                            handleAnswerChange(question.id, e.target.value)
                          }
                          placeholder='Enter your answer here...'
                          maxLength={question.max_length}
                          className='w-full p-4 bg-gray-50 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white resize-none text-gray-800 transition-all duration-200'
                          rows={6}
                        />
                        {question.max_length && (
                          <div className='mt-3 text-sm text-gray-500 text-right font-medium'>
                            {typeof currentAnswer === 'string'
                              ? currentAnswer.length
                              : 0}{' '}
                            / {question.max_length} characters
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Action Buttons */}
        <div className='mt-12 bg-white rounded-xl shadow-sm p-6 sm:p-8 border border-gray-100'>
          <div className='flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto'>
            <button
              onClick={handleReset}
              className='px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200'
            >
              Reset All
            </button>
            <button
              onClick={handleSubmit}
              className='px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg'
            >
              Submit Test
            </button>
          </div>

          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-600 leading-relaxed max-w-xl mx-auto'>
              Make sure to review all your answers before submitting. You cannot
              change them after submission.
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}
