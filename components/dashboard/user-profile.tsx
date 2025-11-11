"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Mail, User, Calendar, LogOut } from "lucide-react"

interface UserData {
  _id: string
  name: string
  email: string
  createdAt: string
}

export default function UserProfile() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (!token) {
      router.push("/")
      return
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        console.error("Failed to parse user data")
      }
    }
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Unable to load profile</p>
            <Button onClick={() => router.push("/")} className="w-full">
              Return to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <div className="w-10"></div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">{initials}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase">Full Name</Label>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="text-foreground font-medium">{user.name}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase">Email</Label>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-foreground font-medium">{user.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase">Member Since</Label>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-foreground font-medium">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={handleLogout} variant="destructive" className="w-full gap-2 mt-8">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
