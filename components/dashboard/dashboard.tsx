"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "./header"
import DashboardTabs from "./tabs"

export interface Note {
  _id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export default function Dashboard() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/")
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={setSearchQuery} onLogout={() => router.push("/")} />

      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage all your content in one place</p>
        </div>

        <DashboardTabs />
      </main>
    </div>
  )
}
