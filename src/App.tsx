import { useState, useEffect } from "react";
import { CalendarEvent } from "./types";
import WeeklyView from "./components/WeeklyView";
import DailyView from "./components/DailyView";
import NotificationSettings from "./components/NotificationSettings";
import Button from "./components/Button";
import { useNotifications } from "./hooks/useNotifications";

function App() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatedAt, setGeneratedAt] = useState<string>("");
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [currentDayOffset, setCurrentDayOffset] = useState(0);
  const [view, setView] = useState<"weekly" | "daily">("weekly");

  const {
    settings: notificationSettings,
    permission: notificationPermission,
    saveSettings: saveNotificationSettings,
    requestPermission: requestNotificationPermission,
  } = useNotifications(events);

  // Get the start of current week
  const getCurrentWeekStart = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  };

  useEffect(() => {
    // Check if mobile on mount and window resize
    const checkMobile = () => {
      const isMobile = window.innerWidth < 640; // Tailwind's sm breakpoint
      setView(isMobile ? "daily" : "weekly");
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Load events data from events.json
    fetch(import.meta.env.BASE_URL + "events.json")
      .then((response) => response.json())
      .then((data) => {
        // Filter out events with "休み：" in the summary
        const filteredEvents = (data.events || []).filter((event: CalendarEvent) => 
          !event.summary.includes("休み：")
        );
        setEvents(filteredEvents);
        setGeneratedAt(data.generatedAt || "");
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load events:", error);
        setLoading(false);
      });

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg px-6 py-3">
            <p className="text-gray-700 font-medium">
              カレンダーイベントを読み込み中...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Content */}
        {events.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
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
            {view === "weekly" ? (
              <WeeklyView
                events={events}
                currentWeekOffset={currentWeekOffset}
                getCurrentWeekStart={getCurrentWeekStart}
                setCurrentWeekOffset={setCurrentWeekOffset}
              />
            ) : (
              <DailyView
                events={events}
                currentDayOffset={currentDayOffset}
                setCurrentDayOffset={setCurrentDayOffset}
                view={view}
                setView={setView}
              />
            )}

            {/* Additional Features */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
                {/* ICS Export */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        カレンダーエクスポート
                      </h4>
                      <p className="text-sm text-gray-600">
                        ICS形式でダウンロード
                      </p>
                    </div>
                    <a
                      href={`${import.meta.env.BASE_URL}naari3-meetings.ics`}
                      download="naari3-meetings.ics"
                      className="inline-block"
                    >
                      <Button variant="secondary" onClick={() => {}}>
                        ダウンロード
                      </Button>
                    </a>
                  </div>
                </div>

                {/* Notification Settings */}
                <NotificationSettings
                  settings={notificationSettings}
                  permission={notificationPermission}
                  onSettingsChange={saveNotificationSettings}
                  onRequestPermission={requestNotificationPermission}
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 inline-block border border-gray-200">
            <p className="text-sm text-gray-600">
              最終更新:{" "}
              {generatedAt
                ? new Date(generatedAt).toLocaleString("ja-JP")
                : new Date().toLocaleString("ja-JP")}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
