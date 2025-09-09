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
    totalAwayTime: 0,
  }

  private timeoutId: NodeJS.Timeout | null = null
  private terminationTimeoutId: NodeJS.Timeout | null = null
  private callbacks: TestMonitorCallbacks
  private isMobile: boolean

  constructor(callbacks: TestMonitorCallbacks) {
    this.callbacks = callbacks
    this.isMobile = this.detectMobile()
  }

  private detectMobile(): boolean {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) ||
      window.innerWidth <= 768 ||
      'ontouchstart' in window
    )
  }

  init() {
    this.setupVisibilityListener()
    if (!this.isMobile) {
      this.setupFocusListeners()
    }
    this.setupPageHideListener()
  }

  destroy() {
    this.clearTimeout()
    this.clearTerminationTimeout()
    document.removeEventListener(
      'visibilitychange',
      this.handleVisibilityChange
    )
    window.removeEventListener('focus', this.handleFocus)
    window.removeEventListener('blur', this.handleBlur)
    window.removeEventListener('pagehide', this.handlePageHide)
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
  }

  private setupVisibilityListener() {
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
  }

  private setupFocusListeners() {
    window.addEventListener('focus', this.handleFocus)
    window.addEventListener('blur', this.handleBlur)
  }

  private setupPageHideListener() {
    // These events are more reliable on mobile
    window.addEventListener('pagehide', this.handlePageHide)
    window.addEventListener('beforeunload', this.handleBeforeUnload)
  }

  private handleVisibilityChange = () => {
    const isVisible = !document.hidden
    const wasVisible = this.state.isVisible

    console.log(`📱 Visibility changed: ${wasVisible} -> ${isVisible}`)

    this.updateState({ isVisible })

    if (!isVisible && wasVisible && !this.state.leftAt) {
      console.log('🚨 Page became hidden - user left')
      this.handleUserLeft()
    } else if (isVisible && !wasVisible && this.state.leftAt) {
      console.log('👋 Page became visible - user returned')
      this.handleUserReturned()
    }
  }

  private handleFocus = () => {
    console.log('🎯 Window focused')
    this.updateState({ isActive: true })

    // Only handle if we're tracking a departure and page is visible
    if (this.state.leftAt && this.state.isVisible) {
      this.handleUserReturned()
    }
  }

  private handleBlur = () => {
    console.log('💨 Window blurred')
    this.updateState({ isActive: false })

    // On mobile, blur might not mean they left the test
    if (!this.isMobile && this.state.isVisible && !this.state.leftAt) {
      this.handleUserLeft()
    }
  }

  private handlePageHide = () => {
    console.log('📱 Page hide event (mobile app switch)')
    if (!this.state.leftAt) {
      this.handleUserLeft()
    }
  }

  private handleBeforeUnload = () => {
    console.log('📱 Before unload event')
    if (!this.state.leftAt) {
      this.handleUserLeft()
    }
  }

  private handleUserLeft() {
    if (this.state.leftAt) {
      console.log('⚠️ Already tracking user departure')
      return
    }

    const timestamp = Date.now()
    console.log(`🚨 User left at ${timestamp}`)
    this.updateState({ leftAt: timestamp })

    // Set 5-second timeout for auto-termination
    this.timeoutId = setTimeout(() => {
      console.log('⏰ 5-second timeout reached - terminating test')
      this.terminateTest('timeout')
    }, 5000)
  }

  private handleUserReturned() {
    if (!this.state.leftAt) {
      console.log('⚠️ Not tracking any departure')
      return
    }

    const returnTime = Date.now()
    const awayTime = returnTime - this.state.leftAt
    const totalAwayTime = this.state.totalAwayTime + awayTime

    console.log(
      `👋 User returned after ${awayTime}ms (total away: ${totalAwayTime}ms)`
    )

    this.clearTimeout()

    // If away for less than 5 seconds, count as violation
    if (awayTime < 5000) {
      const violations = this.state.violations + 1

      console.log(`⚠️ Violation #${violations} (away for ${awayTime}ms)`)

      this.updateState({
        violations,
        leftAt: null,
        totalAwayTime,
      })

      // Always show violation warning first
      console.log(`🚨 Showing violation warning (${violations}/3)`)
      this.callbacks.onViolation(violations)

      // Check for termination AFTER showing warning
      if (violations >= 3) {
        console.log('💀 3 violations reached - will terminate after warning')
        // Give user time to see the warning
        this.terminationTimeoutId = setTimeout(() => {
          this.terminateTest('violations')
        }, 3000) // Reduced from 5 seconds to 3 for faster response
      }
    } else {
      // Was away for 5+ seconds, should have been terminated
      console.log(
        `⏰ Was away for ${awayTime}ms (5+ seconds) - should have been terminated`
      )
      this.updateState({
        leftAt: null,
        totalAwayTime,
      })

      // If somehow they returned after 5+ seconds without being terminated, terminate now
      this.terminateTest('timeout')
    }
  }

  private terminateTest(reason: 'timeout' | 'violations') {
    console.log(`💀 Terminating test due to: ${reason}`)
    this.clearTimeout()
    this.clearTerminationTimeout()
    this.callbacks.onTestTerminated(reason)
  }

  private updateState(updates: Partial<TestMonitorState>) {
    this.state = { ...this.state, ...updates }
    console.log('📊 State updated:', this.state)
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
      console.log(
        '💀 Final warning acknowledged - terminating test immediately'
      )
      this.terminateTest('violations')
    }
  }
}
