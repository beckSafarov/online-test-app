interface Answer {
  questionId: string
  answer: string | string[]
}

export async function submitTestResults(sessionId: string, answers: Answer[]) {
  try {
    console.log(
      'Sessiya uchun natijalar yuborilmoqda:',
      sessionId,
      'javoblar soni:',
      answers.length
    )

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
      console.error('Natijalarni yuborib bolmadi:', responseData)
      throw new Error(
        responseData.details ||
          responseData.error ||
          'Test natijalarini yuborib bolmadi'
      )
    }

    console.log('Natijalar muvaffaqiyatli yuborildi:', responseData)
    return responseData
  } catch (error) {
    console.error('Test natijalarini yuborishda xatolik:', error)
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
    console.log(
      'Test sessiyasi yakunlanmoqda:',
      sessionId,
      'testId:',
      testId,
      'qoidabuzarlik:',
      didViolate,
      'yakunlandi:',
      isCompleted
    )

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
        submitted_at: new Date().toISOString(),
        is_open: false,
      }),
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('Test sessiyasini yakunlab bo‘lmadi:', responseData)
      throw new Error(
        responseData.details ||
          responseData.error ||
          'Test sessiyasini yakunlab bo‘lmadi'
      )
    }

    console.log('Test sessiyasi muvaffaqiyatli yakunlandi:', responseData)
    return responseData
  } catch (error) {
    console.error('Test sessiyasini yakunlashda xatolik:', error)
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
    console.error('Testni odatdagi tarzda yakunlashda xatolik:', error)
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
    console.error('Qoidabuzarlik uchun testni yakunlashda xatolik:', error)
    throw error
  }
}
