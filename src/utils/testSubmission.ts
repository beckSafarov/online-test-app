interface Answer {
  questionId: string
  answer: string | string[]
}

export async function submitTestResults(
  sessionId: string,
  answers: Answer[],
) {
  try {
    console.log('Submitting results for session:', sessionId, 'with answers:', answers.length)
    
    const response = await fetch('/api/results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answers,
        session_id: sessionId,
      }),
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('Failed to submit results:', responseData)
      throw new Error(responseData.details || responseData.error || 'Failed to submit test results')
    }

    console.log('Results submitted successfully:', responseData)
    return responseData
  } catch (error) {
    console.error('Error submitting test results:', error)
    throw error
  }
}

export async function endTestSession(
  sessionId: string,
  testId: string,
  didViolate: boolean = false,
  isCompleted: boolean = true
) {
  try {
    console.log('Ending test session:', sessionId, 'testId:', testId, 'didViolate:', didViolate, 'isCompleted:', isCompleted)
    
    const response = await fetch('/api/test_session', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        test_id: testId,
        did_violate: didViolate,
        is_completed: isCompleted,
        submitted_at: new Date().toISOString()
      }),
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('Failed to end test session:', responseData)
      throw new Error(responseData.details || responseData.error || 'Failed to end test session')
    }

    console.log('Test session ended successfully:', responseData)
    return responseData
  } catch (error) {
    console.error('Error ending test session:', error)
    throw error
  }
}

export async function completeTestNormally(
  testId: string,
  sessionId: string,
  answers: Answer[]
) {
  try {
    // Submit results first
    await submitTestResults(sessionId, answers)
    
    // End session successfully: did_violate=false, is_completed=true
    await endTestSession(sessionId, testId, false, true)
    
    return { success: true }
  } catch (error) {
    console.error('Error completing test normally:', error)
    throw error
  }
}

export async function terminateTestForViolation(
  testId: string,
  sessionId: string,
  answers: Answer[]
) {
  try {
    // Submit results first
    await submitTestResults(sessionId, answers)
    
    // End session with violation: did_violate=true, is_completed=false
    await endTestSession(sessionId, testId, true, false)
    
    return { success: true }
  } catch (error) {
    console.error('Error terminating test for violation:', error)
    throw error
  }
}
