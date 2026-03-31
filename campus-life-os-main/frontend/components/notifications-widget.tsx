"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BellRingIcon, ArrowRightIcon } from "lucide-react"

interface Reminder {
  id: number
  message: string
  priority: string
  type?: string
}

interface NotificationsWidgetProps {
  reminders: Reminder[]
  onNavigate: (view: string) => void
}

export function NotificationsWidget({ reminders, onNavigate }: NotificationsWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle>Notifications Widget</CardTitle>
            <CardDescription>Live reminders coming from the Notification Service</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onNavigate("notifications")}>
            Open Center
            <ArrowRightIcon className="ml-2 size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {reminders.length > 0 ? (
          reminders.slice(0, 4).map((reminder) => (
            <div key={reminder.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
              <div className="rounded-full bg-primary/10 p-2">
                <BellRingIcon className="size-4 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{reminder.message}</p>
                <Badge variant={reminder.priority === "high" ? "destructive" : "secondary"}>{reminder.priority}</Badge>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No reminders available from the Notification Service.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
