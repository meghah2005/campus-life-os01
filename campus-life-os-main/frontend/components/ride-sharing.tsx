"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CarIcon, MapPinIcon, ClockIcon, UsersIcon, PlusIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  cancelRideViaGateway,
  createRideViaGateway,
  fetchRidesViaGateway,
  requestRideViaGateway,
  type RideItem,
} from "@/lib/api-gateway"

export function RideSharing() {
  const [rides, setRides] = useState<RideItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusMessage, setStatusMessage] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [searchFrom, setSearchFrom] = useState("")
  const [searchTo, setSearchTo] = useState("")

  const [offerFrom, setOfferFrom] = useState("")
  const [offerTo, setOfferTo] = useState("")
  const [offerDate, setOfferDate] = useState("")
  const [offerTime, setOfferTime] = useState("")
  const [offerSeats, setOfferSeats] = useState("3")
  const [offerPrice, setOfferPrice] = useState("")
  const [myRides, setMyRides] = useState<RideItem[]>([])

  const loadRides = async () => {
    try {
      setIsLoading(true)
      const data = await fetchRidesViaGateway(searchFrom, searchTo)
      setRides(data)
      setMyRides(data.filter((ride) => ride.driver === "You"))
    } catch {
      setStatusMessage("Unable to load rides right now.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRides()
  }, [searchFrom, searchTo])

  const handleRequestRide = async (rideId: string) => {
    try {
      setStatusMessage("")
      await requestRideViaGateway(rideId)
      await loadRides()
      setStatusMessage("Ride request sent successfully.")
    } catch {
      setStatusMessage("Failed to request ride.")
    }
  }

  const handlePostRide = async () => {
    if (!offerFrom || !offerTo || !offerDate || !offerTime || !offerPrice) {
      setStatusMessage("Please fill in all fields before posting a ride.")
      return
    }

    try {
      setIsSubmitting(true)
      setStatusMessage("")
      await createRideViaGateway({
        driver: "You",
        from: offerFrom,
        to: offerTo,
        date: offerDate,
        time: offerTime,
        seats: Number.parseInt(offerSeats, 10),
        price: offerPrice.startsWith("₹") ? offerPrice : `₹${offerPrice}`,
      })

      setOfferFrom("")
      setOfferTo("")
      setOfferDate("")
      setOfferTime("")
      setOfferSeats("3")
      setOfferPrice("")

      await loadRides()
      setStatusMessage("Ride offer posted successfully.")
    } catch {
      setStatusMessage("Unable to post ride right now.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelRide = async (rideId: string) => {
    try {
      setStatusMessage("")
      await cancelRideViaGateway(rideId)
      await loadRides()
      setStatusMessage("Ride cancelled.")
    } catch {
      setStatusMessage("Failed to cancel ride.")
    }
  }

  return (
    <div className="space-y-6">
      <Card className="app-surface">
        <CardHeader>
          <CardTitle className="text-2xl">Ride Sharing</CardTitle>
          <CardDescription>Find or offer rides with clear route and seat management.</CardDescription>
          {statusMessage && <p className="text-sm text-primary">{statusMessage}</p>}
        </CardHeader>
      </Card>

      <Tabs defaultValue="find" className="w-full">
        <TabsList className="grid h-11 w-full grid-cols-2 rounded-xl border border-border/70 bg-card/70 p-1">
          <TabsTrigger value="find">Find a Ride</TabsTrigger>
          <TabsTrigger value="offer">Offer a Ride</TabsTrigger>
        </TabsList>

        <TabsContent value="find" className="space-y-4">
          <Card className="app-surface">
            <CardHeader>
              <CardTitle className="text-lg">Search for Rides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="from">From</Label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="from"
                      placeholder="Starting location"
                      value={searchFrom}
                      onChange={(e) => setSearchFrom(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to">To</Label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="to"
                      placeholder="Destination"
                      value={searchTo}
                      onChange={(e) => setSearchTo(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {isLoading ? (
              <Card className="app-surface">
                <CardContent className="p-4 text-sm text-muted-foreground">Loading rides...</CardContent>
              </Card>
            ) : rides.length === 0 ? (
              <Card className="app-surface">
                <CardContent className="p-4 text-sm text-muted-foreground">No rides found for this route.</CardContent>
              </Card>
            ) : (
              rides.map((ride) => (
              <Card key={ride.id} className="app-surface">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="size-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {ride.driver
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="font-semibold">{ride.driver}</p>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <MapPinIcon className="size-3" />
                          <span>
                            {ride.from} → {ride.to}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="gap-1">
                          <ClockIcon className="size-3" />
                          {ride.date} at {ride.time}
                        </Badge>
                        <Badge variant="secondary" className="gap-1">
                          <UsersIcon className="size-3" />
                          {ride.seats} seats
                        </Badge>
                        <Badge variant="secondary" className="gap-1">
                          <CarIcon className="size-3" />
                          {ride.price}
                        </Badge>
                      </div>
                      <Button
                        onClick={() => handleRequestRide(ride.id)}
                        disabled={ride.status === "requested" || ride.seats === 0}
                        className="w-full"
                        size="sm"
                      >
                        {ride.status === "requested"
                          ? "Request Sent"
                          : ride.seats === 0
                            ? "Fully Booked"
                            : "Request Ride"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="offer" className="space-y-4">
          <Card className="app-surface">
            <CardHeader>
              <CardTitle>Offer a Ride</CardTitle>
              <CardDescription>Share your ride with fellow students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="offer-from">From</Label>
                  <Input
                    id="offer-from"
                    placeholder="Starting location"
                    value={offerFrom}
                    onChange={(e) => setOfferFrom(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="offer-to">To</Label>
                  <Input
                    id="offer-to"
                    placeholder="Destination"
                    value={offerTo}
                    onChange={(e) => setOfferTo(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="offer-date">Date</Label>
                  <Input id="offer-date" type="date" value={offerDate} onChange={(e) => setOfferDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="offer-time">Time</Label>
                  <Input id="offer-time" type="time" value={offerTime} onChange={(e) => setOfferTime(e.target.value)} />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="offer-seats">Available Seats</Label>
                  <Input
                    id="offer-seats"
                    type="number"
                    min="1"
                    max="8"
                    value={offerSeats}
                    onChange={(e) => setOfferSeats(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="offer-price">Price per Seat</Label>
                  <Input
                    id="offer-price"
                    type="text"
                    placeholder="₹150"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handlePostRide} className="w-full gap-2" disabled={isSubmitting}>
                <PlusIcon className="size-4" />
                {isSubmitting ? "Posting..." : "Post Ride Offer"}
              </Button>
            </CardContent>
          </Card>

          <Card className="app-surface">
            <CardHeader>
              <CardTitle>Your Active Rides</CardTitle>
              <CardDescription>Manage your ride offers</CardDescription>
            </CardHeader>
            <CardContent>
              {myRides.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  You haven't posted any rides yet. Create your first ride offer above!
                </p>
              ) : (
                <div className="space-y-3">
                  {myRides.map((ride) => (
                    <div key={ride.id} className="p-3 rounded-lg border border-border space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">
                            {ride.from} → {ride.to}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {ride.date} at {ride.time} • {ride.seats} seats • {ride.price}
                          </p>
                        </div>
                        <Badge>{ride.status}</Badge>
                      </div>
                      <Button
                        onClick={() => handleCancelRide(ride.id)}
                        variant="destructive"
                        size="sm"
                        className="w-full"
                      >
                        Cancel Ride
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
