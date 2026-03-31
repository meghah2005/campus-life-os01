"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon, TrashIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react"
import { addGpaCourseViaGateway, deleteGpaCourseViaGateway, fetchGpaCoursesViaGateway, type GpaCourse } from "@/lib/api-gateway"

export function GPACalculator() {
  const [courses, setCourses] = useState<GpaCourse[]>([])

  const [newCourse, setNewCourse] = useState({ name: "", credits: 3, grade: "A" })

  const gradePoints: { [key: string]: number } = {
    "A+": 4.0,
    A: 4.0,
    "A-": 3.7,
    "B+": 3.3,
    B: 3.0,
    "B-": 2.7,
    "C+": 2.3,
    C: 2.0,
    "C-": 1.7,
    D: 1.0,
    F: 0.0,
  }

  useEffect(() => {
    fetchGpaCoursesViaGateway().then(setCourses).catch(() => undefined)
  }, [])

  const calculateGPA = () => {
    if (courses.length === 0) return 0
    const totalPoints = courses.reduce((sum, course) => sum + gradePoints[course.grade] * course.credits, 0)
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0)
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00"
  }

  const addCourse = async () => {
    if (newCourse.name && newCourse.credits > 0) {
      const createdCourse = await addGpaCourseViaGateway(newCourse)
      setCourses((current) => [...current, createdCourse])
      setNewCourse({ name: "", credits: 3, grade: "A" })
    }
  }

  const deleteCourse = async (id: number) => {
    await deleteGpaCourseViaGateway(id)
    setCourses((current) => current.filter((course) => course.id !== id))
  }

  const gpa = calculateGPA()
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0)

  return (
    <div className="space-y-6">
      <Card className="app-surface">
        <CardHeader>
          <CardTitle className="text-2xl">GPA Calculator</CardTitle>
          <p className="text-sm text-muted-foreground">Track your academic performance with consistent grade and credit insights.</p>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="app-surface">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{gpa}</div>
            <div className="flex items-center gap-1 mt-1">
              {Number(gpa) >= 3.5 ? (
                <>
                  <TrendingUpIcon className="size-4 text-green-500" />
                  <span className="text-xs text-green-500">Excellent</span>
                </>
              ) : Number(gpa) >= 3.0 ? (
                <>
                  <TrendingUpIcon className="size-4 text-blue-500" />
                  <span className="text-xs text-blue-500">Good</span>
                </>
              ) : (
                <>
                  <TrendingDownIcon className="size-4 text-orange-500" />
                  <span className="text-xs text-orange-500">Needs Improvement</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="app-surface">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCredits}</div>
            <p className="text-xs text-muted-foreground mt-1">Credit hours completed</p>
          </CardContent>
        </Card>
        <Card className="app-surface">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Courses enrolled</p>
          </CardContent>
        </Card>
      </div>

      <Card className="app-surface">
        <CardHeader>
          <CardTitle>Add Course</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="course-name">Course Name</Label>
              <Input
                id="course-name"
                placeholder="e.g., Data Structures"
                value={newCourse.name}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                type="number"
                min="1"
                max="6"
                value={newCourse.credits}
                onChange={(e) => setNewCourse({ ...newCourse, credits: Number.parseInt(e.target.value) || 3 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Select value={newCourse.grade} onValueChange={(value) => setNewCourse({ ...newCourse, grade: value })}>
                <SelectTrigger id="grade">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(gradePoints).map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade} ({gradePoints[grade]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="w-full mt-4 gap-2" onClick={addCourse}>
            <PlusIcon className="size-4" />
            Add Course
          </Button>
        </CardContent>
      </Card>

      <Card className="app-surface">
        <CardHeader>
          <CardTitle>Course List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {courses.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No courses added yet</p>
            ) : (
              courses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{course.name}</h3>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {course.credits} credits
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Grade: {course.grade}
                      </Badge>
                      <Badge className="text-xs">{gradePoints[course.grade]} points</Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteCourse(course.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <TrashIcon className="size-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
