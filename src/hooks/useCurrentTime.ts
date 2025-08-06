import { useState, useEffect } from 'react'

export const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(() => new Date())

  useEffect(() => {
    // Calculate ms until the next minute starts (at 0 seconds)
    const now = new Date()
    const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds()

    // Wait until the next minute starts, then begin regular updates
    const timeout = setTimeout(() => {
      setCurrentTime(new Date())
      
      // Update every minute thereafter
      const interval = setInterval(() => {
        setCurrentTime(new Date())
      }, 60000)

      // Cleanup interval on unmount
      return () => clearInterval(interval)
    }, msUntilNextMinute)

    // Also set an interval for the initial period
    const initialInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    // Cleanup on unmount
    return () => {
      clearTimeout(timeout)
      clearInterval(initialInterval)
    }
  }, [])

  return {
    currentHour: currentTime.getHours(),
    currentMinutes: currentTime.getMinutes()
  }
}