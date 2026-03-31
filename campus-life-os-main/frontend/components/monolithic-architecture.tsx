"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowDownIcon, ArrowRightIcon, DatabaseIcon, GlobeIcon, Layers3Icon, ServerIcon } from "lucide-react"

const appModules = [
  {
    name: "Authentication Module",
    description: "Login, register, token verification, and profile session checks in one codebase",
    routes: ["POST /auth/login", "POST /auth/register", "GET /auth/me"],
    icon: Layers3Icon,
  },
  {
    name: "Student & Dashboard Module",
    description: "Student profile and dashboard statistics handled by the same server",
    routes: ["GET /students/profile", "GET /students/stats", "GET /dashboard-summary"],
    icon: ServerIcon,
  },
  {
    name: "Tasks & Notification Module",
    description: "Tasks and reminders are tightly coupled within one deployable app",
    routes: ["GET /tasks", "PATCH /tasks/:id/complete", "GET /notifications/reminders"],
    icon: GlobeIcon,
  },
]

export function MonolithicArchitecture() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Monolithic Architecture</h1>
        <p className="text-muted-foreground">A single backend application where all modules run and deploy together.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Architecture Diagram</CardTitle>
          <CardDescription>Simple presentation view of request flow in a monolith</CardDescription>
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
              <p className="font-semibold">Single Backend App</p>
              <p className="text-sm text-muted-foreground">All modules in one process</p>
              <Badge className="mt-3">Port 4000</Badge>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDownIcon className="size-8 text-muted-foreground" />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] items-center">
            <div className="rounded-xl border border-border p-4 bg-card space-y-2 text-center">
              <p className="font-semibold text-sm">Shared Business Modules</p>
              <p className="text-sm text-muted-foreground">Auth, students, tasks, notifications inside one app</p>
            </div>
            <div className="flex justify-center">
              <ArrowRightIcon className="size-6 text-muted-foreground" />
            </div>
            <div className="rounded-xl border border-border p-4 bg-card space-y-2 text-center">
              <div className="inline-flex rounded-lg bg-primary/10 p-2">
                <DatabaseIcon className="size-5 text-primary" />
              </div>
              <p className="font-semibold text-sm">Single Database</p>
              <p className="text-sm text-muted-foreground">One main data store used by all modules</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application Modules</CardTitle>
          <CardDescription>Example module routes for a monolithic backend</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {appModules.map((module, index) => {
            const Icon = module.icon
            return (
              <div key={module.name} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{module.name}</p>
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {module.routes.map((route) => (
                    <Badge key={route} variant="secondary">{route}</Badge>
                  ))}
                </div>
                {index < appModules.length - 1 && <Separator />}
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Is Monolithic the Same as Microservices?</CardTitle>
          <CardDescription>No. They solve similar goals with different deployment and scaling models.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-border p-4">
              <p className="font-semibold">Monolithic</p>
              <p className="text-sm text-muted-foreground mt-1">Single deployable application, simple to start, tightly coupled modules.</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="font-semibold">Microservices</p>
              <p className="text-sm text-muted-foreground mt-1">Multiple deployable services, independent scaling, higher operational complexity.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
