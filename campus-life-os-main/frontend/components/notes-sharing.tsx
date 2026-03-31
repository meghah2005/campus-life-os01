"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DownloadIcon, HeartIcon, ShareIcon, UploadIcon, SearchIcon, BookmarkIcon, TrendingUpIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  createNoteViaGateway,
  fetchNotesViaGateway,
  incrementNoteDownloadViaGateway,
  type NoteItem,
} from "@/lib/api-gateway"

export function NotesSharing() {
  const [notes, setNotes] = useState<NoteItem[]>([])

  const [likedNotes, setLikedNotes] = useState<Set<number>>(new Set())
  const [bookmarkedNotes, setBookmarkedNotes] = useState<Set<number>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [uploadTitle, setUploadTitle] = useState("")
  const [uploadSubject, setUploadSubject] = useState("")
  const [uploadDescription, setUploadDescription] = useState("")
  const [statusMessage, setStatusMessage] = useState("")

  const loadNotes = async () => {
    try {
      const data = await fetchNotesViaGateway(searchQuery, selectedSubject)
      setNotes(data)
    } catch {
      setStatusMessage("Unable to load notes right now.")
    }
  }

  useEffect(() => {
    loadNotes()
  }, [searchQuery, selectedSubject])

  const handleLike = (noteId: number) => {
    setLikedNotes((prev) => {
      const newLiked = new Set(prev)
      if (newLiked.has(noteId)) {
        newLiked.delete(noteId)
      } else {
        newLiked.add(noteId)
      }
      return newLiked
    })
  }

  const handleBookmark = (noteId: number) => {
    setBookmarkedNotes((prev) => {
      const newBookmarked = new Set(prev)
      if (newBookmarked.has(noteId)) {
        newBookmarked.delete(noteId)
      } else {
        newBookmarked.add(noteId)
      }
      return newBookmarked
    })
  }

  const handleDownload = async (noteId: number) => {
    const note = notes.find((n) => n.id === noteId)
    if (!note) return

    // Only run in browser environment
    if (typeof window === "undefined") return

    try {
      const content = `${note.title}\n\nSubject: ${note.subject}\nContributor: ${note.contributor}\n\n${note.description}\n\nThese are sample notes for demonstration purposes.`
      const blob = new Blob([content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${note.title.replace(/\s+/g, "_")}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      await incrementNoteDownloadViaGateway(noteId)
      await loadNotes()
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  const handleShareNote = async () => {
    if (!uploadTitle || !uploadSubject || !uploadDescription) {
      setStatusMessage("Please fill title, subject, and description.")
      return
    }

    try {
      await createNoteViaGateway({
        title: uploadTitle,
        subject: uploadSubject,
        contributor: "You",
        description: uploadDescription,
        fileType: "PDF",
      })
      setUploadTitle("")
      setUploadSubject("")
      setUploadDescription("")
      setStatusMessage("Notes shared successfully.")
      await loadNotes()
    } catch {
      setStatusMessage("Unable to share notes right now.")
    }
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = selectedSubject === "all" || note.subject === selectedSubject
    return matchesSearch && matchesSubject
  })

  const subjects = ["All Subjects", "Computer Science", "Mathematics", "Chemistry", "Business"]

  return (
    <div className="space-y-6">
      <Card className="app-surface">
        <CardHeader>
          <CardTitle className="text-2xl">Notes Sharing</CardTitle>
          <CardDescription>Discover, upload, and organize peer study materials with cleaner workflows.</CardDescription>
          {statusMessage && <p className="mt-1 text-sm text-primary">{statusMessage}</p>}
        </CardHeader>
      </Card>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid h-11 w-full grid-cols-3 rounded-xl border border-border/70 bg-card/70 p-1">
          <TabsTrigger value="browse">Browse Notes</TabsTrigger>
          <TabsTrigger value="upload">Upload Notes</TabsTrigger>
          <TabsTrigger value="saved">Saved ({bookmarkedNotes.size})</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search notes by title or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="app-surface transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight">{note.title}</CardTitle>
                      <CardDescription className="mt-1">by {note.contributor}</CardDescription>
                    </div>
                    <Badge variant="secondary">{note.fileType}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{note.description}</p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <DownloadIcon className="size-4" />
                      {note.downloads}
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUpIcon className="size-4" />
                      {note.rating}★
                    </div>
                    <Badge variant="outline">{note.subject}</Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => handleDownload(note.id)} className="flex-1">
                      <DownloadIcon className="size-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant={likedNotes.has(note.id) ? "default" : "outline"}
                      size="icon"
                      onClick={() => handleLike(note.id)}
                    >
                      <HeartIcon className={`size-4 ${likedNotes.has(note.id) ? "fill-current" : ""}`} />
                    </Button>
                    <Button
                      variant={bookmarkedNotes.has(note.id) ? "default" : "outline"}
                      size="icon"
                      onClick={() => handleBookmark(note.id)}
                    >
                      <BookmarkIcon className={`size-4 ${bookmarkedNotes.has(note.id) ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card className="app-surface">
            <CardHeader>
              <CardTitle>Upload Your Notes</CardTitle>
              <CardDescription>Share your study materials with fellow students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="note-title">Note Title</Label>
                <Input
                  id="note-title"
                  placeholder="e.g., Data Structures Complete Notes"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note-subject">Subject</Label>
                <Select value={uploadSubject} onValueChange={setUploadSubject}>
                  <SelectTrigger id="note-subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note-description">Description</Label>
                <Textarea
                  id="note-description"
                  placeholder="Briefly describe what these notes cover..."
                  rows={3}
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                />
              </div>

              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <UploadIcon className="size-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                  <br />
                  PDF, DOCX, or PPTX (max 10MB)
                </p>
              </div>

              <Button className="w-full" onClick={handleShareNote}>
                <ShareIcon className="size-4 mr-2" />
                Share Notes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          {bookmarkedNotes.size === 0 ? (
            <Card className="app-surface">
              <CardContent className="py-12 text-center">
                <BookmarkIcon className="size-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No saved notes yet</p>
                <p className="text-sm text-muted-foreground mt-1">Bookmark notes to access them quickly later</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {notes
                .filter((note) => bookmarkedNotes.has(note.id))
                .map((note) => (
                  <Card key={note.id} className="app-surface">
                    <CardHeader>
                      <CardTitle className="text-lg">{note.title}</CardTitle>
                      <CardDescription>by {note.contributor}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{note.description}</p>
                      <Button onClick={() => handleDownload(note.id)} className="w-full">
                        <DownloadIcon className="size-4 mr-2" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
