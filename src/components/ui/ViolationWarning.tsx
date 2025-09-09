import React from 'react'
import { WarningIcon, ErrorIcon } from '../ui/Icons'

interface ViolationWarningProps {
  violations: number
  isVisible: boolean
  onClose: () => void
}

const ViolationWarning: React.FC<ViolationWarningProps> = ({
  violations,
  isVisible,
  onClose
}) => {
  if (!isVisible) return null

  // Calculate remaining warnings before termination
  // Termination happens at 3 violations, so warnings are at 1 and 2
  const remainingWarnings = 3 - violations
  const isLastWarning = violations === 2 // Last warning is at 2nd violation

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl'>
        <div className='flex items-center gap-3 mb-4'>
          {isLastWarning ? (
            <ErrorIcon className='w-8 h-8 text-red-500' />
          ) : (
            <WarningIcon className='w-8 h-8 text-yellow-500' />
          )}
          <h3 className='text-lg font-semibold text-gray-900'>
            Test xolisligi bo&apos;yicha ogohlantirish
          </h3>
        </div>

        <div className='mb-6'>
          <p className='text-gray-700 mb-3'>
            Siz test oynasidan chiqdingiz. Bu test qoidalarini buzadi.
          </p>

          {isLastWarning ? (
            <p className='text-red-600 font-medium'>
              ⚠️ Bu so&apos;nggi ogohlantirish! Yana bir marta qoidabuzarlik
              qilsangiz, test avtomatik yakunlanadi.
            </p>
          ) : violations >= 3 ? (
            <p className='text-red-600 font-bold'>
              🚨 Ruxsat etilgan maksimal qoidabuzarliklar sonidan oshdingiz.
              Ushbu ogohlantirishni tasdiqlaganingizda test yakunlanadi.
            </p>
          ) : (
            <p className='text-yellow-600 font-medium'>
              Avtomatik diskvalifikatsiyadan oldin sizda yana{' '}
              {remainingWarnings} ta ogohlantirish qolgan.
            </p>
          )}

          <p className='text-sm text-gray-600 mt-2'>
            Testdan 5 soniyadan ortiq uzoqlashsangiz, darhol yakunlanadi.
          </p>
        </div>

        <button
          onClick={onClose}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            violations >= 3
              ? 'bg-red-700 text-white hover:bg-red-800'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          {violations >= 3
            ? 'Tasdiqlash — Test yakunlanadi'
            : 'Tushundim — Testni davom ettirish'}
        </button>
      </div>
    </div>
  )
}

export default ViolationWarning
