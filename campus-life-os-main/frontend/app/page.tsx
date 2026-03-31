"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Dashboard } from "@/components/dashboard"
import { DeadlineManager } from "@/components/deadline-manager"
import { SkillTimeHub } from "@/components/skilltime-hub"
import { FormsPortal } from "@/components/forms-portal"
import { LostFound } from "@/components/lost-found"
import { QueueBooking } from "@/components/queue-booking"
import { HelpBot } from "@/components/helpbot"
import { NotificationCenter } from "@/components/notification-center"
import { MobileNav } from "@/components/mobile-nav"
import { EventsCalendar } from "@/components/events-calendar"
import { StudyGroups } from "@/components/study-groups"
import { GPACalculator } from "@/components/gpa-calculator"
import { AttendanceTracker } from "@/components/attendance-tracker"
import { NotesSharing } from "@/components/notes-sharing"
import { StudyTimer } from "@/components/study-timer"
import { CampusMarketplace } from "@/components/campus-marketplace"
import { QRScanner } from "@/components/qr-scanner"
import { AuthPage } from "@/components/auth-page"
import { CampusMap } from "@/components/campus-map"
import { MealPlanTracker } from "@/components/meal-plan-tracker"
import { RideSharing } from "@/components/ride-sharing"
import { CampusDirectory } from "@/components/campus-directory"
import { MicroservicesArchitecture } from "@/components/microservices-architecture"
import { MonolithicArchitecture } from "@/components/monolithic-architecture"

const SESSION_STORAGE_KEY = "campus-life-os-session"
const VIEW_STORAGE_KEY = "campus-life-os-current-view"

export default function CampusLifeOS() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)
  const [authToken, setAuthToken] = useState<string>("")
  const [currentView, setCurrentView] = useState<string>("dashboard")
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  useEffect(() => {
    try {
      const storedSession = localStorage.getItem(SESSION_STORAGE_KEY)
      const storedView = localStorage.getItem(VIEW_STORAGE_KEY)

      if (storedSession) {
        const parsed = JSON.parse(storedSession) as { user: { email: string; name: string }; token: string }
        if (parsed?.user?.email && parsed?.user?.name && parsed?.token) {
          setUser(parsed.user)
          setAuthToken(parsed.token)
          setIsAuthenticated(true)
        }
      }

      if (storedView) {
        setCurrentView(storedView)
      }
    } catch {
      localStorage.removeItem(SESSION_STORAGE_KEY)
      localStorage.removeItem(VIEW_STORAGE_KEY)
    } finally {
      setIsBootstrapping(false)
    }
  }, [])

  const handleNavigate = (view: string) => {
    setCurrentView(view)
    localStorage.setItem(VIEW_STORAGE_KEY, view)
  }

  const handleLogin = (email: string, name: string, token: string) => {
    const session = { user: { email, name }, token }
    setUser({ email, name })
    setAuthToken(token)
    setIsAuthenticated(true)
    setCurrentView("dashboard")
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
    localStorage.setItem(VIEW_STORAGE_KEY, "dashboard")
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
    setAuthToken("")
    setCurrentView("dashboard")
    localStorage.removeItem(SESSION_STORAGE_KEY)
    localStorage.removeItem(VIEW_STORAGE_KEY)
  }

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="app-surface px-6 py-4 text-sm text-muted-foreground">Loading Campus Life OS...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthPage onLogin={handleLogin} />
  }

  return (
    <div className="app-shell relative overflow-x-clip">
      <div className="app-orb app-orb-1" aria-hidden="true" />
      <div className="app-orb app-orb-2" aria-hidden="true" />
      <div className="app-orb app-orb-3" aria-hidden="true" />
      <Header currentView={currentView} onNavigate={handleNavigate} user={user} onLogout={handleLogout} />
      <main className="container mx-auto max-w-7xl px-4 py-6 pb-24 md:pb-8">
        <section key={currentView} className="view-fade-in">
          {currentView === "dashboard" && <Dashboard onNavigate={handleNavigate} authToken={authToken} />}
          {currentView === "deadlines" && <DeadlineManager />}
          {currentView === "skilltime" && <SkillTimeHub />}
          {currentView === "forms" && <FormsPortal />}
          {currentView === "lostfound" && <LostFound />}
          {currentView === "booking" && <QueueBooking />}
          {currentView === "notifications" && <NotificationCenter />}
          {currentView === "events" && <EventsCalendar />}
          {currentView === "studygroups" && <StudyGroups />}
          {currentView === "gpa" && <GPACalculator />}
          {currentView === "attendance" && <AttendanceTracker />}
          {currentView === "notes" && <NotesSharing />}
          {currentView === "timer" && <StudyTimer />}
          {currentView === "marketplace" && <CampusMarketplace />}
          {currentView === "scanner" && <QRScanner />}
          {currentView === "map" && <CampusMap />}
          {currentView === "mealplan" && <MealPlanTracker />}
          {currentView === "rideshare" && <RideSharing />}
          {currentView === "directory" && <CampusDirectory />}
          {currentView === "microservices-architecture" && <MicroservicesArchitecture />}
          {currentView === "monolithic-architecture" && <MonolithicArchitecture />}
        </section>
      </main>
      <HelpBot />
      <MobileNav currentView={currentView} onNavigate={handleNavigate} />
    </div>
  )
}
