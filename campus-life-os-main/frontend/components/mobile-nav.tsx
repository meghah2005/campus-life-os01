"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  HomeIcon,
  CalendarIcon,
  UsersIcon,
  FileTextIcon,
  SearchIcon,
  ClockIcon,
  BellIcon,
  MenuIcon,
  PartyPopperIcon,
  BookOpenIcon,
  CalculatorIcon,
  ClipboardCheckIcon,
  ScanLineIcon,
  MapIcon,
  UtensilsIcon,
  CarIcon,
  ContactIcon,
  NetworkIcon,
  BoxIcon,
} from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface MobileNavProps {
  currentView: string
  onNavigate: (view: string) => void
}

export function MobileNav({ currentView, onNavigate }: MobileNavProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const mainNavItems = [
    { id: "dashboard", label: "Home", icon: HomeIcon },
    { id: "deadlines", label: "Deadlines", icon: CalendarIcon },
    { id: "scanner", label: "Scanner", icon: ScanLineIcon },
    { id: "notifications", label: "Alerts", icon: BellIcon },
  ]

  const additionalNavItems = [
    { id: "skilltime", label: "SkillTime Hub", icon: UsersIcon },
    { id: "forms", label: "Forms Portal", icon: FileTextIcon },
    { id: "lostfound", label: "Lost & Found", icon: SearchIcon },
    { id: "booking", label: "Queue Booking", icon: ClockIcon },
    { id: "events", label: "Campus Events", icon: PartyPopperIcon },
    { id: "studygroups", label: "Study Groups", icon: BookOpenIcon },
    { id: "gpa", label: "GPA Calculator", icon: CalculatorIcon },
    { id: "attendance", label: "Attendance Tracker", icon: ClipboardCheckIcon },
    { id: "notes", label: "Notes Sharing", icon: FileTextIcon },
    { id: "timer", label: "Study Timer", icon: ClockIcon },
    { id: "marketplace", label: "Marketplace", icon: HomeIcon },
    { id: "map", label: "Campus Map", icon: MapIcon },
    { id: "mealplan", label: "Meal Plan Tracker", icon: UtensilsIcon },
    { id: "rideshare", label: "Ride Sharing", icon: CarIcon },
    { id: "directory", label: "Campus Directory", icon: ContactIcon },
    { id: "microservices-architecture", label: "Microservices Architecture", icon: NetworkIcon },
    { id: "monolithic-architecture", label: "Monolithic Architecture", icon: BoxIcon },
  ]

  return (
    <nav className="safe-area-inset-bottom fixed bottom-2 left-0 right-0 z-50 px-3 md:hidden">
      <div className="mx-auto grid h-16 max-w-xl grid-cols-5 rounded-2xl border border-border/70 bg-card/85 shadow-lg backdrop-blur-xl supports-[backdrop-filter]:bg-card/75">
        {mainNavItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            onClick={() => onNavigate(item.id)}
            className={`relative h-full rounded-none border-0 flex-col items-center justify-center gap-1 ${
              currentView === item.id
                ? "bg-primary/12 text-primary before:absolute before:bottom-0 before:h-1 before:w-6 before:rounded-full before:bg-primary"
                : "text-muted-foreground"
            }`}
          >
            <item.icon className="size-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </Button>
        ))}

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="h-full rounded-none border-0 flex-col items-center justify-center gap-1 text-muted-foreground"
            >
              <MenuIcon className="size-5" />
              <span className="text-xs font-medium">More</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl border-border/70 bg-card/95">
            <SheetHeader>
              <SheetTitle>More Features</SheetTitle>
            </SheetHeader>
            <div className="grid gap-2 py-4 max-h-[60vh] overflow-y-auto">
              {additionalNavItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "outline"}
                  onClick={() => {
                    onNavigate(item.id)
                    setIsSheetOpen(false)
                  }}
                  className="h-14 justify-start gap-3 rounded-xl"
                >
                  <item.icon className="size-5" />
                  <span className="text-base">{item.label}</span>
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
