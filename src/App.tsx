import { useState, useEffect } from 'react'
import { CalendarEvent } from './types'
import StatsCard from './components/StatsCard'
import WeeklyView from './components/WeeklyView'
import DailyView from './components/DailyView'

function App() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'weekly' | 'daily'>('weekly')
  const [generatedAt, setGeneratedAt] = useState<string>('')
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0)
  const [currentDayOffset, setCurrentDayOffset] = useState(0)

  // Get the first week with events
  const getFirstWeekWithEvents = (events: CalendarEvent[]) => {
    if (events.length === 0) return new Date()
    
    const eventDates = events.map(event => new Date(event.start))
    const earliestDate = new Date(Math.min(...eventDates.map(d => d.getTime())))
    
    // Get the start of the week for the earliest event
    const startOfWeek = new Date(earliestDate)
    startOfWeek.setDate(earliestDate.getDate() - earliestDate.getDay())
    
    return startOfWeek
  }

  useEffect(() => {
    // Load events data from events.json
    fetch('/events.json')
      .then(response => response.json())
      .then(data => {
        setEvents(data.events || [])
        setGeneratedAt(data.generatedAt || '')
        setLoading(false)
      })
      .catch(error => {
        console.error('Failed to load events:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg px-6 py-3">
            <p className="text-gray-700 font-medium">カレンダーイベントを読み込み中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">


        {/* Content */}
        {events.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              予定がありません
            </h3>
            <p className="text-gray-600 text-lg">
              スケジュールが空いています！新しい予定を追加してみましょう。
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {view === 'weekly' && <WeeklyView events={events} currentWeekOffset={currentWeekOffset} getFirstWeekWithEvents={getFirstWeekWithEvents} setCurrentWeekOffset={setCurrentWeekOffset} view={view} setView={setView} />}
            {view === 'daily' && <DailyView events={events} currentDayOffset={currentDayOffset} setCurrentDayOffset={setCurrentDayOffset} view={view} setView={setView} />}
            
            {/* Stats Card */}
            <StatsCard events={events} />
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 inline-block border border-gray-200">
            <p className="text-sm text-gray-600">
              最終更新: {generatedAt ? new Date(generatedAt).toLocaleString('ja-JP') : new Date().toLocaleString('ja-JP')}
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App