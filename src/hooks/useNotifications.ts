import { useState, useEffect, useCallback } from 'react'
import { CalendarEvent } from '../types'

export interface NotificationSettings {
  enabled: boolean
  minutes: number
}

export const useNotifications = (events: CalendarEvent[]) => {
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    minutes: 10
  })
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  )

  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const saveSettings = useCallback((newSettings: NotificationSettings) => {
    setSettings(newSettings)
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings))
  }, [])

  const requestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') {
      console.error('このブラウザは通知をサポートしていません')
      return false
    }

    const result = await Notification.requestPermission()
    setPermission(result)
    return result === 'granted'
  }, [])

  const scheduleNotifications = useCallback(() => {
    if (!settings.enabled || permission !== 'granted') return

    const now = new Date()
    const upcomingEvents = events.filter(event => {
      const eventStart = new Date(event.start)
      const notificationTime = new Date(eventStart.getTime() - settings.minutes * 60 * 1000)
      return notificationTime > now && eventStart > now
    })

    upcomingEvents.forEach(event => {
      const eventStart = new Date(event.start)
      const notificationTime = new Date(eventStart.getTime() - settings.minutes * 60 * 1000)
      const timeUntilNotification = notificationTime.getTime() - now.getTime()

      if (timeUntilNotification > 0 && timeUntilNotification <= 24 * 60 * 60 * 1000) {
        setTimeout(() => {
          new Notification('予定のお知らせ', {
            body: `${settings.minutes}分後に「${event.summary}」が始まります`,
            icon: '/favicon.ico',
            tag: `event-${event.start}`,
            requireInteraction: false
          })
        }, timeUntilNotification)
      }
    })
  }, [events, settings, permission])

  useEffect(() => {
    if (settings.enabled && permission === 'granted') {
      scheduleNotifications()
    }
  }, [settings, permission, scheduleNotifications])

  return {
    settings,
    permission,
    saveSettings,
    requestPermission,
    scheduleNotifications
  }
}