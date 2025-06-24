import { CalendarEvent } from '../types'

interface EventCardProps {
  event: CalendarEvent
}

export default function EventCard({ event }: EventCardProps) {
  const startDate = new Date(event.start)
  const endDate = new Date(event.end)
  
  const duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60))
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60
  const durationText = hours > 0 ? `${hours}時間${minutes > 0 ? `${minutes}分` : ''}` : `${minutes}分`

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isAllDay = 
    startDate.getHours() === 0 && 
    startDate.getMinutes() === 0 && 
    endDate.getHours() === 0 && 
    endDate.getMinutes() === 0

  const isToday = () => {
    const today = new Date()
    return startDate.toDateString() === today.toDateString()
  }

  const isUpcoming = () => {
    const now = new Date()
    return startDate > now
  }

  return (
    <div className="group relative bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200">
      {/* Status indicator */}
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
        {isToday() && (
          <div className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
            今日
          </div>
        )}
        {isUpcoming() && !isToday() && (
          <div className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
            予定
          </div>
        )}
      </div>

      <div className="pr-12 sm:pr-16">
        {/* Event title */}
        <div className="flex items-center mb-3">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-3 flex-shrink-0"></div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {event.summary}
          </h3>
        </div>

        {/* Date and time */}
        <div className="space-y-2">
          <div className="flex items-center text-gray-600 text-sm sm:text-base">
            <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">{formatDate(startDate)}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm sm:text-base">
            <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {isAllDay ? (
              <span>終日</span>
            ) : (
              <span>{formatTime(startDate)} - {formatTime(endDate)}</span>
            )}
          </div>
        </div>

        {/* Duration and description */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {durationText}
            </span>
          </div>
          {event.description && (
            <span className="text-sm text-gray-500 italic">
              {event.description}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}