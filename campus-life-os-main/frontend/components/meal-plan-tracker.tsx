"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { UtensilsIcon, IndianRupeeIcon, CalendarIcon, TrendingDownIcon, PlusIcon } from "lucide-react"
import {
  fetchMealPlanViaGateway,
  spendDiningRupeesViaGateway,
  useMealSwipeViaGateway,
  type MealPlanResponse,
} from "@/lib/api-gateway"

export function MealPlanTracker() {
  const [mealPlan, setMealPlan] = useState<MealPlanResponse | null>(null)
  const [statusMessage, setStatusMessage] = useState("")

  const loadMealPlan = async () => {
    try {
      const data = await fetchMealPlanViaGateway()
      setMealPlan(data)
    } catch {
      setStatusMessage("Unable to load meal plan right now.")
    }
  }

  useEffect(() => {
    loadMealPlan()
  }, [])

  if (!mealPlan) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Meal Plan Tracker</h2>
          <p className="text-muted-foreground">Loading meal plan...</p>
        </div>
      </div>
    )
  }

  const { mealSwipes, mealSwipesUsed, diningDollars, diningDollarsUsed, daysRemaining, history: mealHistory } = mealPlan

  const mealSwipesRemaining = mealSwipes - mealSwipesUsed
  const diningDollarsRemaining = diningDollars - diningDollarsUsed

  const mealSwipesPerDay = (mealSwipesRemaining / daysRemaining).toFixed(1)
  const diningDollarsPerDay = (diningDollarsRemaining / daysRemaining).toFixed(2)

  const handleUseMealSwipe = async () => {
    try {
      const data = await useMealSwipeViaGateway()
      setMealPlan(data)
      setStatusMessage("Meal swipe used.")
    } catch {
      setStatusMessage("Unable to use meal swipe.")
    }
  }

  const handleUseDiningDollars = async (amount: number) => {
    try {
      const data = await spendDiningRupeesViaGateway(amount)
      setMealPlan(data)
      setStatusMessage(`₹${amount} spent successfully.`)
    } catch {
      setStatusMessage("Unable to spend dining rupees.")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Meal Plan Tracker</h2>
        <p className="text-muted-foreground">Monitor your meal swipes and dining rupees</p>
        {statusMessage && <p className="text-sm text-primary mt-2">{statusMessage}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Meal Swipes</CardTitle>
              <div className="p-2 rounded-lg bg-primary/10">
                <UtensilsIcon className="size-5 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-3xl font-bold">{mealSwipesRemaining}</span>
                <span className="text-sm text-muted-foreground">of {mealSwipes} remaining</span>
              </div>
              <Progress value={(mealSwipesRemaining / mealSwipes) * 100} className="h-2" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Recommended per day</span>
              <Badge variant="secondary">{mealSwipesPerDay} swipes</Badge>
            </div>
            <Button onClick={handleUseMealSwipe} className="w-full gap-2">
              <PlusIcon className="size-4" />
              Use Meal Swipe
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Dining Rupees</CardTitle>
              <div className="p-2 rounded-lg bg-green-500/10">
                <IndianRupeeIcon className="size-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-3xl font-bold">₹{diningDollarsRemaining.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground">of ₹{diningDollars} remaining</span>
              </div>
              <Progress value={(diningDollarsRemaining / diningDollars) * 100} className="h-2" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Recommended per day</span>
              <Badge variant="secondary">₹{diningDollarsPerDay}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button onClick={() => handleUseDiningDollars(50)} variant="outline" size="sm">
                ₹50
              </Button>
              <Button onClick={() => handleUseDiningDollars(100)} variant="outline" size="sm">
                ₹100
              </Button>
              <Button onClick={() => handleUseDiningDollars(150)} variant="outline" size="sm">
                ₹150
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Usage Overview</CardTitle>
              <CardDescription>Track your spending patterns</CardDescription>
            </div>
            <Badge variant="outline" className="gap-1">
              <CalendarIcon className="size-3" />
              {daysRemaining} days left
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <TrendingDownIcon className="size-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Avg. Swipes/Week</p>
                <p className="text-2xl font-bold">10.5</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <IndianRupeeIcon className="size-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Avg. Spending/Week</p>
                <p className="text-2xl font-bold">₹875</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <UtensilsIcon className="size-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Most Used Location</p>
                <p className="text-sm font-bold">Main Cafeteria</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest meal plan activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mealHistory.map((meal, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${meal.type === "Meal Swipe" ? "bg-primary/10" : "bg-green-500/10"}`}>
                    {meal.type === "Meal Swipe" ? (
                      <UtensilsIcon className="size-4 text-primary" />
                    ) : (
                      <IndianRupeeIcon className="size-4 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{meal.location}</p>
                    <p className="text-xs text-muted-foreground">
                      {meal.date} at {meal.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">{meal.type}</p>
                  {meal.amount && <p className="text-xs text-muted-foreground">{meal.amount}</p>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
