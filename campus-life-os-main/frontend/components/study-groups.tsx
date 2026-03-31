"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UsersIcon, PlusIcon, CalendarIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface StudyGroup {
  id: number
  name: string
  subject: string
  members: number
  maxMembers: number
  nextSession: string
  description: string
  organizer: string
}

export function StudyGroups() {
  const [groups, setGroups] = useState<StudyGroup[]>([
    {
      id: 1,
      name: "Data Structures Deep Dive",
      subject: "Computer Science",
      members: 5,
      maxMembers: 8,
      nextSession: "2026-01-06 at 4:00 PM",
      description: "Focus on trees, graphs, and dynamic programming",
      organizer: "Rahul S.",
    },
    {
      id: 2,
      name: "Physics Problem Solving",
      subject: "Physics",
      members: 6,
      maxMembers: 10,
      nextSession: "2026-01-07 at 3:00 PM",
      description: "Weekly problem-solving sessions for midterm prep",
      organizer: "Priya P.",
    },
    {
      id: 3,
      name: "Database Design Workshop",
      subject: "Computer Science",
      members: 4,
      maxMembers: 6,
      nextSession: "2026-01-08 at 5:00 PM",
      description: "Learn SQL, normalization, and query optimization",
      organizer: "Amit K.",
    },
    {
      id: 4,
      name: "Calculus Study Circle",
      subject: "Mathematics",
      members: 7,
      maxMembers: 10,
      nextSession: "2026-01-09 at 2:00 PM",
      description: "Integration techniques and applications",
      organizer: "Sneha R.",
    },
  ])

  const [open, setOpen] = useState(false)
  const [joinedGroups, setJoinedGroups] = useState<number[]>([1, 2])

  const handleJoinGroup = (groupId: number) => {
    if (joinedGroups.includes(groupId)) {
      // Leave group
      setJoinedGroups((prev) => prev.filter((id) => id !== groupId))
      setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, members: g.members - 1 } : g)))
    } else {
      // Join group
      setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, members: g.members + 1 } : g)))
      setJoinedGroups((prev) => [...prev, groupId])
    }
  }

  return (
    <div className="space-y-6">
      <Card className="app-surface">
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
          <div>
            <CardTitle className="text-2xl">Study Groups</CardTitle>
            <CardDescription>Join or create peer groups for focused collaborative learning.</CardDescription>
          </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusIcon className="size-4" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Study Group</DialogTitle>
              <DialogDescription>Start a new study group and invite peers</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="group-name">Group Name</Label>
                <Input id="group-name" placeholder="e.g., Calculus Study Circle" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="e.g., Mathematics" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-members">Max Members</Label>
                <Input id="max-members" type="number" placeholder="e.g., 10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="What will the group focus on?" rows={3} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => setOpen(false)}>
                Create Group
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="app-surface">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groups.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently running</p>
          </CardContent>
        </Card>
        <Card className="app-surface">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Your Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{joinedGroups.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Groups you joined</p>
          </CardContent>
        </Card>
        <Card className="app-surface">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Next Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Today</div>
            <p className="text-xs text-muted-foreground mt-1">at 4:00 PM</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {groups.map((group) => {
          const isJoined = joinedGroups.includes(group.id)
          const isFull = group.members >= group.maxMembers

          return (
            <Card key={group.id} className="app-surface transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <Badge variant="secondary" className="mt-2">
                      {group.subject}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <UsersIcon className="size-4" />
                    <span>
                      {group.members}/{group.maxMembers}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{group.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarIcon className="size-4" />
                    <span>Next: {group.nextSession}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {group.organizer
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-muted-foreground text-xs">Organized by {group.organizer}</span>
                  </div>
                </div>
                <Button
                  className="w-full mt-4"
                  disabled={!isJoined && isFull}
                  onClick={() => handleJoinGroup(group.id)}
                  variant={isJoined ? "outline" : "default"}
                >
                  {isFull && !isJoined ? "Group Full" : isJoined ? "Leave Group" : "Join Group"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
