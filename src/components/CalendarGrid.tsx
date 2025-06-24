import { CalendarEvent } from '../types'

interface CalendarGridProps {
  events: CalendarEvent[]
}

interface CalendarDay {
  date: Date
  events: CalendarEvent[]
  isCurrentMonth: boolean
  isToday: boolean
}

export default function CalendarGrid({ events }: CalendarGridProps) {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  // Get the first day of the month and how many days are in the month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

  // Generate calendar days
  const calendarDays: CalendarDay[] = []

  // Add days from previous month to fill the first week
  const prevMonth = new Date(currentYear, currentMonth - 1, 0)
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - 1, prevMonth.getDate() - i)
    calendarDays.push({
      date,
      events: getEventsForDate(events, date),
      isCurrentMonth: false,
      isToday: false
    })
  }

  // Add days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day)
    calendarDays.push({
      date,
      events: getEventsForDate(events, date),
      isCurrentMonth: true,
      isToday: isSameDate(date, today)
    })
  }

  // Add days from next month to fill the last week
  const remainingDays = 42 - calendarDays.length // 6 weeks × 7 days
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(currentYear, currentMonth + 1, day)
    calendarDays.push({
      date,
      events: getEventsForDate(events, date),
      isCurrentMonth: false,
      isToday: false
    })
  }

  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ]

  const dayNames = ['日', '月', '火', '水', '木', '金', '土']

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-8 py-4 sm:py-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white text-center">
          {currentYear}年 {monthNames[currentMonth]}
        </h2>
      </div>

      {/* Day Names Header */}
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
        {dayNames.map((day, index) => (
          <div
            key={day}
            className={`p-2 sm:p-4 text-center font-semibold text-xs sm:text-sm ${
              index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => (
          <CalendarCell key={index} day={day} />
        ))}
      </div>
    </div>
  )
}

interface CalendarCellProps {
  day: CalendarDay
}

function CalendarCell({ day }: CalendarCellProps) {
  const dayOfWeek = day.date.getDay()
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

  return (
    <div
      className={`min-h-[80px] sm:min-h-[120px] border-r border-b border-gray-200 p-1 sm:p-2 ${
        !day.isCurrentMonth ? 'bg-gray-50' : 'bg-white'
      } ${day.isToday ? 'bg-blue-50' : ''} hover:bg-gray-50 transition-colors`}
    >
      {/* Date */}
      <div className="flex justify-between items-start mb-1 sm:mb-2">
        <span
          className={`text-xs sm:text-sm font-medium ${
            day.isToday
              ? 'bg-blue-600 text-white w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs'
              : !day.isCurrentMonth
              ? 'text-gray-400'
              : isWeekend
              ? dayOfWeek === 0
                ? 'text-red-600'
                : 'text-blue-600'
              : 'text-gray-900'
          }`}
        >
          {day.date.getDate()}
        </span>
        {day.events.length > 0 && (
          <span className="bg-blue-600 text-white text-xs px-1 sm:px-1.5 py-0.5 rounded-full font-medium">
            {day.events.length}
          </span>
        )}
      </div>

      {/* Events */}
      <div className="space-y-0.5 sm:space-y-1">
        {/* Show 1 event on mobile, 3 on desktop */}
        {day.events.slice(0, 3).map((event, eventIndex) => (
          <div key={eventIndex} className={eventIndex === 0 ? '' : 'hidden sm:block'}>
            <EventBadge event={event} />
          </div>
        ))}
        {day.events.length > 3 && (
          <div className="text-xs text-gray-500 font-medium">
            <span className="sm:hidden">+{day.events.length - 1}件</span>
            <span className="hidden sm:inline">+{day.events.length - 3}件</span>
          </div>
        )}
        {day.events.length > 1 && day.events.length <= 3 && (
          <div className="text-xs text-gray-500 font-medium sm:hidden">
            +{day.events.length - 1}件
          </div>
        )}
      </div>
    </div>
  )
}

interface EventBadgeProps {
  event: CalendarEvent
}

function EventBadge({ event }: EventBadgeProps) {
  const startDate = new Date(event.start)
  const endDate = new Date(event.end)
  const isAllDay = 
    startDate.getHours() === 0 && 
    startDate.getMinutes() === 0 && 
    endDate.getHours() === 0 && 
    endDate.getMinutes() === 0

  return (
    <div className="bg-blue-100 text-blue-800 text-xs p-1 rounded truncate">
      <div className="font-medium truncate">{event.summary}</div>
      {!isAllDay && (
        <div className="text-blue-600 hidden sm:block">
          {startDate.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
    </div>
  )
}

function getEventsForDate(events: CalendarEvent[], date: Date): CalendarEvent[] {
  return events.filter(event => {
    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end)
    
    // Check if the event occurs on this date
    const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const dateEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)
    
    return (eventStart <= dateEnd && eventEnd >= dateStart)
  })
}

function isSameDate(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}