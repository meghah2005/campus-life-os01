"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShoppingCartIcon,
  HeartIcon,
  MessageCircleIcon,
  PlusIcon,
  SearchIcon,
  BookIcon,
  LaptopIcon,
  ShirtIcon,
  BikeIcon,
  SendIcon,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { contactMarketplaceSellerViaGateway } from "@/lib/api-gateway"

interface Item {
  id: number
  title: string
  price: number
  seller: string
  category: string
  condition: string
  description: string
  image: string
  postedDate: string
}

export function CampusMarketplace() {
  const [items, setItems] = useState<Item[]>([
    {
      id: 1,
      title: "Engineering Textbook Bundle",
      price: 45,
      seller: "Alex Chen",
      category: "Books",
      condition: "Good",
      description: "Calculus and Physics textbooks for first year",
      image: "/stack-of-textbooks.png",
      postedDate: "2 days ago",
    },
    {
      id: 2,
      title: "MacBook Pro 2020",
      price: 850,
      seller: "Sarah Johnson",
      category: "Electronics",
      condition: "Excellent",
      description: "13-inch, 16GB RAM, 512GB SSD. Barely used",
      image: "/silver-macbook-on-desk.png",
      postedDate: "1 day ago",
    },
    {
      id: 3,
      title: "Vintage Campus Hoodie",
      price: 20,
      seller: "Mike Rodriguez",
      category: "Clothing",
      condition: "Like New",
      description: "Official campus merchandise, size M",
      image: "/cozy-hoodie.png",
      postedDate: "3 days ago",
    },
    {
      id: 4,
      title: "Mountain Bike",
      price: 180,
      seller: "Emma Wilson",
      category: "Sports",
      condition: "Good",
      description: "Perfect for campus commute and weekend trails",
      image: "/mountain-bike-trail.png",
      postedDate: "5 days ago",
    },
  ])

  const [likedItems, setLikedItems] = useState<Set<number>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [messageText, setMessageText] = useState("")

  const [newItemTitle, setNewItemTitle] = useState("")
  const [newItemPrice, setNewItemPrice] = useState("")
  const [newItemCondition, setNewItemCondition] = useState("")
  const [newItemCategory, setNewItemCategory] = useState("")
  const [newItemDescription, setNewItemDescription] = useState("")
  const [activeTab, setActiveTab] = useState("browse")
  const [statusMessage, setStatusMessage] = useState("")
  const [isSendingMessage, setIsSendingMessage] = useState(false)

  const handleLike = (itemId: number) => {
    setLikedItems((prev) => {
      const newLiked = new Set(prev)
      if (newLiked.has(itemId)) {
        newLiked.delete(itemId)
      } else {
        newLiked.add(itemId)
      }
      return newLiked
    })
  }

  const handleContactSeller = (item: Item) => {
    setSelectedItem(item)
    setContactDialogOpen(true)
    setMessageText("")
  }

  const handleSendMessage = async () => {
    if (!selectedItem || !messageText.trim() || isSendingMessage) {
      return
    }

    try {
      setIsSendingMessage(true)
      setStatusMessage("")
      const response = await contactMarketplaceSellerViaGateway(selectedItem.seller, selectedItem.title, messageText.trim())
      setStatusMessage(response.message)
      setContactDialogOpen(false)
      setMessageText("")
      setSelectedItem(null)
    } catch {
      setStatusMessage("Unable to send message right now.")
    } finally {
      setIsSendingMessage(false)
    }
  }

  const handleCreateListing = () => {
    if (!newItemTitle || !newItemPrice || !newItemCondition || !newItemCategory || !newItemDescription) {
      setStatusMessage("Please fill in all fields before creating a listing.")
      return
    }

    const categoryMap: { [key: string]: string } = {
      books: "Books",
      electronics: "Electronics",
      clothing: "Clothing",
      sports: "Sports",
    }

    const conditionMap: { [key: string]: string } = {
      new: "Like New",
      excellent: "Excellent",
      good: "Good",
      fair: "Fair",
    }

    const newItem: Item = {
      id: items.length + 1,
      title: newItemTitle,
      price: Number.parseFloat(newItemPrice),
      seller: "You",
      category: categoryMap[newItemCategory] || newItemCategory,
      condition: conditionMap[newItemCondition] || newItemCondition,
      description: newItemDescription,
      image: "/diverse-products-still-life.png",
      postedDate: "Just now",
    }

    setItems([newItem, ...items])

    // Reset form
    setNewItemTitle("")
    setNewItemPrice("")
    setNewItemCondition("")
    setNewItemCategory("")
    setNewItemDescription("")

    // Switch to browse tab to see the new listing
    setActiveTab("browse")

    setStatusMessage("Listing created successfully.")
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Books":
        return BookIcon
      case "Electronics":
        return LaptopIcon
      case "Clothing":
        return ShirtIcon
      case "Sports":
        return BikeIcon
      default:
        return ShoppingCartIcon
    }
  }

  return (
    <div className="space-y-6">
      <Card className="app-surface">
        <CardHeader>
          <CardTitle className="text-2xl">Campus Marketplace</CardTitle>
          <CardDescription>Buy and sell items securely within your campus community.</CardDescription>
          {statusMessage ? <p className="text-sm text-primary">{statusMessage}</p> : null}
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid h-11 w-full grid-cols-3 rounded-xl border border-border/70 bg-card/70 p-1">
          <TabsTrigger value="browse">Browse Items</TabsTrigger>
          <TabsTrigger value="sell">Sell Item</TabsTrigger>
          <TabsTrigger value="favorites">Favorites ({likedItems.size})</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Books">Books</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Clothing">Clothing</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
              const CategoryIcon = getCategoryIcon(item.category)
              return (
                <Card key={item.id} className="app-surface hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative overflow-hidden rounded-t-lg bg-muted">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant={likedItems.has(item.id) ? "default" : "secondary"}
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => handleLike(item.id)}
                    >
                      <HeartIcon className={`size-4 ${likedItems.has(item.id) ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                      <Badge variant="secondary" className="shrink-0">
                        ${item.price}
                      </Badge>
                    </div>
                    <CardDescription>by {item.seller}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <CategoryIcon className="size-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{item.category}</span>
                      <Badge variant="outline" className="ml-auto">
                        {item.condition}
                      </Badge>
                    </div>
                    <Button className="w-full" onClick={() => handleContactSeller(item)}>
                      <MessageCircleIcon className="size-4 mr-2" />
                      Contact Seller
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="sell" className="space-y-4">
          <Card className="app-surface">
            <CardHeader>
              <CardTitle>List an Item</CardTitle>
              <CardDescription>Create a listing for items you want to sell</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="item-title">Item Title</Label>
                <Input
                  id="item-title"
                  placeholder="e.g., Engineering Textbook Bundle"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="item-price">Price ($)</Label>
                  <Input
                    id="item-price"
                    type="number"
                    placeholder="45"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-condition">Condition</Label>
                  <Select value={newItemCondition} onValueChange={setNewItemCondition}>
                    <SelectTrigger id="item-condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Like New</SelectItem>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="item-category">Category</Label>
                <Select value={newItemCategory} onValueChange={setNewItemCategory}>
                  <SelectTrigger id="item-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="item-description">Description</Label>
                <Textarea
                  id="item-description"
                  placeholder="Describe your item, its condition, and any important details..."
                  rows={3}
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                />
              </div>

              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <PlusIcon className="size-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload photos
                  <br />
                  JPG or PNG (max 5MB each)
                </p>
              </div>

              <Button className="w-full" size="lg" onClick={handleCreateListing}>
                <ShoppingCartIcon className="size-4 mr-2" />
                Create Listing
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          {likedItems.size === 0 ? (
            <Card className="app-surface">
              <CardContent className="py-12 text-center">
                <HeartIcon className="size-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No favorites yet</p>
                <p className="text-sm text-muted-foreground mt-1">Like items to save them for later</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items
                .filter((item) => likedItems.has(item.id))
                .map((item) => (
                  <Card key={item.id} className="app-surface">
                    <div className="aspect-square relative overflow-hidden rounded-t-lg bg-muted">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription>${item.price}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" onClick={() => handleContactSeller(item)}>
                        <MessageCircleIcon className="size-4 mr-2" />
                        Contact Seller
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Seller</DialogTitle>
            <DialogDescription>
              Send a message to {selectedItem?.seller} about "{selectedItem?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                placeholder="Hi, I'm interested in your item. Is it still available?"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} disabled={!messageText.trim() || isSendingMessage}>
              <SendIcon className="size-4 mr-2" />
              {isSendingMessage ? "Sending..." : "Send Message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
