'use client'

import { useTestStore, Question } from '@/store/testStore'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useRef, useMemo, useCallback, memo } from 'react'
import {
  Container,
  Button,
  LoadingSpinner,
  Alert,
  FullscreenIcon,
  ExitFullscreenIcon,
  BackArrowIcon,
} from '@/components'

interface Answer {
  questionId: string
  answer: string | string[]
}

interface QuestionComponentProps {
  question: Question
  index: number
  currentAnswer: string | string[]
  onAnswerChange: (questionId: string, value: string | string[]) => void
}

// Optimize QuestionComponent with deeper comparison
const QuestionComponent = memo(
  ({
    question,
    index,
    currentAnswer,
    onAnswerChange,
  }: QuestionComponentProps) => {
    const handleMcqChange = useCallback(
      (value: string) => {
        onAnswerChange(question.id, value)
      },
      [question.id, onAnswerChange]
    )

    const handleMultiSelectChange = useCallback(
      (optionId: string, checked: boolean) => {
        const currentAnswers = Array.isArray(currentAnswer) ? currentAnswer : []
        if (checked) {
          onAnswerChange(question.id, [...currentAnswers, optionId])
        } else {
          onAnswerChange(
            question.id,
            currentAnswers.filter((a) => a !== optionId)
          )
        }
      },
      [question.id, currentAnswer, onAnswerChange]
    )

    const handleTextChange = useCallback(
      (value: string) => {
        onAnswerChange(question.id, value)
      },
      [question.id, onAnswerChange]
    )

    return (
      <div className='bg-white rounded-xl shadow-sm p-6 sm:p-8 border border-gray-100'>
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
                    id={`${question.id}-${option.id}`}
                    name={question.id}
                    value={option.id}
                    checked={currentAnswer === option.id}
                    onChange={(e) => handleMcqChange(e.target.value)}
                    className='w-5 h-5 text-red-600 focus:ring-red-500 focus:ring-2 cursor-pointer'
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
                      handleMultiSelectChange(option.id, e.target.checked)
                    }}
                    className='w-5 h-5 text-red-600 focus:ring-red-500 focus:ring-2 rounded cursor-pointer'
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
                value={typeof currentAnswer === 'string' ? currentAnswer : ''}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder='Enter your answer here...'
                maxLength={question.max_length}
                className='w-full p-4 bg-gray-50 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white resize-none text-gray-800 transition-all duration-200'
                rows={6}
              />
              {question.max_length && (
                <div className='mt-3 text-sm text-gray-500 text-right font-medium'>
                  {typeof currentAnswer === 'string' ? currentAnswer.length : 0}{' '}
                  / {question.max_length} characters
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
)

QuestionComponent.displayName = 'QuestionComponent'

export default function TestPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const {
    currentTest,
    setCurrentTest,
    setLoading,
    setError,
    isLoading,
    error,
  } = useTestStore()
  const testId = params.id as string
  const sessionId = searchParams.get('sessionId')
  const [answers, setAnswers] = useState<Answer[]>([])
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Fullscreen functionality
  const enterFullscreen = useCallback(async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen()
        setIsFullscreen(true)
      }
    } catch (error) {
      console.warn('Fullscreen request failed:', error)
    }
  }, [])

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (error) {
      console.warn('Fullscreen exit failed:', error)
    }
  }, [])

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const wasFullscreen = isFullscreen
      const nowFullscreen = !!document.fullscreenElement
      setIsFullscreen(nowFullscreen)

      // Show warning if user manually exited fullscreen
      if (wasFullscreen && !nowFullscreen && currentTest) {
        const shouldReturn = confirm(
          'You have exited fullscreen mode. For the best test experience, it is recommended to stay in fullscreen mode. Would you like to return to fullscreen?'
        )
        if (shouldReturn) {
          enterFullscreen()
        }
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange
      )
      document.removeEventListener(
        'mozfullscreenchange',
        handleFullscreenChange
      )
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [isFullscreen, currentTest, enterFullscreen])

  // Keyboard shortcuts for fullscreen
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // F11 for fullscreen toggle
      if (event.key === 'F11') {
        event.preventDefault()
        if (isFullscreen) {
          exitFullscreen()
        } else {
          enterFullscreen()
        }
      }
      // Escape key warning when in fullscreen
      else if (event.key === 'Escape' && isFullscreen) {
        setTimeout(() => {
          if (!document.fullscreenElement) {
            const shouldReturn = confirm(
              'You pressed Escape and exited fullscreen mode. Would you like to return to fullscreen for the best test experience?'
            )
            if (shouldReturn) {
              enterFullscreen()
            }
          }
        }, 100)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen, enterFullscreen, exitFullscreen])

  // Auto-enter fullscreen when component mounts
  useEffect(() => {
    enterFullscreen()

    // Exit fullscreen when component unmounts
    return () => {
      if (document.fullscreenElement) {
        exitFullscreen()
      }
    }
  }, [enterFullscreen, exitFullscreen])

  useEffect(() => {
    // Validate session ID - redirect if missing
    if (!sessionId) {
      setError('Invalid session. Please start the test again.')
      router.push('/')
      return
    }

    // Always fetch test data when testId changes or if we don't have the right test
    if (testId && (!currentTest || currentTest.id !== testId)) {
      fetchTestData(testId)
    } else if (
      currentTest?.duration_minutes &&
      currentTest.id === testId &&
      timeRemaining === null
    ) {
      // Start timer if test has duration and matches current testId, but only if timer isn't already set
      setTimeRemaining(currentTest.duration_minutes * 60) // Convert to seconds
    }

    // Initialize answers if test is loaded but answers aren't initialized yet
    if (currentTest?.questions && currentTest.id === testId && !isInitialized) {
      const initialAnswers = currentTest.questions.map((q: Question) => ({
        questionId: q.id,
        answer: q.type === 'multi_select' ? [] : '',
      }))
      setAnswers(initialAnswers)
      setIsInitialized(true)
    }
  }, [testId, currentTest, sessionId, router, setError, isInitialized])

  const fetchTestData = async (id: string) => {
    setLoading(true)
    setError(null) // Clear any previous errors
    try {
      const response = await fetch(`/api/questions/${id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch test')
      }

      setCurrentTest(data)
      setLoading(false) // Set loading to false after successful fetch

      // Only initialize timer if it's not already set
      if (data.duration_minutes && timeRemaining === null) {
        setTimeRemaining(data.duration_minutes * 60)
      }

      // Initialize answers array
      if (data.questions) {
        const initialAnswers = data.questions.map((q: Question) => ({
          questionId: q.id,
          answer: q.type === 'multi_select' ? [] : '',
        }))
        setAnswers(initialAnswers)
        setIsInitialized(true)
      }
    } catch (error: any) {
      setError(error.message || 'Test not found')
      setTimeout(() => {
        router.push('/')
      }, 3000)
    }
  }

  const handleAnswerChange = useCallback(
    (questionId: string, value: string | string[]) => {
      setAnswers((prev) =>
        prev.map((answer) =>
          answer.questionId === questionId
            ? { ...answer, answer: value }
            : answer
        )
      )
    },
    []
  ) // Remove answers dependency to prevent re-renders

  const handleSubmit = useCallback(async () => {
    console.log('Test submitted:', answers)
    try {
      await fetch('/api/results', {
        method: 'POST',
        body: JSON.stringify({
          session_id: sessionId,
          answers: answers,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      await fetch('/api/test_session', {
        method: 'PUT',
        body: JSON.stringify({
          test_id: testId,
          submitted_at: new Date().toISOString(),
          is_completed: 'true',
          did_violate: 'false', // This would be dynamic based on actual monitoring
          sessionId: sessionId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      // const data = await response.json()

      // Exit fullscreen before showing alert and redirecting
      if (document.fullscreenElement) {
        await exitFullscreen()
      }

      alert('Test submitted successfully!')
      router.push('/')
    } catch (error) {
      console.error('Error submitting test:', error)
      alert('Error submitting test. Please try again.')
      return
    }
  }, [answers, sessionId, router, exitFullscreen])

  // Timer management - optimized to prevent excessive re-renders
  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining((prev) => (prev && prev > 0 ? prev - 1 : 0))
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0) {
      // Auto-submit when time runs out
      handleSubmit()
    }
  }, [timeRemaining, handleSubmit])

  const handleReset = useCallback(() => {
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
        setIsInitialized(true)
      }
    }
  }, [currentTest])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  // Memoize the questions to prevent re-rendering every second
  const memoizedQuestions = useMemo(() => {
    if (
      !currentTest?.questions ||
      currentTest.questions.length === 0 ||
      !isInitialized
    ) {
      return null
    }

    return currentTest.questions.map((question: Question, index: number) => {
      const currentAnswer =
        answers.find((a) => a.questionId === question.id)?.answer ||
        (question.type === 'multi_select' ? [] : '')

      return (
        <QuestionComponent
          key={question.id}
          question={question}
          index={index}
          currentAnswer={currentAnswer}
          onAnswerChange={handleAnswerChange}
        />
      )
    })
  }, [currentTest?.questions, answers, handleAnswerChange, isInitialized])

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
        <Container size='lg'>
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
          <div className='flex sm:flex-row sm:items-center sm:justify-between mb-6'>
            <div className='flex items-center gap-4'>
              <button
                onClick={async () => {
                  if (document.fullscreenElement) {
                    await exitFullscreen()
                  }
                  router.push('/')
                }}
                className='text-red-600 hover:text-red-700 flex items-center gap-2 text-sm font-medium transition-colors'
              >
                <BackArrowIcon className='w-4 h-4' />
                Back to Home
              </button>
              <button
                onClick={isFullscreen ? exitFullscreen : enterFullscreen}
                className='text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm font-medium transition-colors p-2 rounded-lg hover:bg-blue-50'
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? (
                  <ExitFullscreenIcon className='w-4 h-4' />
                ) : (
                  <FullscreenIcon className='w-4 h-4' />
                )}
                <span className='hidden sm:inline'>
                  {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </span>
              </button>
            </div>
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
                {isFullscreen && (
                  <span className='text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200 font-medium'>
                    📺 Fullscreen
                  </span>
                )}
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

          <div className='flex flex-col sm:flex-row gap-4 items-center justify-center text-sm text-gray-600 bg-gray-50 rounded-lg p-6'>
            {currentTest.questions && (
              <div className='flex items-center justify-between'>
                <div className='font-medium text-gray-700'>❓ Questions:</div>
                <div className='font-bold text-gray-800 bg-green-100 px-3 py-1 rounded-full'>
                  {currentTest.questions.length}
                </div>
              </div>
            )}
            {currentTest.duration_minutes && (
              <div className='flex items-center justify-between'>
                <span className='font-medium text-gray-700'>⌛️ Duration:</span>
                <span className='font-bold text-gray-800 bg-green-100 px-3 py-1 rounded-full'>
                  {currentTest.duration_minutes} minutes
                </span>
              </div>
            )}
          </div>

          {!isFullscreen && (
            <div className='mt-4 text-center'>
              <p className='text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-lg mx-auto'>
                💡 <strong>Tip:</strong> This test automatically opens in
                fullscreen mode for the best experience. Press F11 or use the
                fullscreen button to toggle.
              </p>
            </div>
          )}
        </div>

        {/* Questions */}
        {!isInitialized ? (
          <div className='bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4'></div>
            <p className='text-gray-600 font-medium'>Preparing questions...</p>
          </div>
        ) : memoizedQuestions ? (
          <div className='space-y-8'>{memoizedQuestions}</div>
        ) : (
          <div className='bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center'>
            <p className='text-gray-600'>No questions available.</p>
          </div>
        )}

        {/* Action Buttons */}
        {isInitialized && (
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
                Make sure to review all your answers before submitting. You
                cannot change them after submission.
              </p>
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}
