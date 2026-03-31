"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BellIcon, CalendarIcon, UsersIcon, FileTextIcon, AlertCircleIcon } from "lucide-react"

interface Notification {
  id: number
  title: string
  message: string
  type: "deadline" | "skill" | "form" | "announcement" | "alert"
  time: string
  read: boolean
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Deadline Reminder",
      message: "Data Structures Assignment due in 2 days",
      type: "deadline",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 2,
      title: "Skill Request",
      message: "Priya P. wants to learn React from you",
      type: "skill",
      time: "3 hours ago",
      read: false,
    },
    {
      id: 3,
      title: "Form Submission",
      message: "Your Library Access Form has been approved",
      type: "form",
      time: "Yesterday",
      read: true,
    },
    {
      id: 4,
      title: "Campus Announcement",
      message: "Tech Fest registration opens next week",
      type: "announcement",
      time: "2 days ago",
      read: true,
    },
    {
      id: 5,
      title: "Overload Alert",
      message: "You have 8 pending tasks this week",
      type: "alert",
      time: "Today",
      read: false,
    },
  ])

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "deadline":
        return <CalendarIcon className="size-4" />
      case "skill":
        return <UsersIcon className="size-4" />
      case "form":
        return <FileTextIcon className="size-4" />
      case "announcement":
        return <BellIcon className="size-4" />
      case "alert":
        return <AlertCircleIcon className="size-4" />
    }
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notification Center</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        <Button variant="outline" onClick={markAllAsRead}>
          Mark All as Read
        </Button>
      </div>

      {/* Announcement Banner */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-2">
              <BellIcon className="size-4 text-primary" />
            </div>
            <CardTitle className="text-base">Campus Announcements</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm">
            <p className="font-medium">Annual Tech Fest 2026</p>
            <p className="text-muted-foreground text-xs mt-1">
              {"Registration opens next week. Don't miss out on exciting competitions and workshops!"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card key={notification.id} className={notification.read ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className={`rounded-full p-2 h-fit ${notification.read ? "bg-muted" : "bg-primary/10"}`}>
                  <div className={notification.read ? "text-muted-foreground" : "text-primary"}>
                    {getIcon(notification.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{notification.title}</h3>
                        {!notification.read && <div className="size-2 rounded-full bg-primary" />}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {notification.type}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
