import React from 'react'
import { Question } from '@/store/testStore'

interface QuestionCardProps {
  question: Question
  index: number
  currentAnswer: string | string[]
  onAnswerChange: (questionId: string, value: string | string[]) => void
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  currentAnswer,
  onAnswerChange,
}) => {
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
              {question.points} ball
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
                  onChange={(e) => onAnswerChange(question.id, e.target.value)}
                  className='w-5 h-5 text-red-600 focus:ring-red-500 focus:ring-2 cursor-pointer'
                />
                <span className='text-gray-800 font-medium'>{option.text}</span>
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
                    const currentAnswers = Array.isArray(currentAnswer)
                      ? currentAnswer
                      : []
                    if (e.target.checked) {
                      onAnswerChange(question.id, [
                        ...currentAnswers,
                        option.id,
                      ])
                    } else {
                      onAnswerChange(
                        question.id,
                        currentAnswers.filter((a) => a !== option.id)
                      )
                    }
                  }}
                  className='w-5 h-5 text-red-600 focus:ring-red-500 focus:ring-2 rounded cursor-pointer'
                />
                <span className='text-gray-800 font-medium'>{option.text}</span>
              </label>
            ))}
          </div>
        )}

        {/* Text Question */}
        {question.type === 'text' && (
          <div className='max-w-3xl'>
            <textarea
              value={typeof currentAnswer === 'string' ? currentAnswer : ''}
              onChange={(e) => onAnswerChange(question.id, e.target.value)}
              placeholder='Javobingizni bu yerga yozing...'
              maxLength={question.max_length}
              className='w-full p-4 bg-gray-50 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white resize-none text-gray-800 transition-all duration-200'
              rows={6}
            />
            {question.max_length && (
              <div className='mt-3 text-sm text-gray-500 text-right font-medium'>
                {typeof currentAnswer === 'string' ? currentAnswer.length : 0} /{' '}
                {question.max_length} ta belgi
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestionCard
