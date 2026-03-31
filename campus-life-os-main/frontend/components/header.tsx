"use client"

import { Button } from "@/components/ui/button"
import {
  MoonIcon,
  SunIcon,
  BellIcon,
  HomeIcon,
  CalendarIcon,
  UsersIcon,
  FileTextIcon,
  SearchIcon,
  ClockIcon,
  PartyPopperIcon,
  BookOpenIcon,
  CalculatorIcon,
  ClipboardCheckIcon,
  LogOutIcon,
  UserIcon,
  MapIcon,
  UtensilsIcon,
  CarIcon,
  ContactIcon,
  NetworkIcon,
  BoxIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MenuIcon } from "lucide-react"

interface HeaderProps {
  currentView: string
  onNavigate: (view: string) => void
  user?: { email: string; name: string } | null
  onLogout?: () => void
}

export function Header({ currentView, onNavigate, user, onLogout }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: HomeIcon },
    { id: "deadlines", label: "Deadlines", icon: CalendarIcon },
    { id: "skilltime", label: "SkillTime Hub", icon: UsersIcon },
    { id: "forms", label: "Forms", icon: FileTextIcon },
    { id: "lostfound", label: "Lost & Found", icon: SearchIcon },
    { id: "booking", label: "Bookings", icon: ClockIcon },
  ]

  const moreNavItems = [
    { id: "events", label: "Campus Events", icon: PartyPopperIcon },
    { id: "studygroups", label: "Study Groups", icon: BookOpenIcon },
    { id: "gpa", label: "GPA Calculator", icon: CalculatorIcon },
    { id: "attendance", label: "Attendance Tracker", icon: ClipboardCheckIcon },
    { id: "notes", label: "Notes Sharing", icon: FileTextIcon },
    { id: "timer", label: "Study Timer", icon: ClockIcon },
    { id: "marketplace", label: "Campus Marketplace", icon: HomeIcon },
    { id: "map", label: "Campus Map", icon: MapIcon },
    { id: "mealplan", label: "Meal Plan Tracker", icon: UtensilsIcon },
    { id: "rideshare", label: "Ride Sharing", icon: CarIcon },
    { id: "directory", label: "Campus Directory", icon: ContactIcon },
    { id: "microservices-architecture", label: "Microservices Architecture", icon: NetworkIcon },
    { id: "monolithic-architecture", label: "Monolithic Architecture", icon: BoxIcon },
  ]

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleNavClick = (view: string) => {
    onNavigate(view)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-md shadow-primary/25">
              <span className="text-primary-foreground font-extrabold text-sm">CL</span>
            </div>
            <div className="leading-tight">
              <span className="font-extrabold text-base md:text-lg tracking-tight">Campus Life OS</span>
              <p className="hidden md:block text-xs text-muted-foreground">Student Productivity Platform</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1 rounded-xl border border-border/80 bg-card/75 p-1 shadow-sm">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentView === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => handleNavClick(item.id)}
                className="gap-2 rounded-lg"
              >
                <item.icon className="size-4" />
                {item.label}
              </Button>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 rounded-lg">
                  <MenuIcon className="size-4" />
                  More
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Academic Tools</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {moreNavItems.map((item) => (
                  <DropdownMenuItem key={item.id} onClick={() => handleNavClick(item.id)}>
                    <item.icon className="size-4 mr-2" />
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="hidden md:inline-flex rounded-full border border-border/80 bg-card/70 text-xs">
            <span className="mr-1.5 inline-block size-1.5 rounded-full bg-emerald-500" />
            Live
          </Badge>

          <Button
            variant="ghost"
            size="icon"
            className="relative hidden md:flex rounded-xl"
            onClick={() => handleNavClick("notifications")}
          >
            <BellIcon className="size-5" />
          </Button>

          <Button variant="ghost" size="icon" className="rounded-xl" onClick={handleThemeToggle}>
            <SunIcon className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {user && onLogout && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-xl border border-border/70 bg-card/60">
                  <UserIcon className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
                  <LogOutIcon className="size-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
