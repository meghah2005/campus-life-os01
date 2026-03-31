"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { ClockIcon, CalendarIcon, MapPinIcon, CheckIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Booking {
  id: number
  service: string
  location: string
  date: string
  time: string
  status: "confirmed" | "pending"
}

export function QueueBooking() {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 1,
      service: "Academic Counseling",
      location: "Admin Block, Room 205",
      date: "2026-01-10",
      time: "2:00 PM - 2:30 PM",
      status: "confirmed",
    },
    {
      id: 2,
      service: "Library Help Desk",
      location: "Central Library",
      date: "2026-01-08",
      time: "11:00 AM - 11:30 AM",
      status: "pending",
    },
  ])

  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedService, setSelectedService] = useState("")
  const [selectedSlot, setSelectedSlot] = useState("")

  const services = [
    { name: "Academic Counseling", location: "Admin Block, Room 205" },
    { name: "Career Guidance", location: "Placement Cell" },
    { name: "Library Help Desk", location: "Central Library" },
    { name: "HOD Office Hours", location: "Department Office" },
    { name: "Mental Wellness Support", location: "Counseling Center" },
  ]

  const timeSlots = [
    "9:00 AM - 9:30 AM",
    "10:00 AM - 10:30 AM",
    "11:00 AM - 11:30 AM",
    "2:00 PM - 2:30 PM",
    "3:00 PM - 3:30 PM",
    "4:00 PM - 4:30 PM",
  ]

  const bookSlot = () => {
    if (selectedService && selectedDate && selectedSlot) {
      const service = services.find((s) => s.name === selectedService)
      setBookings([
        ...bookings,
        {
          id: bookings.length + 1,
          service: selectedService,
          location: service?.location || "",
          date: selectedDate.toISOString().split("T")[0],
          time: selectedSlot,
          status: "pending",
        },
      ])
      setSelectedService("")
      setSelectedDate(undefined)
      setSelectedSlot("")
      setOpen(false)
    }
  }

  const cancelBooking = (id: number) => {
    setBookings(bookings.filter((b) => b.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Queue Booking System</h1>
          <p className="text-muted-foreground mt-1">Book appointments with campus offices and services</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <CalendarIcon className="size-4" />
              Book Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Book an Appointment</DialogTitle>
              <DialogDescription>Select a service, date, and time slot</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Select Service</Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.name} value={service.name}>
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-xs text-muted-foreground">{service.location}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-lg border border-border"
                />
              </div>

              {selectedDate && (
                <div className="space-y-2">
                  <Label>Select Time Slot</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={selectedSlot === slot ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => setSelectedSlot(slot)}
                      >
                        <ClockIcon className="size-4 mr-2" />
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={bookSlot}
                disabled={!selectedService || !selectedDate || !selectedSlot}
              >
                Confirm Booking
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Available Services */}
      <Card>
        <CardHeader>
          <CardTitle>Available Services</CardTitle>
          <CardDescription>Campus offices and support services you can book</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.name}
                className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="rounded-lg bg-primary/10 p-2">
                  <ClockIcon className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm">{service.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPinIcon className="size-3" />
                    {service.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* My Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
          <CardDescription>Your upcoming and past appointments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {bookings.length === 0 ? (
            <div className="py-12 text-center">
              <CalendarIcon className="size-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No bookings yet</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base">{booking.service}</h3>
                        <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                          {booking.status === "confirmed" && <CheckIcon className="size-3 mr-1" />}
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="size-3" />
                          <span>{booking.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="size-3" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="size-3" />
                          <span>{booking.time}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => cancelBooking(booking.id)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
