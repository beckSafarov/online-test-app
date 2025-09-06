import { create } from 'zustand'

export interface TestData {
  id: string
  title: string
  description?: string
  questions?: any[]
  // Add other properties based on your test data structure
}

interface TestStore {
  currentTest: TestData | null
  isLoading: boolean
  error: string | null
  setCurrentTest: (test: TestData) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearTest: () => void
}

export const useTestStore = create<TestStore>((set) => ({
  currentTest: null,
  isLoading: false,
  error: null,
  setCurrentTest: (test) => set({ currentTest: test, error: null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
  clearTest: () => set({ currentTest: null, error: null, isLoading: false }),
}))
