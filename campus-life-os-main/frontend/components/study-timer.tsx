"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { PlayIcon, PauseIcon, RotateCcwIcon, TimerIcon, CoffeeIcon, TrophyIcon, AlertTriangleIcon, XIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function StudyTimer() {
  const [mode, setMode] = useState<"focus" | "break">("focus")
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [totalFocusTime, setTotalFocusTime] = useState(0)
  const [focusLockEnabled, setFocusLockEnabled] = useState(true)
  const [distractionCount, setDistractionCount] = useState(0)
  const [focusWarning, setFocusWarning] = useState("")
  const [showDistractToast, setShowDistractToast] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const titleFlashRef = useRef<NodeJS.Timeout | null>(null)
  const toastDismissRef = useRef<NodeJS.Timeout | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const focusDuration = 25 * 60
  const breakDuration = 5 * 60

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false)
      if (mode === "focus") {
        setSessionsCompleted((prev) => prev + 1)
        setTotalFocusTime((prev) => prev + focusDuration)
        setMode("break")
        setTimeLeft(breakDuration)
      } else {
        setMode("focus")
        setTimeLeft(focusDuration)
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, timeLeft, mode, focusDuration, breakDuration])

  useEffect(() => {
    const shouldEnforceLock = isRunning && mode === "focus" && focusLockEnabled
    if (!shouldEnforceLock) return

    const markDistracted = () => {
      setIsRunning(false)
      setDistractionCount((prev) => prev + 1)
      setFocusWarning("Focus lock paused your timer because you left the study session.")
    }

    const startTitleFlash = () => {
      let toggle = false
      const origTitle = document.title
      titleFlashRef.current = setInterval(() => {
        document.title = toggle ? "⚠️ Come back! Timer paused" : origTitle
        toggle = !toggle
      }, 1000)
    }

    const stopTitleFlash = () => {
      if (titleFlashRef.current) {
        clearInterval(titleFlashRef.current)
        titleFlashRef.current = null
        document.title = "Campus Life OS"
      }
    }

    const showNotification = () => {
      setShowDistractToast(true)
      setTimeout(() => setToastVisible(true), 10)
      if (toastDismissRef.current) clearTimeout(toastDismissRef.current)
      toastDismissRef.current = setTimeout(() => dismissToast(), 7000)
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        markDistracted()
        startTitleFlash()
      } else {
        stopTitleFlash()
        showNotification()
      }
    }

    const onWindowBlur = () => {
      markDistracted()
    }

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = "A focus session is active. Are you sure you want to leave?"
      return event.returnValue
    }

    document.addEventListener("visibilitychange", onVisibilityChange)
    window.addEventListener("blur", onWindowBlur)
    window.addEventListener("beforeunload", onBeforeUnload)

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange)
      window.removeEventListener("blur", onWindowBlur)
      window.removeEventListener("beforeunload", onBeforeUnload)
      if (titleFlashRef.current) clearInterval(titleFlashRef.current)
      if (toastDismissRef.current) clearTimeout(toastDismissRef.current)
    }
  }, [isRunning, mode, focusLockEnabled])

  const toggleTimer = () => {
    if (!isRunning && mode === "focus" && focusLockEnabled) {
      setFocusWarning("")
    }
    setIsRunning(!isRunning)
  }

  const dismissToast = () => {
    setToastVisible(false)
    setTimeout(() => setShowDistractToast(false), 300)
  }

  const resumeFromToast = () => {
    dismissToast()
    setFocusWarning("")
    setIsRunning(true)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setFocusWarning("")
    setTimeLeft(mode === "focus" ? focusDuration : breakDuration)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progress =
    (((mode === "focus" ? focusDuration : breakDuration) - timeLeft) /
      (mode === "focus" ? focusDuration : breakDuration)) *
    100

  return (
    <div className="space-y-6">
      {/* Distraction notification toast */}
      {showDistractToast && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-80 rounded-xl border border-destructive/40 bg-background shadow-2xl transition-all duration-300 ${
            toastVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="flex items-start gap-3 p-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangleIcon className="size-5 text-destructive" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-none">Focus Broken!</p>
              <p className="text-xs text-muted-foreground mt-1">
                You switched tabs. Timer was paused automatically.
              </p>
              <p className="text-xs font-medium text-destructive mt-1">
                {distractionCount} distraction{distractionCount !== 1 ? "s" : ""} this session
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" className="h-7 text-xs flex-1" onClick={resumeFromToast}>
                  <PlayIcon className="size-3 mr-1" /> Resume
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={dismissToast}>
                  Dismiss
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 shrink-0 -mt-1 -mr-1 text-muted-foreground"
              onClick={dismissToast}
            >
              <XIcon className="size-3" />
            </Button>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold text-balance">Study Timer</h1>
        <p className="text-muted-foreground mt-1 text-pretty">Boost productivity with the Pomodoro technique</p>
      </div>

      <Tabs defaultValue="timer" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="timer">Timer</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="timer" className="space-y-4">
          <Card>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                {mode === "focus" ? (
                  <>
                    <TimerIcon className="size-6 text-primary" />
                    <Badge className="text-base px-4 py-1">Focus Time</Badge>
                  </>
                ) : (
                  <>
                    <CoffeeIcon className="size-6 text-primary" />
                    <Badge variant="secondary" className="text-base px-4 py-1">
                      Break Time
                    </Badge>
                  </>
                )}
              </div>
              <CardTitle className="text-6xl md:text-7xl font-mono">{formatTime(timeLeft)}</CardTitle>
              <CardDescription className="text-base mt-2">
                {mode === "focus" ? "Stay focused and eliminate distractions" : "Take a break and relax"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {focusWarning && mode === "focus" && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {focusWarning}
                </div>
              )}

              <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <div>
                  <Label htmlFor="focus-lock" className="text-sm font-medium">
                    Focus Lock
                  </Label>
                  <p className="text-xs text-muted-foreground">Auto-pause timer if you switch tabs or apps.</p>
                </div>
                <Switch id="focus-lock" checked={focusLockEnabled} onCheckedChange={setFocusLockEnabled} />
              </div>

              <Progress value={progress} className="h-3" />

              <div className="flex gap-3">
                <Button onClick={toggleTimer} size="lg" className="flex-1">
                  {isRunning ? (
                    <>
                      <PauseIcon className="size-5 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <PlayIcon className="size-5 mr-2" />
                      Start
                    </>
                  )}
                </Button>
                <Button onClick={resetTimer} size="lg" variant="outline">
                  <RotateCcwIcon className="size-5" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold">{sessionsCompleted}</p>
                  <p className="text-sm text-muted-foreground">Sessions Today</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{Math.floor(totalFocusTime / 60)}</p>
                  <p className="text-sm text-muted-foreground">Minutes Focused</p>
                </div>
                <div className="text-center col-span-2">
                  <p className="text-lg font-bold">{distractionCount}</p>
                  <p className="text-sm text-muted-foreground">Distractions Detected</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How it Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Focus for 25 minutes</p>
                  <p className="text-sm text-muted-foreground">Work on a single task without distractions</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Take a 5-minute break</p>
                  <p className="text-sm text-muted-foreground">Rest and recharge your mind</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Repeat and track progress</p>
                  <p className="text-sm text-muted-foreground">Complete 4 sessions for best results</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrophyIcon className="size-8 text-primary" />
                  <p className="text-3xl font-bold">{sessionsCompleted}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Focus Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TimerIcon className="size-8 text-primary" />
                  <p className="text-3xl font-bold">{Math.floor(totalFocusTime / 60)}m</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">🔥</span>
                  <p className="text-3xl font-bold">{Math.floor(sessionsCompleted / 4)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Progress</CardTitle>
              <CardDescription>Your study sessions over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                  <div key={day} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-12">{day}</span>
                    <Progress
                      value={index === new Date().getDay() - 1 ? (sessionsCompleted / 8) * 100 : Math.random() * 100}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-8 text-right">
                      {index === new Date().getDay() - 1 ? sessionsCompleted : Math.floor(Math.random() * 8)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
