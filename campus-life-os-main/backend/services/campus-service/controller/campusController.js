
import { State } from "../models/stateModel.js"

export const registerCampusServiceController = (app) => {
const defaultLostFoundItems = [
]

const defaultLostFoundContactRequests = []

const directoryPeople = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    role: "Professor",
    department: "Computer Science",
    email: "sarah.johnson@campus.edu",
    phone: "(555) 123-4567",
    office: "Engineering Block A, Room 305",
    type: "faculty",
  },
  {
    id: "2",
    name: "Alex Kumar",
    role: "Student",
    department: "Computer Science",
    email: "alex.kumar@campus.edu",
    phone: "(555) 234-5678",
    type: "student",
  },
  {
    id: "3",
    name: "Prof. Michael Chen",
    role: "Associate Professor",
    department: "Mathematics",
    email: "michael.chen@campus.edu",
    phone: "(555) 345-6789",
    office: "Science Building, Room 201",
    type: "faculty",
  },
  {
    id: "4",
    name: "Emma Wilson",
    role: "Student",
    department: "Engineering",
    email: "emma.wilson@campus.edu",
    phone: "(555) 456-7890",
    type: "student",
  },
  {
    id: "5",
    name: "Dr. Robert Taylor",
    role: "Department Head",
    department: "Physics",
    email: "robert.taylor@campus.edu",
    phone: "(555) 567-8901",
    office: "Physics Building, Room 401",
    type: "faculty",
  },
  {
    id: "6",
    name: "Priya Patel",
    role: "Student",
    department: "Business",
    email: "priya.patel@campus.edu",
    phone: "(555) 678-9012",
    type: "student",
  },
]

const campusLocations = [
  {
    id: "1",
    name: "Computer Science Department",
    building: "Engineering Block A",
    room: "Room 301",
    category: "academic",
    description: "CS labs, faculty offices, and classrooms",
    coordinates: { x: 30, y: 40 },
  },
  {
    id: "2",
    name: "Main Library",
    building: "Central Library",
    category: "library",
    description: "Study halls, book collections, digital resources",
    coordinates: { x: 50, y: 30 },
  },
  {
    id: "3",
    name: "Student Cafeteria",
    building: "Food Court",
    category: "dining",
    description: "Multiple food stalls and seating areas",
    coordinates: { x: 60, y: 60 },
  },
  {
    id: "4",
    name: "Sports Complex",
    building: "Sports Building",
    category: "sports",
    description: "Gym, basketball court, swimming pool",
    coordinates: { x: 70, y: 50 },
  },
  {
    id: "5",
    name: "Auditorium",
    building: "Main Building",
    room: "Hall 1",
    category: "events",
    description: "Large auditorium for events and ceremonies",
    coordinates: { x: 40, y: 70 },
  },
  {
    id: "6",
    name: "Medical Center",
    building: "Health Services",
    category: "services",
    description: "Campus health clinic and pharmacy",
    coordinates: { x: 20, y: 60 },
  },
]

const defaultRides = [
]

const defaultNotes = [
]

const defaultMarketplaceContacts = []

let lostFoundItems = [...defaultLostFoundItems]
let lostFoundContactRequests = [...defaultLostFoundContactRequests]
let rides = [...defaultRides]
let notes = [...defaultNotes]
let marketplaceContacts = [...defaultMarketplaceContacts]

const keys = {
  lostFoundItems: "campus:lost-found-items",
  lostFoundContactRequests: "campus:lost-found-contact-requests",
  rides: "campus:rides",
  notes: "campus:notes",
  marketplaceContacts: "campus:marketplace-contacts",
}

const loadValue = async (key, defaultValue) => {
  const existing = await State.findOne({ key })
  if (!existing) {
    await State.create({ key, value: defaultValue })
    return defaultValue
  }
  return existing.value
}

const saveValue = async (key, value) => {
  await State.findOneAndUpdate(
    { key },
    { value },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )
}

const ready = (async () => {
  lostFoundItems = await loadValue(keys.lostFoundItems, defaultLostFoundItems)
  lostFoundContactRequests = await loadValue(keys.lostFoundContactRequests, defaultLostFoundContactRequests)
  rides = await loadValue(keys.rides, defaultRides)
  notes = await loadValue(keys.notes, defaultNotes)
  marketplaceContacts = await loadValue(keys.marketplaceContacts, defaultMarketplaceContacts)
})()

const nextNumberId = (list) => {
  const maxId = list.reduce((acc, item) => Math.max(acc, Number(item.id) || 0), 0)
  return maxId + 1
}

const nextStringId = (list) => String(nextNumberId(list))

const getHelpBotResponse = (message) => {
  const msg = String(message || "").toLowerCase()

  if (msg.includes("form") || msg.includes("submit") || msg.includes("portal")) {
    return {
      text: "For form submissions, open the Forms & Portal Helper. You can track pending forms, see deadlines, and mark completed submissions there.",
      topic: "forms",
    }
  }

  if (msg.includes("deadline") || msg.includes("assignment") || msg.includes("exam") || msg.includes("fee")) {
    return {
      text: "Check the Deadline Manager for assignments, exams, and fee reminders. It keeps all important due dates in one place.",
      topic: "deadlines",
    }
  }

  if (msg.includes("skill") || msg.includes("learn") || msg.includes("peer")) {
    return {
      text: "Use SkillTime Hub to find peers who can teach a skill or to share your own expertise with other students.",
      topic: "skills",
    }
  }

  if (msg.includes("lost") || msg.includes("found") || msg.includes("item")) {
    return {
      text: "Open Lost & Found to report missing items, browse found items, and contact the listed student directly from the app.",
      topic: "lost-found",
    }
  }

  if (msg.includes("book") || msg.includes("appointment") || msg.includes("office") || msg.includes("queue")) {
    return {
      text: "Use Queue Booking to reserve campus service slots such as academic support, administration, or counselling visits.",
      topic: "booking",
    }
  }

  if (msg.includes("ride") || msg.includes("transport") || msg.includes("car")) {
    return {
      text: "Ride Sharing lets you search rides, request a seat, or post your own trip for other students.",
      topic: "rides",
    }
  }

  if (msg.includes("map") || msg.includes("building") || msg.includes("location") || msg.includes("where")) {
    return {
      text: "Campus Map can help you search buildings and navigate to academic blocks, dining areas, sports facilities, and services.",
      topic: "map",
    }
  }

  if (msg.includes("note") || msg.includes("study material") || msg.includes("pdf")) {
    return {
      text: "Use Notes Sharing to discover study materials from other students or upload your own notes for others.",
      topic: "notes",
    }
  }

  return {
    text: "I can help with forms, deadlines, skills, lost & found, rides, map navigation, notes, and bookings. Ask about any campus feature.",
    topic: "general",
  }
}

app.get("/health", (_req, res) => {
  res.json({ service: "campus-service", status: "ok" })
})

app.get("/api/lost-found/items", async (req, res) => {
  await ready
  const search = String(req.query.search || "").toLowerCase()
  const type = String(req.query.type || "all")

  const filtered = lostFoundItems.filter((item) => {
    const typeMatch = type === "all" || item.type === type
    const searchMatch =
      !search ||
      item.title.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search) ||
      item.location.toLowerCase().includes(search)

    return typeMatch && searchMatch
  })

  res.json(filtered)
})

app.post("/api/lost-found/items", async (req, res) => {
  await ready
  const { title, description, location, category = "General", type = "lost", contactName = "You" } = req.body || {}

  if (!title || !description || !location) {
    return res.status(400).json({ message: "title, description and location are required" })
  }

  const item = {
    id: nextNumberId(lostFoundItems),
    title,
    description,
    location,
    category,
    type,
    contactName,
    date: new Date().toISOString().split("T")[0],
  }

  lostFoundItems.unshift(item)
  await saveValue(keys.lostFoundItems, lostFoundItems)
  return res.status(201).json(item)
})

app.post("/api/lost-found/contact", async (req, res) => {
  await ready
  const { itemId, message, senderName = "You" } = req.body || {}
  if (!itemId || !message) {
    return res.status(400).json({ message: "itemId and message are required" })
  }

  const item = lostFoundItems.find((entry) => entry.id === Number(itemId))
  if (!item) {
    return res.status(404).json({ message: "Item not found" })
  }

  const contactRequest = {
    id: nextNumberId(lostFoundContactRequests),
    itemId: Number(itemId),
    itemTitle: item.title,
    recipientName: item.contactName,
    senderName,
    message,
    status: "sent",
    createdAt: new Date().toISOString(),
  }

  lostFoundContactRequests.unshift(contactRequest)
  await saveValue(keys.lostFoundContactRequests, lostFoundContactRequests)

  return res.status(201).json({
    status: "sent",
    message: "Contact request submitted",
    request: contactRequest,
  })
})

app.get("/api/lost-found/contact-requests", async (req, res) => {
  await ready
  const senderName = String(req.query.senderName || "").toLowerCase()

  const filtered = lostFoundContactRequests.filter((request) => {
    if (!senderName) return true
    return String(request.senderName).toLowerCase() === senderName
  })

  return res.json(filtered)
})

app.get("/api/directory/people", (req, res) => {
  const search = String(req.query.search || "").toLowerCase()
  const type = String(req.query.type || "all")

  const filtered = directoryPeople.filter((person) => {
    const typeMatch = type === "all" || person.type === type
    const searchMatch =
      !search ||
      person.name.toLowerCase().includes(search) ||
      person.department.toLowerCase().includes(search) ||
      person.email.toLowerCase().includes(search)

    return typeMatch && searchMatch
  })

  res.json(filtered)
})

app.get("/api/campus/locations", (req, res) => {
  const search = String(req.query.search || "").toLowerCase()

  const filtered = campusLocations.filter(
    (location) =>
      !search ||
      location.name.toLowerCase().includes(search) ||
      location.building.toLowerCase().includes(search),
  )

  res.json(filtered)
})

app.get("/api/rides", async (req, res) => {
  await ready
  const searchFrom = String(req.query.from || "").toLowerCase()
  const searchTo = String(req.query.to || "").toLowerCase()

  const filtered = rides.filter((ride) => {
    const matchesFrom = !searchFrom || ride.from.toLowerCase().includes(searchFrom)
    const matchesTo = !searchTo || ride.to.toLowerCase().includes(searchTo)
    return matchesFrom && matchesTo
  })

  res.json(filtered)
})

app.post("/api/rides", async (req, res) => {
  await ready
  const { driver = "You", from, to, date, time, seats, price } = req.body || {}

  if (!from || !to || !date || !time || !seats || !price) {
    return res.status(400).json({ message: "from, to, date, time, seats and price are required" })
  }

  const ride = {
    id: nextStringId(rides),
    driver,
    from,
    to,
    date,
    time,
    seats: Number(seats),
    price,
    status: "available",
  }

  rides.unshift(ride)
  await saveValue(keys.rides, rides)
  return res.status(201).json(ride)
})

app.patch("/api/rides/:id/request", async (req, res) => {
  await ready
  const ride = rides.find((item) => item.id === req.params.id)
  if (!ride) {
    return res.status(404).json({ message: "Ride not found" })
  }

  if (ride.seats > 0) {
    ride.seats -= 1
    ride.status = ride.seats === 0 ? "booked" : "requested"
  }

  await saveValue(keys.rides, rides)
  return res.json(ride)
})

app.delete("/api/rides/:id", async (req, res) => {
  await ready
  rides = rides.filter((ride) => ride.id !== req.params.id)
  await saveValue(keys.rides, rides)
  return res.status(204).send()
})

app.get("/api/notes", async (req, res) => {
  await ready
  const search = String(req.query.search || "").toLowerCase()
  const subject = String(req.query.subject || "all")

  const filtered = notes.filter((note) => {
    const matchesSearch =
      !search ||
      note.title.toLowerCase().includes(search) ||
      note.subject.toLowerCase().includes(search)
    const matchesSubject = subject === "all" || note.subject === subject
    return matchesSearch && matchesSubject
  })

  res.json(filtered)
})

app.post("/api/notes", async (req, res) => {
  await ready
  const { title, subject, description, contributor = "You", fileType = "PDF" } = req.body || {}
  if (!title || !subject || !description) {
    return res.status(400).json({ message: "title, subject and description are required" })
  }

  const note = {
    id: nextNumberId(notes),
    title,
    subject,
    contributor,
    downloads: 0,
    rating: 4.5,
    description,
    fileType,
    uploadDate: new Date().toISOString().split("T")[0],
  }

  notes.unshift(note)
  await saveValue(keys.notes, notes)
  return res.status(201).json(note)
})

app.patch("/api/notes/:id/download", async (req, res) => {
  await ready
  const note = notes.find((item) => item.id === Number(req.params.id))
  if (!note) {
    return res.status(404).json({ message: "Note not found" })
  }

  note.downloads += 1
  await saveValue(keys.notes, notes)
  return res.json(note)
})

app.post("/api/marketplace/contact", async (req, res) => {
  await ready
  const { seller, itemTitle, message, sender = "Current Student" } = req.body || {}

  if (!seller || !itemTitle || !message) {
    return res.status(400).json({ message: "seller, itemTitle and message are required" })
  }

  const contactRequest = {
    id: nextNumberId(marketplaceContacts),
    seller,
    itemTitle,
    message,
    sender,
    status: "sent",
    createdAt: new Date().toISOString(),
  }

  marketplaceContacts.unshift(contactRequest)
  await saveValue(keys.marketplaceContacts, marketplaceContacts)

  return res.status(201).json({
    status: "sent",
    message: `Message sent to ${seller}`,
    contactId: contactRequest.id,
  })
})

app.post("/api/helpbot/chat", (req, res) => {
  const { message } = req.body || {}
  if (!message || !String(message).trim()) {
    return res.status(400).json({ message: "message is required" })
  }

  const reply = getHelpBotResponse(message)
  return res.status(201).json({
    reply: reply.text,
    topic: reply.topic,
    timestamp: new Date().toISOString(),
  })
})
}
