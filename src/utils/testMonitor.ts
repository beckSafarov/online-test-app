export interface TestMonitorState {
  isVisible: boolean
  isActive: boolean
  violations: number
  leftAt: number | null
  totalAwayTime: number
}

export interface TestMonitorCallbacks {
  onViolation: (violations: number) => void
  onTestTerminated: (reason: 'timeout' | 'violations') => void
}

export class TestMonitor {
  private state: TestMonitorState = {
    isVisible: true,
    isActive: true,
    violations: 0,
    leftAt: null,
    totalAwayTime: 0
  }

  private timeoutId: NodeJS.Timeout | null = null
  private terminationTimeoutId: NodeJS.Timeout | null = null
  private callbacks: TestMonitorCallbacks

  constructor(callbacks: TestMonitorCallbacks) {
    this.callbacks = callbacks
  }

  init() {
    this.setupVisibilityListener()
    this.setupFocusListeners()
  }

  destroy() {
    this.clearTimeout()
    this.clearTerminationTimeout()
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
    window.removeEventListener('focus', this.handleFocus)
    window.removeEventListener('blur', this.handleBlur)
  }

  private setupVisibilityListener() {
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
  }

  private setupFocusListeners() {
    window.addEventListener('focus', this.handleFocus)
    window.addEventListener('blur', this.handleBlur)
  }

  private handleVisibilityChange = () => {
    const isVisible = !document.hidden
    this.updateState({ isVisible })
    
    // Only handle visibility changes, not focus changes
    // This prevents double-counting when both visibility and focus change
    if (!isVisible && this.state.isActive) {
      this.handleUserLeft()
    } else if (isVisible && !this.state.leftAt) {
      this.handleUserReturned()
    }
  }

  private handleFocus = () => {
    this.updateState({ isActive: true })
    // Only handle pure focus changes when page is visible
    if (this.state.isVisible && this.state.leftAt) {
      this.handleUserReturned()
    }
  }

  private handleBlur = () => {
    this.updateState({ isActive: false })
    // Only handle pure blur when page is visible
    if (this.state.isVisible && !this.state.leftAt) {
      this.handleUserLeft()
    }
  }

  private handleUserLeft() {
    if (this.state.leftAt) return // Already tracking

    console.log('🚨 User left the test window')
    this.updateState({ leftAt: Date.now() })
    
    // Set 5-second timeout for auto-termination
    this.timeoutId = setTimeout(() => {
      console.log('⏰ 5-second timeout reached - terminating test')
      this.terminateTest('timeout')
    }, 5000)
  }

  private handleUserReturned() {
    if (!this.state.leftAt) return // Wasn't tracking

    const awayTime = Date.now() - this.state.leftAt
    const totalAwayTime = this.state.totalAwayTime + awayTime

    console.log(`👋 User returned after ${awayTime}ms`)

    this.clearTimeout()
    
    // If away for less than 5 seconds, count as violation
    if (awayTime < 5000) {
      const violations = this.state.violations + 1
      
      console.log(`⚠️ Violation #${violations} (away for ${awayTime}ms)`)
      
      this.updateState({
        violations,
        leftAt: null,
        totalAwayTime
      })

      // Always show violation warning first
      console.log(`� Showing violation warning (${violations}/3)`)
      this.callbacks.onViolation(violations)

      // Check for termination AFTER showing warning, with a delay
      if (violations >= 3) {
        console.log('💀 3 violations reached - will terminate after warning is acknowledged')
        // Give user time to see and acknowledge the final warning (5 seconds)
        this.terminationTimeoutId = setTimeout(() => {
          this.terminateTest('violations')
        }, 5000)
      }
    } else {
      // Was away for 5+ seconds, should have been terminated
      console.log(`⏰ Was away for ${awayTime}ms (5+ seconds) - should have been terminated`)
      this.updateState({
        leftAt: null,
        totalAwayTime
      })
    }
  }

  private terminateTest(reason: 'timeout' | 'violations') {
    this.clearTimeout()
    this.clearTerminationTimeout()
    this.callbacks.onTestTerminated(reason)
  }

  private updateState(updates: Partial<TestMonitorState>) {
    this.state = { ...this.state, ...updates }
  }

  private clearTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }

  private clearTerminationTimeout() {
    if (this.terminationTimeoutId) {
      clearTimeout(this.terminationTimeoutId)
      this.terminationTimeoutId = null
    }
  }

  getState(): TestMonitorState {
    return { ...this.state }
  }

  // Method to immediately terminate test after final warning acknowledgment
  terminateAfterFinalWarning() {
    if (this.state.violations >= 3) {
      console.log('💀 Final warning acknowledged - terminating test immediately')
      this.terminateTest('violations')
    }
  }
}
