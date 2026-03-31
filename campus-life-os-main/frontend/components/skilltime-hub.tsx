"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PlusIcon, SearchIcon, AwardIcon, ClockIcon } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Student {
  id: number
  name: string
  department: string
  skills: string[]
  timeCredits: number
  badges: string[]
}

interface RegisteredSkill {
  id: number
  name: string
  category: string
  proficiency: "beginner" | "intermediate" | "advanced"
  availability: string
  description: string
}

export function SkillTimeHub() {
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "Rahul Sharma",
      department: "Computer Science",
      skills: ["Python", "React", "Machine Learning"],
      timeCredits: 15,
      badges: ["Helper"],
    },
    {
      id: 2,
      name: "Priya Patel",
      department: "Electronics",
      skills: ["Arduino", "Circuit Design", "PCB Layout"],
      timeCredits: 22,
      badges: ["Expert", "Mentor"],
    },
    {
      id: 3,
      name: "Amit Kumar",
      department: "Mechanical",
      skills: ["CAD", "3D Printing", "Simulation"],
      timeCredits: 18,
      badges: ["Helper"],
    },
    {
      id: 4,
      name: "Sneha Reddy",
      department: "Computer Science",
      skills: ["Java", "Spring Boot", "Database Design"],
      timeCredits: 25,
      badges: ["Expert"],
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [skillForm, setSkillForm] = useState({
    name: "",
    category: "",
    proficiency: "",
    availability: "",
    description: "",
  })
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof typeof skillForm, string>>>({})
  const [open, setOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [helpDialogOpen, setHelpDialogOpen] = useState(false)
  const [myCredits, setMyCredits] = useState(12)
  const [requestedStudentIds, setRequestedStudentIds] = useState<number[]>([])
  const [registeredSkills, setRegisteredSkills] = useState<RegisteredSkill[]>([])

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      student.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const updateSkillForm = (field: keyof typeof skillForm, value: string) => {
    setSkillForm((prev) => ({ ...prev, [field]: value }))
    setFormErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const addSkill = () => {
    const nextErrors: Partial<Record<keyof typeof skillForm, string>> = {}
    const name = skillForm.name.trim()
    const category = skillForm.category.trim()
    const proficiency = skillForm.proficiency.trim()
    const availability = skillForm.availability.trim()
    const description = skillForm.description.trim()

    if (name.length < 2) nextErrors.name = "Enter a skill name with at least 2 characters."
    if (!category) nextErrors.category = "Category is required."
    if (!proficiency) nextErrors.proficiency = "Select your proficiency level."
    if (!availability) nextErrors.availability = "Availability is required."
    if (description.length < 15) nextErrors.description = "Add at least 15 characters to describe this skill."

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors)
      toast({
        title: "Complete required fields",
        description: "Please review and complete all required details.",
        variant: "destructive",
      })
      return
    }

    const alreadyExists = registeredSkills.some((skill) => skill.name.toLowerCase() === name.toLowerCase())
    if (alreadyExists) {
      toast({
        title: "Skill already registered",
        description: `You already registered ${name}.`,
      })
      return
    }

    setRegisteredSkills((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
        category,
        proficiency: proficiency as RegisteredSkill["proficiency"],
        availability,
        description,
      },
    ])
    setSkillForm({
      name: "",
      category: "",
      proficiency: "",
      availability: "",
      description: "",
    })
    setFormErrors({})
    setOpen(false)
    toast({
      title: "Skill registered",
      description: `${name} has been added to your SkillTime profile.`,
    })
  }

  const requestHelp = (student: Student) => {
    if (requestedStudentIds.includes(student.id)) {
      toast({
        title: "Request already sent",
        description: `You already sent a request to ${student.name}.`,
      })
      return
    }

    setSelectedStudent(student)
    setHelpDialogOpen(true)
  }

  const sendHelpRequest = () => {
    if (!selectedStudent) return

    const sessionCost = 2
    if (myCredits < sessionCost) {
      toast({
        title: "Not enough credits",
        description: "You need at least 2 credits to request a session.",
        variant: "destructive",
      })
      return
    }

    setMyCredits((prev) => prev - sessionCost)
    setRequestedStudentIds((prev) => [...prev, selectedStudent.id])
    setStudents((prev) =>
      prev.map((student) =>
        student.id === selectedStudent.id
          ? { ...student, timeCredits: student.timeCredits + sessionCost }
          : student,
      ),
    )

    toast({
      title: "Request sent",
      description: `Your request was sent to ${selectedStudent.name}. 2 credits deducted.`,
    })

    setHelpDialogOpen(false)
    setSelectedStudent(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SkillTime Hub</h1>
          <p className="text-muted-foreground mt-1">Discover peer skills and share your expertise</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusIcon className="size-4" />
              Register Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register Your Skill</DialogTitle>
              <DialogDescription>Build your peer mentor profile for the Campus Life OS SkillTime network.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="skill-name">Skill Name</Label>
                  <Input
                    id="skill-name"
                    placeholder="e.g., Python Programming"
                    value={skillForm.name}
                    onChange={(e) => updateSkillForm("name", e.target.value)}
                  />
                  {formErrors.name ? <p className="text-xs text-destructive">{formErrors.name}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skill-category">Category</Label>
                  <Input
                    id="skill-category"
                    placeholder="e.g., Programming"
                    value={skillForm.category}
                    onChange={(e) => updateSkillForm("category", e.target.value)}
                  />
                  {formErrors.category ? <p className="text-xs text-destructive">{formErrors.category}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skill-level">Proficiency</Label>
                  <Select value={skillForm.proficiency} onValueChange={(value) => updateSkillForm("proficiency", value)}>
                    <SelectTrigger id="skill-level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.proficiency ? <p className="text-xs text-destructive">{formErrors.proficiency}</p> : null}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="skill-availability">Availability</Label>
                  <Input
                    id="skill-availability"
                    placeholder="e.g., Mon-Fri, 5:00 PM - 7:00 PM"
                    value={skillForm.availability}
                    onChange={(e) => updateSkillForm("availability", e.target.value)}
                  />
                  {formErrors.availability ? <p className="text-xs text-destructive">{formErrors.availability}</p> : null}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="skill-description">How You Can Help</Label>
                  <Textarea
                    id="skill-description"
                    placeholder="Describe what you can teach, expected outcomes, and ideal learner level."
                    value={skillForm.description}
                    onChange={(e) => updateSkillForm("description", e.target.value)}
                    rows={4}
                  />
                  {formErrors.description ? <p className="text-xs text-destructive">{formErrors.description}</p> : null}
                </div>
              </div>
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <ClockIcon className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Time Credit System</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Earn time credits for mentoring sessions and use them to request help from peers across Campus Life OS.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={addSkill}>
                Save Skill Profile
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, skill, or department..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active in skill sharing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Skills Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set([...students.flatMap((s) => s.skills), ...registeredSkills.map((skill) => skill.name)]).size}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Unique skills to learn</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Your Time Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myCredits}</div>
            <p className="text-xs text-muted-foreground mt-1">Hours available to learn</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Your Registered Skills</CardTitle>
        </CardHeader>
        <CardContent>
          {registeredSkills.length === 0 ? (
            <p className="text-sm text-muted-foreground">No skills registered yet. Add your first skill above.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {registeredSkills.map((skill) => (
                <div key={skill.id} className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary">{skill.name}</Badge>
                    <Badge variant="outline" className="capitalize">
                      {skill.proficiency}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{skill.category} • {skill.availability}</p>
                  <p className="text-sm text-muted-foreground">{skill.description}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Directory */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Skill Directory</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="size-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">{student.department}</p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {student.skills.map((skill, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ClockIcon className="size-3" />
                        <span>{student.timeCredits} credits</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {student.badges.map((badge, i) => (
                          <Badge key={i} variant="outline" className="text-xs gap-1">
                            <AwardIcon className="size-3" />
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className="mt-3 w-full bg-transparent"
                      variant="outline"
                      disabled={requestedStudentIds.includes(student.id)}
                      onClick={() => requestHelp(student)}
                    >
                      {requestedStudentIds.includes(student.id) ? "Request Sent" : "Request Help"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Help Request Dialog */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Help from {selectedStudent?.name}</DialogTitle>
            <DialogDescription>
              Connect with {selectedStudent?.name} to learn their skills. This will use your time credits.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-muted p-4">
              <div className="font-medium mb-2">Available Skills:</div>
              <div className="flex flex-wrap gap-2">
                {selectedStudent?.skills.map((skill, i) => (
                  <Badge key={i} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>• Session will cost 2 time credits per hour</p>
              <p>• You currently have {myCredits} credits available</p>
              <p>
                • {selectedStudent?.name} has earned {selectedStudent?.timeCredits} credits helping others
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1" onClick={sendHelpRequest}>
              Send Request
            </Button>
            <Button variant="outline" onClick={() => setHelpDialogOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
