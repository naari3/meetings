import { CalendarEvent } from '../types'

interface StatsCardProps {
  events: CalendarEvent[]
}

export default function StatsCard({ events }: StatsCardProps) {
  const totalEvents = events.length
  
  const totalDuration = events.reduce((acc, event) => {
    const start = new Date(event.start)
    const end = new Date(event.end)
    return acc + (end.getTime() - start.getTime())
  }, 0)
  
  const totalHours = Math.round(totalDuration / (1000 * 60 * 60) * 10) / 10

  const today = new Date()
  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.start)
    return eventDate.toDateString() === today.toDateString()
  })

  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.start)
    return eventDate > today
  })

  const thisWeekEvents = events.filter(event => {
    const eventDate = new Date(event.start)
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    return eventDate >= weekStart && eventDate <= weekEnd
  })

  const averagePerDay = totalEvents > 0 ? (totalHours / 7).toFixed(1) : '0'

  const stats = [
    {
      id: 'total',
      label: '総予定数',
      value: totalEvents,
      suffix: '件',
      icon: 'calendar',
      color: 'blue',
      bgGradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'duration',
      label: '総時間',
      value: totalHours,
      suffix: '時間',
      icon: 'clock',
      color: 'green',
      bgGradient: 'from-green-500 to-green-600'
    },
    {
      id: 'today',
      label: '今日の予定',
      value: todayEvents.length,
      suffix: '件',
      icon: 'star',
      color: 'orange',
      bgGradient: 'from-orange-500 to-orange-600'
    },
    {
      id: 'upcoming',
      label: '今後の予定',
      value: upcomingEvents.length,
      suffix: '件',
      icon: 'arrow-right',
      color: 'purple',
      bgGradient: 'from-purple-500 to-purple-600'
    }
  ]

  const iconMap = {
    calendar: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    ),
    clock: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    star: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    ),
    'arrow-right': (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    )
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ダッシュボード</h2>
        <p className="text-gray-600">なありのスケジュールの概要</p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.id} className="relative overflow-hidden bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group w-full sm:w-auto sm:min-w-[200px] sm:flex-1 sm:max-w-[240px]">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.bgGradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {iconMap[stat.icon]}
                </svg>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-baseline space-x-1">
                <span className={`text-3xl font-bold ${
                  stat.id === 'total' ? 'text-blue-600' :
                  stat.id === 'duration' ? 'text-green-600' :
                  stat.id === 'today' ? 'text-orange-600' :
                  'text-purple-600'
                }`}>
                  {stat.value}
                </span>
                <span className={`text-sm font-medium ${
                  stat.id === 'total' ? 'text-blue-500' :
                  stat.id === 'duration' ? 'text-green-500' :
                  stat.id === 'today' ? 'text-orange-500' :
                  'text-purple-500'
                }`}>
                  {stat.suffix}
                </span>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                {stat.label}
              </p>
            </div>
            
            {/* Background decoration */}
            <div className={`absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r ${stat.bgGradient} opacity-5 rounded-full group-hover:opacity-10 transition-opacity duration-200`}></div>
          </div>
        ))}
      </div>

      {/* Additional insights */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">詳細情報</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center justify-between bg-white rounded-lg p-3 w-full sm:w-auto sm:min-w-[160px] sm:flex-1">
            <span className="text-gray-600">今週の予定:</span>
            <span className="font-semibold text-gray-900">{thisWeekEvents.length}件</span>
          </div>
          <div className="flex items-center justify-between bg-white rounded-lg p-3 w-full sm:w-auto sm:min-w-[160px] sm:flex-1">
            <span className="text-gray-600">週平均時間:</span>
            <span className="font-semibold text-gray-900">{averagePerDay}時間/日</span>
          </div>
          <div className="flex items-center justify-between bg-white rounded-lg p-3 w-full sm:w-auto sm:min-w-[160px] sm:flex-1">
            <span className="text-gray-600">平均予定時間:</span>
            <span className="font-semibold text-gray-900">
              {totalEvents > 0 ? Math.round(totalHours / totalEvents * 10) / 10 : 0}時間/件
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}