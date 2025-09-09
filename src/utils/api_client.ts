export const fetch_test = async (id: string | null) => {
  if (!id) throw new Error('Test ID talab qilinadi')
  try {
    const response = await fetch(`/api/questions/${id}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Testni olish muvaffaqiyatsiz')
    }

    return data
  } catch (error) {
    console.error('Testni olishda xatolik:', error)
    throw error
  }
}


// Add this interface for type safety
interface SessionStatusResponse {
  sessionId: string
  is_open: boolean
  error?: string
}

export const checkSessionStatus = async (sessionId: string): Promise<{
  success: boolean
  isOpen: boolean
  error?: string
}> => {
  try {
    const response = await fetch(`/api/test_session/check-status?sessionId=${sessionId}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data: SessionStatusResponse = await response.json()
    
    if (data.error) {
      throw new Error(data.error)
    }
    
    return {
      success: true,
      isOpen: data.is_open ?? false
    }
    
  } catch (error) {
    return {
      success: false,
      isOpen: false,
      error: error instanceof Error ? error.message : 'Noma’lum xatolik',
    }
  }
}
