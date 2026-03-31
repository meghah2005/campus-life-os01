"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPinIcon, NavigationIcon, SearchIcon, BuildingIcon, MapIcon } from "lucide-react"
import { fetchCampusLocationsViaGateway, type CampusLocation } from "@/lib/api-gateway"

export function CampusMap() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(null)
  const [locations, setLocations] = useState<CampusLocation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [directionsMessage, setDirectionsMessage] = useState("")

  useEffect(() => {
    const loadLocations = async () => {
      try {
        setIsLoading(true)
        const data = await fetchCampusLocationsViaGateway(searchQuery)
        setLocations(data)
      } finally {
        setIsLoading(false)
      }
    }

    loadLocations()
  }, [searchQuery])

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      academic: "bg-blue-500",
      library: "bg-purple-500",
      dining: "bg-orange-500",
      sports: "bg-green-500",
      events: "bg-pink-500",
      services: "bg-red-500",
    }
    return colors[category] || "bg-gray-500"
  }

  const handleGetDirections = () => {
    if (selectedLocation) {
      setDirectionsMessage(
        `Directions to ${selectedLocation.name}: Head towards ${selectedLocation.building}. Estimated walk time: 5 minutes.`,
      )
    }
  }

  const handleStreetView = () => {
    if (selectedLocation) {
      setDirectionsMessage(`Street View for ${selectedLocation.building} is loading in the next update.`)
    }
  }

  const handleNavigate = (location: CampusLocation) => {
    setSelectedLocation(location)
    setDirectionsMessage(`Navigation started to ${location.name}. Follow the highlighted path on the campus map.`)
  }

  return (
    <div className="space-y-6">
      <Card className="app-surface">
        <CardHeader>
          <CardTitle className="text-2xl">Campus Map</CardTitle>
          <CardDescription>Navigate around campus and locate key services quickly.</CardDescription>
          {directionsMessage && <p className="text-sm text-primary">{directionsMessage}</p>}
        </CardHeader>
      </Card>

      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid h-11 w-full grid-cols-2 rounded-xl border border-border/70 bg-card/70 p-1">
          <TabsTrigger value="map">Interactive Map</TabsTrigger>
          <TabsTrigger value="directory">Location Directory</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search for buildings, rooms, or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Card className="app-surface">
            <CardContent className="p-6">
              <div className="relative w-full aspect-video bg-gradient-to-br from-green-100 to-green-200 dark:from-green-950 dark:to-green-900 rounded-lg overflow-hidden border-2 border-border">
                <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-10">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div key={i} className="border border-gray-400" />
                  ))}
                </div>

                {locations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => setSelectedLocation(location)}
                    className={`absolute w-8 h-8 rounded-full ${getCategoryColor(
                      location.category,
                    )} border-2 border-white shadow-lg flex items-center justify-center hover:scale-125 transition-transform cursor-pointer`}
                    style={{
                      left: `${location.coordinates.x}%`,
                      top: `${location.coordinates.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <MapPinIcon className="size-4 text-white" />
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="secondary" className="gap-1">
                  <div className="size-2 rounded-full bg-blue-500" />
                  Academic
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <div className="size-2 rounded-full bg-purple-500" />
                  Library
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <div className="size-2 rounded-full bg-orange-500" />
                  Dining
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <div className="size-2 rounded-full bg-green-500" />
                  Sports
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <div className="size-2 rounded-full bg-pink-500" />
                  Events
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <div className="size-2 rounded-full bg-red-500" />
                  Services
                </Badge>
              </div>

              {isLoading && <p className="text-sm text-muted-foreground mt-4">Loading locations...</p>}
            </CardContent>
          </Card>

          {selectedLocation && (
            <Card className="app-surface">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedLocation.name}</CardTitle>
                    <CardDescription>
                      {selectedLocation.building}
                      {selectedLocation.room && ` - ${selectedLocation.room}`}
                    </CardDescription>
                  </div>
                  <Badge className={getCategoryColor(selectedLocation.category)}>{selectedLocation.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{selectedLocation.description}</p>
                <div className="flex gap-2">
                  <Button onClick={handleGetDirections} className="flex-1 gap-2">
                    <NavigationIcon className="size-4" />
                    Get Directions
                  </Button>
                  <Button onClick={handleStreetView} variant="outline" className="flex-1 gap-2 bg-transparent">
                    <MapIcon className="size-4" />
                    Street View
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="directory" className="space-y-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {locations.map((location) => (
            <Card key={location.id} className="app-surface">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getCategoryColor(location.category)}`}>
                      <BuildingIcon className="size-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{location.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {location.building}
                        {location.room && ` - ${location.room}`}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline">{location.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <p className="text-sm text-muted-foreground">{location.description}</p>
                <Button
                  onClick={() => handleNavigate(location)}
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 bg-transparent"
                >
                  <NavigationIcon className="size-4" />
                  Navigate
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
