"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, PlusIcon, TrashIcon, CheckIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Deadline {
  id: number
  title: string
  date: string
  category: "assignment" | "exam" | "fee" | "other"
  priority: "high" | "medium" | "low"
  completed: boolean
}

const DEFAULT_DEADLINES: Deadline[] = [
  {
    id: 1,
    title: "Data Structures Assignment",
    date: "2026-01-08",
    category: "assignment",
    priority: "high",
    completed: false,
  },
  {
    id: 2,
    title: "Physics Lab Report",
    date: "2026-01-10",
    category: "assignment",
    priority: "medium",
    completed: false,
  },
  {
    id: 3,
    title: "Mid-Semester Exam - Database",
    date: "2026-01-12",
    category: "exam",
    priority: "high",
    completed: false,
  },
  { id: 4, title: "Semester Fee Payment", date: "2026-01-15", category: "fee", priority: "high", completed: false },
  {
    id: 5,
    title: "Project Proposal Submission",
    date: "2026-01-20",
    category: "assignment",
    priority: "medium",
    completed: false,
  },
]

export function DeadlineManager() {
  const [deadlines, setDeadlines] = useState<Deadline[]>(() => {
    if (typeof window === "undefined") return DEFAULT_DEADLINES
    try {
      const saved = localStorage.getItem("campus-deadlines")
      return saved ? JSON.parse(saved) : DEFAULT_DEADLINES
    } catch {
      return DEFAULT_DEADLINES
    }
  })

  useEffect(() => {
    localStorage.setItem("campus-deadlines", JSON.stringify(deadlines))
  }, [deadlines])

  const [newDeadline, setNewDeadline] = useState({
    title: "",
    date: "",
    category: "assignment" as Deadline["category"],
    priority: "medium" as Deadline["priority"],
  })

  const [open, setOpen] = useState(false)

  const addDeadline = () => {
    if (newDeadline.title && newDeadline.date) {
      setDeadlines([
        ...deadlines,
        {
          id: deadlines.length + 1,
          ...newDeadline,
          completed: false,
        },
      ])
      setNewDeadline({ title: "", date: "", category: "assignment", priority: "medium" })
      setOpen(false)
    }
  }

  const toggleComplete = (id: number) => {
    setDeadlines(deadlines.map((d) => (d.id === id ? { ...d, completed: !d.completed } : d)))
  }

  const deleteDeadline = (id: number) => {
    setDeadlines(deadlines.filter((d) => d.id !== id))
  }

  const activeDeadlines = deadlines.filter((d) => !d.completed)
  const completedDeadlines = deadlines.filter((d) => d.completed)

  const DeadlineCard = ({ deadline }: { deadline: Deadline }) => (
    <Card className={`app-surface ${deadline.completed ? "opacity-60" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Button variant="ghost" size="icon" className="shrink-0 mt-1" onClick={() => toggleComplete(deadline.id)}>
              <div
                className={`size-5 rounded border-2 flex items-center justify-center ${deadline.completed ? "bg-primary border-primary" : "border-muted-foreground"}`}
              >
                {deadline.completed && <CheckIcon className="size-3 text-primary-foreground" />}
              </div>
            </Button>
            <div className="flex-1">
              <h3 className={`font-semibold text-sm ${deadline.completed ? "line-through" : ""}`}>{deadline.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <CalendarIcon className="size-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{deadline.date}</span>
              </div>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {deadline.category}
                </Badge>
                <Badge
                  variant={
                    deadline.priority === "high"
                      ? "destructive"
                      : deadline.priority === "medium"
                        ? "secondary"
                        : "outline"
                  }
                  className="text-xs"
                >
                  {deadline.priority}
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteDeadline(deadline.id)}
            className="shrink-0 text-destructive hover:text-destructive"
          >
            <TrashIcon className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Card className="app-surface">
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
          <div>
            <CardTitle className="text-2xl">Deadline Manager</CardTitle>
            <CardDescription>Track assignments, exams, and important dates with clear priority control.</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusIcon className="size-4" />
              Add Deadline
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:rounded-2xl">
            <DialogHeader>
              <DialogTitle>Add New Deadline</DialogTitle>
              <DialogDescription>Create a new deadline to track important dates</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Submit assignment"
                  value={newDeadline.title}
                  onChange={(e) => setNewDeadline({ ...newDeadline, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newDeadline.date}
                  onChange={(e) => setNewDeadline({ ...newDeadline, date: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newDeadline.category}
                    onValueChange={(value: Deadline["category"]) => setNewDeadline({ ...newDeadline, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="fee">Fee</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newDeadline.priority}
                    onValueChange={(value: Deadline["priority"]) => setNewDeadline({ ...newDeadline, priority: value })}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={addDeadline}>
                Add Deadline
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
          </Dialog>
        </CardHeader>
      </Card>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="h-11 rounded-xl border border-border/70 bg-card/70 p-1">
          <TabsTrigger value="active">Active ({activeDeadlines.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedDeadlines.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-3">
          {activeDeadlines.length === 0 ? (
            <Card className="app-surface">
              <CardContent className="py-12 text-center">
                <CalendarIcon className="size-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No active deadlines. Great job!</p>
              </CardContent>
            </Card>
          ) : (
            activeDeadlines.map((deadline) => <DeadlineCard key={deadline.id} deadline={deadline} />)
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3">
          {completedDeadlines.length === 0 ? (
            <Card className="app-surface">
              <CardContent className="py-12 text-center">
                <CheckIcon className="size-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No completed tasks yet</p>
              </CardContent>
            </Card>
          ) : (
            completedDeadlines.map((deadline) => <DeadlineCard key={deadline.id} deadline={deadline} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
