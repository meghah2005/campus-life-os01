"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchIcon, MailIcon, PhoneIcon, UserIcon, UsersIcon, GraduationCapIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { fetchDirectoryPeopleViaGateway, type DirectoryPerson } from "@/lib/api-gateway"

export function CampusDirectory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [people, setPeople] = useState<DirectoryPerson[]>([])

  useEffect(() => {
    fetchDirectoryPeopleViaGateway(searchQuery, "all").then(setPeople).catch(() => undefined)
  }, [searchQuery])

  const filteredPeople = people

  const students = filteredPeople.filter((p) => p.type === "student")
  const faculty = filteredPeople.filter((p) => p.type === "faculty")

  const PersonCard = ({ person }: { person: DirectoryPerson }) => {
    const handleEmail = () => {
      window.location.href = `mailto:${person.email}`
    }

    const handleCall = () => {
      window.location.href = `tel:${person.phone}`
    }

    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Avatar className="size-12">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {person.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{person.name}</p>
                  <Badge variant={person.type === "faculty" ? "default" : "secondary"}>{person.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{person.role}</p>
                <p className="text-sm text-muted-foreground">{person.department}</p>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MailIcon className="size-3" />
                  <span>{person.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <PhoneIcon className="size-3" />
                  <span>{person.phone}</span>
                </div>
                {person.office && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <UserIcon className="size-3" />
                    <span>{person.office}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleEmail} variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                  <MailIcon className="size-3" />
                  Email
                </Button>
                <Button onClick={handleCall} variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                  <PhoneIcon className="size-3" />
                  Call
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Campus Directory</h2>
        <p className="text-muted-foreground">Find students, faculty, and staff</p>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, department, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <UsersIcon className="size-4" />
              Total Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{filteredPeople.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCapIcon className="size-4" />
              Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{students.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <UserIcon className="size-4" />
              Faculty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{faculty.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All ({filteredPeople.length})</TabsTrigger>
          <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
          <TabsTrigger value="faculty">Faculty ({faculty.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {filteredPeople.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </TabsContent>

        <TabsContent value="students" className="space-y-3">
          {students.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </TabsContent>

        <TabsContent value="faculty" className="space-y-3">
          {faculty.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
