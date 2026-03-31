"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, MapPinIcon, UsersIcon, PlusIcon } from "lucide-react"
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

interface Event {
  id: number
  title: string
  date: string
  time: string
  location: string
  category: "academic" | "cultural" | "sports" | "club" | "workshop"
  attendees: number
  description: string
}

export function EventsCalendar() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Tech Talk: AI in Healthcare",
      date: "2026-01-08",
      time: "10:00 AM",
      location: "Auditorium A",
      category: "academic",
      attendees: 45,
      description: "Join us for an insightful session on AI applications in healthcare",
    },
    {
      id: 2,
      title: "Annual Cultural Fest",
      date: "2026-01-12",
      time: "2:00 PM",
      location: "Main Ground",
      category: "cultural",
      attendees: 200,
      description: "Celebrate diversity with music, dance, and food",
    },
    {
      id: 3,
      title: "Inter-College Basketball Tournament",
      date: "2026-01-15",
      time: "9:00 AM",
      location: "Sports Complex",
      category: "sports",
      attendees: 120,
      description: "Cheer for our college team in the finals",
    },
    {
      id: 4,
      title: "Coding Workshop: React Basics",
      date: "2026-01-18",
      time: "3:00 PM",
      location: "Lab 301",
      category: "workshop",
      attendees: 30,
      description: "Hands-on workshop for beginners",
    },
  ])

  const [open, setOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [registeredEvents, setRegisteredEvents] = useState<Set<number>>(new Set())

  const filteredEvents = selectedCategory === "all" ? events : events.filter((e) => e.category === selectedCategory)

  const handleRegister = (eventId: number) => {
    setRegisteredEvents((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(eventId)) {
        newSet.delete(eventId)
        setEvents((prevEvents) =>
          prevEvents.map((event) => (event.id === eventId ? { ...event, attendees: event.attendees - 1 } : event)),
        )
      } else {
        newSet.add(eventId)
        setEvents((prevEvents) =>
          prevEvents.map((event) => (event.id === eventId ? { ...event, attendees: event.attendees + 1 } : event)),
        )
      }
      return newSet
    })
  }

  const categoryColors = {
    academic: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    cultural: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    sports: "bg-green-500/10 text-green-500 border-green-500/20",
    club: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    workshop: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  }

  return (
    <div className="space-y-6">
      <Card className="app-surface">
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
          <div>
            <CardTitle className="text-2xl">Campus Events</CardTitle>
            <CardDescription>
            Discover and join upcoming campus activities
            {registeredEvents.size > 0 && ` • ${registeredEvents.size} events registered`}
            </CardDescription>
          </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusIcon className="size-4" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>Share an event with the campus community</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="event-title">Event Title</Label>
                <Input id="event-title" placeholder="e.g., Tech Talk" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event-date">Date</Label>
                  <Input id="event-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-time">Time</Label>
                  <Input id="event-time" type="time" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-location">Location</Label>
                <Input id="event-location" placeholder="e.g., Auditorium A" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-description">Description</Label>
                <Textarea id="event-description" placeholder="Brief description of the event" rows={3} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => setOpen(false)}>
                Create Event
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        </CardHeader>
      </Card>

      <div className="app-surface flex gap-2 overflow-x-auto p-3">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("all")}
        >
          All Events
        </Button>
        <Button
          variant={selectedCategory === "academic" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("academic")}
        >
          Academic
        </Button>
        <Button
          variant={selectedCategory === "cultural" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("cultural")}
        >
          Cultural
        </Button>
        <Button
          variant={selectedCategory === "sports" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("sports")}
        >
          Sports
        </Button>
        <Button
          variant={selectedCategory === "workshop" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("workshop")}
        >
          Workshop
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="app-surface transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <Badge className={`mt-2 ${categoryColors[event.category]}`}>{event.category}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{event.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarIcon className="size-4" />
                  <span>
                    {event.date} at {event.time}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPinIcon className="size-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UsersIcon className="size-4" />
                  <span>{event.attendees} attending</span>
                </div>
              </div>
              <Button
                className="w-full mt-4"
                variant={registeredEvents.has(event.id) ? "secondary" : "default"}
                onClick={() => handleRegister(event.id)}
              >
                {registeredEvents.has(event.id) ? "Unregister" : "Register"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
