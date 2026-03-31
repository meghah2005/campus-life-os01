"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { fetchDashboardSummaryViaGateway, fetchServicesHealthViaGateway, type ServicesHealthResponse } from "@/lib/api-gateway"
import { ServiceStatusPanel } from "@/components/service-status-panel"
import { NotificationsWidget } from "@/components/notifications-widget"
import {
  CalendarIcon,
  UsersIcon,
  FileTextIcon,
  ClockIcon,
  BellIcon,
  TrendingUpIcon,
  CheckCircle2Icon,
  ArrowRightIcon,
  SparklesIcon,
} from "lucide-react"

interface DashboardProps {
  onNavigate: (view: string) => void
  authToken?: string
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const fallbackDeadlines = [
  ]

  const fallbackStats = [
  ]

  const [upcomingDeadlines, setUpcomingDeadlines] = useState(fallbackDeadlines)
  const [activityStats, setActivityStats] = useState(fallbackStats)
  const [reminders, setReminders] = useState<Array<{ id: number; message: string; priority: string }>>([])
  const [profile, setProfile] = useState<{ name: string; department: string; gpa: number } | null>(null)
  const [recentActivity, setRecentActivity] = useState<Array<{ action: string; time: string }>>([])
  const [servicesHealth, setServicesHealth] = useState<ServicesHealthResponse | null>(null)
  const [dataSource, setDataSource] = useState<"microservices" | "local">("local")

  const totalActivity = activityStats.reduce((sum, stat) => sum + stat.value, 0)
  const highPriorityDeadlines = upcomingDeadlines.filter((deadline) => deadline.priority === "high").length
  const studentName = profile?.name || "Student"

  const quickActions = [
    { id: "deadlines", label: "View Deadlines", icon: CalendarIcon, description: "Manage assignments & exams" },
    { id: "skilltime", label: "Find Peers", icon: UsersIcon, description: "Discover student skills" },
    { id: "forms", label: "Submit Forms", icon: FileTextIcon, description: "Portal & form helper" },
    { id: "booking", label: "Book Slot", icon: ClockIcon, description: "Office appointments" },
  ]

  const handleNavigate = (view: string) => {
    onNavigate(view)
  }

  useEffect(() => {
    let isMounted = true

    const loadDashboardSummary = async () => {
      try {
        const [data, health] = await Promise.all([fetchDashboardSummaryViaGateway(), fetchServicesHealthViaGateway()])

        if (!isMounted) {
          return
        }

        if (Array.isArray(data.activityStats)) {
          setActivityStats(data.activityStats)
        }

        if (Array.isArray(data.upcomingDeadlines)) {
          setUpcomingDeadlines(data.upcomingDeadlines)
        }

        if (Array.isArray(data.reminders)) {
          setReminders(data.reminders)
        }

        if (data.profile) {
          setProfile({
            name: data.profile.name,
            department: data.profile.department,
            gpa: data.profile.gpa,
          })
        }

        if (Array.isArray(data.recentActivity)) {
          setRecentActivity(data.recentActivity)
        }

        setServicesHealth(health)

        setDataSource(data.source === "microservices" ? "microservices" : "local")
      } catch {
        if (isMounted) {
          setDataSource("local")
        }
      }
    }

    loadDashboardSummary()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-800 text-white shadow-xl">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-400/20 blur-2xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-blue-300/20 blur-2xl" />
        <CardContent className="relative flex flex-col gap-6 p-6 md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                <SparklesIcon className="size-3.5" />
                Campus Life OS
              </p>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">Welcome back, {studentName}</h1>
              <p className="max-w-xl text-sm text-cyan-100 md:text-base">Your academics, deadlines, peers, and campus tools in one live dashboard.</p>
            </div>
            <Badge variant="secondary" className="w-fit border-0 bg-white/20 text-white hover:bg-white/25">
              {dataSource === "microservices" ? "Live: Microservices" : "Local Fallback"}
            </Badge>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/20 bg-white/10 p-3">
              <p className="text-xs text-cyan-100">Total Activity</p>
              <p className="text-2xl font-bold">{totalActivity}</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 p-3">
              <p className="text-xs text-cyan-100">High Priority Deadlines</p>
              <p className="text-2xl font-bold">{highPriorityDeadlines}</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 p-3">
              <p className="text-xs text-cyan-100">Active Modules</p>
              <p className="text-2xl font-bold">20+</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl font-bold tracking-tight">Daily Overview</h2>
        </div>
        <p className="text-muted-foreground text-sm">{"Here is what's happening with your campus life today."}</p>
      </div>

      <ServiceStatusPanel health={servicesHealth} />

      {reminders[0] ? (
        <Card className="border-border/80 bg-card/85">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-primary/12 p-2">
              <BellIcon className="size-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold">Priority Reminder</h3>
              <p className="text-sm text-muted-foreground">{reminders[0].message}</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => handleNavigate("notifications")}>
              Open Alerts
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {/* Activity Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {activityStats.map((stat, index) => (
          <Card
            key={stat.label}
            className={
              index === 0
                ? "border-blue-200 bg-blue-50/50"
                : index === 1
                  ? "border-emerald-200 bg-emerald-50/50"
                  : "border-violet-200 bg-violet-50/50"
            }
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <TrendingUpIcon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <Progress value={stat.value * 10} className="mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {profile && (
        <Card>
          <CardHeader>
            <CardTitle>Live Student Profile</CardTitle>
            <CardDescription>Loaded from the Student Service through the API Gateway</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Student</p>
              <p className="font-semibold">{profile.name}</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Department</p>
              <p className="font-semibold">{profile.department}</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">GPA</p>
              <p className="font-semibold">{profile.gpa}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>{"Don't miss these important dates"}</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleNavigate("deadlines")}>
                View All
                <ArrowRightIcon className="ml-2 size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingDeadlines.map((deadline) => (
              <div
                key={deadline.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CalendarIcon className="size-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{deadline.title}</p>
                    <p className="text-xs text-muted-foreground">{deadline.date}</p>
                  </div>
                </div>
                <Badge variant={deadline.priority === "high" ? "destructive" : "secondary"}>{deadline.priority}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Navigate to key campus features</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto flex-col items-start gap-2 p-4 hover:bg-primary hover:text-primary-foreground transition-colors bg-transparent"
                onClick={() => handleNavigate(action.id)}
              >
                <action.icon className="size-5" />
                <div className="text-left">
                  <div className="font-semibold text-sm">{action.label}</div>
                  <div className="text-xs opacity-80">{action.description}</div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        <NotificationsWidget reminders={reminders} onNavigate={handleNavigate} />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest campus interactions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(recentActivity.length > 0
            ? recentActivity.map((activity, i) => ({
                ...activity,
                icon: i % 3 === 0 ? FileTextIcon : i % 3 === 1 ? UsersIcon : CheckCircle2Icon,
              }))
            : [
                { action: "Submitted Library Access Form", time: "2 hours ago", icon: FileTextIcon },
                { action: "Registered skill: Python Programming", time: "Yesterday", icon: UsersIcon },
                { action: "Completed Database Assignment", time: "2 days ago", icon: CheckCircle2Icon },
              ]).map((activity, i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <div className="rounded-full bg-muted p-2">
                <activity.icon className="size-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
