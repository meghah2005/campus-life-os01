"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileTextIcon, CheckCircle2Icon, ClockIcon, AlertCircleIcon, ExternalLinkIcon } from "lucide-react"

interface Form {
  id: number
  name: string
  category: string
  deadline: string
  status: "pending" | "submitted" | "overdue"
  priority: "high" | "medium" | "low"
  link: string
}

export function FormsPortal() {
  const [forms, setForms] = useState<Form[]>([
    {
      id: 1,
      name: "Library Access Form",
      category: "Access",
      deadline: "2026-01-10",
      status: "submitted",
      priority: "medium",
      link: "#",
    },
    {
      id: 2,
      name: "Semester Registration",
      category: "Academic",
      deadline: "2026-01-15",
      status: "pending",
      priority: "high",
      link: "#",
    },
    {
      id: 3,
      name: "Hostel Application",
      category: "Accommodation",
      deadline: "2026-01-12",
      status: "pending",
      priority: "high",
      link: "#",
    },
    {
      id: 4,
      name: "Fee Payment Receipt",
      category: "Finance",
      deadline: "2026-01-08",
      status: "submitted",
      priority: "high",
      link: "#",
    },
    {
      id: 5,
      name: "Sports Club Registration",
      category: "Extracurricular",
      deadline: "2026-01-20",
      status: "pending",
      priority: "low",
      link: "#",
    },
  ])

  const pendingForms = forms.filter((f) => f.status === "pending")
  const submittedForms = forms.filter((f) => f.status === "submitted")
  const completionRate = (submittedForms.length / forms.length) * 100

  const getStatusIcon = (status: Form["status"]) => {
    switch (status) {
      case "submitted":
        return <CheckCircle2Icon className="size-4 text-green-600" />
      case "pending":
        return <ClockIcon className="size-4 text-yellow-600" />
      case "overdue":
        return <AlertCircleIcon className="size-4 text-destructive" />
    }
  }

  const markAsSubmitted = (id: number) => {
    setForms(forms.map((f) => (f.id === id ? { ...f, status: "submitted" as const } : f)))
  }

  return (
    <div className="space-y-6">
      <Card className="app-surface">
        <CardHeader>
          <CardTitle className="text-2xl">Forms Portal</CardTitle>
          <CardDescription>Track submission progress and finish high-priority forms on time.</CardDescription>
        </CardHeader>
      </Card>

      {/* Progress Overview */}
      <Card className="app-surface">
        <CardHeader>
          <CardTitle>Submission Progress</CardTitle>
          <CardDescription>Track your form completion status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {submittedForms.length} of {forms.length} forms submitted
              </span>
              <span className="font-medium">{Math.round(completionRate)}%</span>
            </div>
            <Progress value={completionRate} />
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{pendingForms.length}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{submittedForms.length}</div>
              <div className="text-xs text-muted-foreground">Submitted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{forms.length}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forms List */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Important Forms</h2>
        <div className="space-y-3">
          {forms.map((form) => (
            <Card key={form.id} className={`app-surface ${form.status === "submitted" ? "opacity-60" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-muted p-3">
                    <FileTextIcon className="size-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-sm">{form.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{form.category}</p>
                      </div>
                      {getStatusIcon(form.status)}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="outline" className="text-xs">
                        Due: {form.deadline}
                      </Badge>
                      <Badge
                        variant={
                          form.priority === "high"
                            ? "destructive"
                            : form.priority === "medium"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {form.priority}
                      </Badge>
                      <Badge variant={form.status === "submitted" ? "default" : "outline"} className="text-xs">
                        {form.status}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 gap-2 bg-transparent"
                    onClick={() => {
                      if (form.status === "pending") {
                        markAsSubmitted(form.id)
                      }
                    }}
                  >
                    {form.status === "submitted" ? "View" : "Submit"}
                    <ExternalLinkIcon className="size-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Helper Tips */}
      <Card className="app-surface">
        <CardHeader>
          <CardTitle className="text-base">Helper Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Keep all required documents ready before starting a form.</p>
          <p>Submit high-priority forms at least 2 days before the deadline.</p>
          <p>Check your email for form approval confirmations.</p>
          <p>Use Campus HelpBot if you need guidance on any form.</p>
        </CardContent>
      </Card>
    </div>
  )
}
