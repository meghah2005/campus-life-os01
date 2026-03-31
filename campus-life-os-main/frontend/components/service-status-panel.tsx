"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ServerIcon, ShieldCheckIcon, BookOpenCheckIcon, BellRingIcon, UserCircle2Icon, Building2Icon } from "lucide-react"
import type { ServicesHealthResponse } from "@/lib/api-gateway"

const iconMap = {
  "api-gateway": ServerIcon,
  "auth-service": ShieldCheckIcon,
  "student-service": UserCircle2Icon,
  "tasks-service": BookOpenCheckIcon,
  "notification-service": BellRingIcon,
  "campus-service": Building2Icon,
} as const

interface ServiceStatusPanelProps {
  health: ServicesHealthResponse | null
}

export function ServiceStatusPanel({ health }: ServiceStatusPanelProps) {
  if (!health) {
    return null
  }

  const services = [health.gateway, ...health.services]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Status Panel</CardTitle>
        <CardDescription>Live health checks from the API Gateway and backend microservices</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {services.map((item) => {
          const Icon = iconMap[item.service as keyof typeof iconMap] || ServerIcon
          const statusLabel = item.status || "unknown"
          const isHealthy = statusLabel === "ok"

          return (
            <div key={item.service} className="rounded-xl border border-border p-4 space-y-3 bg-card">
              <div className="flex items-center justify-between gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Icon className="size-5 text-primary" />
                </div>
                <Badge variant={isHealthy ? "default" : "secondary"}>{isHealthy ? "Healthy" : statusLabel}</Badge>
              </div>
              <div>
                <p className="font-semibold text-sm capitalize">{item.service.replace(/-/g, " ")}</p>
                <p className="text-xs text-muted-foreground">
                  {item.service === "api-gateway" ? "Routes frontend requests" : "Responding to gateway health checks"}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
