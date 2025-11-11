"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogOut, Search, User } from "lucide-react"

interface HeaderProps {
  onSearch: (query: string) => void
  onLogout: () => void
}

export default function Header({ onSearch, onLogout }: HeaderProps) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
    onLogout()
  }

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              N
            </div>
            <div>
              <h2 className="font-bold text-lg text-foreground">Notes Admin</h2>
              <p className="text-xs text-muted-foreground">Manage your notes</p>
            </div>
          </div>

          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search notes..." onChange={(e) => onSearch(e.target.value)} className="pl-10" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.push("/profile")} className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search notes..." onChange={(e) => onSearch(e.target.value)} className="pl-10" />
          </div>
        </div>
      </div>
    </header>
  )
}
