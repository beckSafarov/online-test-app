export const fetch_test = async (id: string | null) => {
  if (!id) throw new Error('Test ID is required')
  try {
    const response = await fetch(`/api/questions/${id}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch test')
    }

    return data
  } catch (error) {
    console.error('Error fetching test:', error)
    throw error
  }
}

