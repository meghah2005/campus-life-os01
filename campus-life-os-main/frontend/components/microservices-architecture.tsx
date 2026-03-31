"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowDownIcon, ArrowRightIcon, BellRingIcon, BookOpenCheckIcon, Building2Icon, ServerCogIcon, ShieldCheckIcon, UserCircle2Icon } from "lucide-react"

const services = [
  {
    name: "API Gateway",
    port: 4000,
    description: "Single entry point used by the Next.js frontend",
    routes: ["GET /api/services/health", "POST /api/auth/login", "GET /api/dashboard-summary"],
    icon: ServerCogIcon,
  },
  {
    name: "Auth Service",
    port: 4003,
    description: "Handles JWT login, register, verify, refresh, and current user",
    routes: ["GET /health", "POST /api/auth/login", "GET /api/auth/me"],
    icon: ShieldCheckIcon,
  },
  {
    name: "Student Service",
    port: 4001,
    description: "Provides student profile, activity, and dashboard statistics",
    routes: ["GET /health", "GET /api/students/profile", "GET /api/students/stats"],
    icon: UserCircle2Icon,
  },
  {
    name: "Tasks Service",
    port: 4002,
    description: "Manages task list, deadlines, and completion state",
    routes: ["GET /health", "GET /api/tasks", "PATCH /api/tasks/:id/complete"],
    icon: BookOpenCheckIcon,
  },
  {
    name: "Notification Service",
    port: 4004,
    description: "Builds reminders and alerts from task data",
    routes: ["GET /health", "GET /api/notifications/reminders", "POST /api/notifications/alert"],
    icon: BellRingIcon,
  },
  {
    name: "Campus Service",
    port: 4005,
    description: "Serves lost and found items plus the campus directory",
    routes: ["GET /health", "GET /api/lost-found/items", "GET /api/directory/people"],
    icon: Building2Icon,
  },
]

export function MicroservicesArchitecture() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Microservices Architecture</h1>
        <p className="text-muted-foreground">A visible overview of how the Next.js frontend communicates with the Node.js microservice backend.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Architecture Diagram</CardTitle>
          <CardDescription>Simple presentation view of request flow</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] items-center">
            <div className="rounded-xl border border-border p-5 text-center bg-card">
              <p className="font-semibold">Next.js Frontend</p>
              <p className="text-sm text-muted-foreground">UI / Dashboard / Login</p>
              <Badge variant="outline" className="mt-3">Port 3000</Badge>
            </div>
            <div className="flex justify-center">
              <ArrowRightIcon className="size-8 text-muted-foreground" />
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 text-center">
              <p className="font-semibold">API Gateway</p>
              <p className="text-sm text-muted-foreground">Single route entry point</p>
              <Badge className="mt-3">Port 4000</Badge>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDownIcon className="size-8 text-muted-foreground" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {services.slice(1).map((service) => {
              const Icon = service.icon
              return (
                <div key={service.name} className="rounded-xl border border-border p-4 bg-card space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{service.name}</p>
                      <p className="text-xs text-muted-foreground">Port {service.port}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service Routes</CardTitle>
          <CardDescription>Example health and API routes used in the demo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div key={service.name} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{service.name}</p>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {service.routes.map((route) => (
                    <Badge key={route} variant="secondary">{route}</Badge>
                  ))}
                </div>
                {index < services.length - 1 && <Separator />}
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
