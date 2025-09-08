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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          {isLastWarning ? (
            <ErrorIcon className="w-8 h-8 text-red-500" />
          ) : (
            <WarningIcon className="w-8 h-8 text-yellow-500" />
          )}
          <h3 className="text-lg font-semibold text-gray-900">
            Test Integrity Warning
          </h3>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-3">
            You switched away from the test window. This violates the test rules.
          </p>
          
          {isLastWarning ? (
            <p className="text-red-600 font-medium">
              ⚠️ This is your final warning! One more violation will result in automatic test termination.
            </p>
          ) : violations >= 3 ? (
            <p className="text-red-600 font-bold">
              🚨 You have exceeded the maximum allowed violations. Your test will be terminated when you acknowledge this warning.
            </p>
          ) : (
            <p className="text-yellow-600 font-medium">
              You have {remainingWarnings} warning{remainingWarnings !== 1 ? 's' : ''} remaining before automatic disqualification.
            </p>
          )}
          
          <p className="text-sm text-gray-600 mt-2">
            Staying away from the test for more than 5 seconds will result in immediate termination.
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
          {violations >= 3 ? 'Acknowledge - Test Will End' : 'I Understand - Continue Test'}
        </button>
      </div>
    </div>
  )
}

export default ViolationWarning
