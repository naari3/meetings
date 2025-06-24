import { useState, useEffect } from 'react'
import { CalendarEvent } from './types'
import EventCard from './components/EventCard'
import StatsCard from './components/StatsCard'
import CalendarGrid from './components/CalendarGrid'

function App() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list' | 'calendar'>('calendar')
  const [generatedAt, setGeneratedAt] = useState<string>('')

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
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
            空き時間カレンダー
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            あなたの予定を美しいカレンダー形式で表示し、空き時間を把握できます
          </p>
        </header>

        {/* Stats Card */}
        <StatsCard events={events} />

        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 shadow-lg border border-gray-200 inline-flex">
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center ${
                view === 'calendar'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>カレンダー表示</span>
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center ${
                view === 'list'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span>リスト表示</span>
            </button>
          </div>
        </div>

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
          <div className="space-y-8">
            {view === 'calendar' ? (
              <CalendarGrid events={events} />
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    今後の予定
                  </h2>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {events.length}件の予定
                  </span>
                </div>
                <div className="space-y-4">
                  {events.map((event, index) => (
                    <EventCard key={index} event={event} />
                  ))}
                </div>
              </div>
            )}
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