"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircleIcon, XCircleIcon, AlertCircleIcon } from "lucide-react"
import { fetchAttendanceViaGateway, markAttendanceViaGateway, type AttendanceCourse } from "@/lib/api-gateway"

export function AttendanceTracker() {
  const [courses, setCourses] = useState<AttendanceCourse[]>([])

  useEffect(() => {
    fetchAttendanceViaGateway().then(setCourses).catch(() => undefined)
  }, [])

  const calculatePercentage = (attended: number, total: number) => {
    return total > 0 ? ((attended / total) * 100).toFixed(1) : "0.0"
  }

  const getStatusColor = (percentage: number) => {
    if (percentage >= 75) return "text-green-500"
    if (percentage >= 65) return "text-orange-500"
    return "text-red-500"
  }

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 75) return <CheckCircleIcon className="size-5 text-green-500" />
    if (percentage >= 65) return <AlertCircleIcon className="size-5 text-orange-500" />
    return <XCircleIcon className="size-5 text-red-500" />
  }

  const markAttendance = async (id: number, present: boolean) => {
    const updatedCourse = await markAttendanceViaGateway(id, present)
    setCourses((current) => current.map((course) => (course.id === id ? updatedCourse : course)))
  }

  const overallAttended = courses.reduce((sum, c) => sum + c.attended, 0)
  const overallTotal = courses.reduce((sum, c) => sum + c.totalClasses, 0)
  const overallPercentage = calculatePercentage(overallAttended, overallTotal)

  return (
    <div className="space-y-6">
      <Card className="app-surface">
        <CardHeader>
          <CardTitle className="text-2xl">Attendance Tracker</CardTitle>
          <CardDescription>Monitor attendance trends and act early on at-risk courses.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="app-surface">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getStatusColor(Number(overallPercentage))}`}>
              {overallPercentage}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {overallAttended} of {overallTotal} classes
            </p>
          </CardContent>
        </Card>
        <Card className="app-surface">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Safe Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">
              {courses.filter((c) => Number(calculatePercentage(c.attended, c.totalClasses)) >= 75).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Above 75% attendance</p>
          </CardContent>
        </Card>
        <Card className="app-surface">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">
              {courses.filter((c) => Number(calculatePercentage(c.attended, c.totalClasses)) < 65).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Below 65% attendance</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {courses.map((course) => {
          const percentage = Number(calculatePercentage(course.attended, course.totalClasses))
          return (
            <Card key={course.id} className="app-surface">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(percentage)}
                      <h3 className="font-semibold">{course.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {course.code}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {course.attended} / {course.totalClasses} classes attended
                    </p>
                  </div>
                  <div className={`text-2xl font-bold ${getStatusColor(percentage)}`}>{percentage}%</div>
                </div>
                <Progress value={percentage} className="h-2 mb-3" />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => markAttendance(course.id, true)}
                  >
                    <CheckCircleIcon className="size-4 mr-1" />
                    Present
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => markAttendance(course.id, false)}
                  >
                    <XCircleIcon className="size-4 mr-1" />
                    Absent
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
