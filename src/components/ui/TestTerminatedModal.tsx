import React from 'react'
import { ErrorIcon } from '../ui/Icons'

interface TestTerminatedModalProps {
  reason: 'timeout' | 'violations'
  isVisible: boolean
  onGoHome: () => void
}

const TestTerminatedModal: React.FC<TestTerminatedModalProps> = ({
  reason,
  isVisible,
  onGoHome
}) => {
  if (!isVisible) return null

  const getTitle = () => {
    return reason === 'timeout'
      ? 'Test yakunlandi — Vaqt qoidabuzarligi'
      : 'Test yakunlandi — Bir nechta qoidabuzarlik'
  }

  const getMessage = () => {
    return reason === 'timeout'
      ? 'Siz testdan 5 soniyadan ortiq uzoqlashdingiz, bu test xolisligi qoidalarini buzadi.'
      : 'Siz test oynasidan chiqish orqali ruxsat etilgan qoidabuzarliklar soni (3) dan oshdingiz.'
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-8 max-w-lg mx-4 shadow-2xl'>
        <div className='text-center'>
          <div className='flex justify-center mb-4'>
            <div className='bg-red-100 rounded-full p-3'>
              <ErrorIcon className='w-12 h-12 text-red-500' />
            </div>
          </div>

          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            {getTitle()}
          </h2>

          <div className='text-gray-700 mb-6 space-y-3'>
            <p>{getMessage()}</p>

            <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
              <p className='text-red-800 font-medium'>
                Test javoblaringiz avtomatik ravishda topshirildi va
                qoidabuzarlik sifatida belgilandi.
              </p>
            </div>

            <p className='text-sm text-gray-600'>
              Agar bu xato deb hisoblasangiz, administrator bilan
              bog&apos;laning.
            </p>
          </div>

          <button
            onClick={onGoHome}
            className='w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium text-lg'
          >
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    </div>
  )
}

export default TestTerminatedModal
