"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Register from "./register"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void
}

export default function Login({ setIsAuthenticated }: LoginProps) {
  const [showRegister, setShowRegister] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("https://mucsitbackend.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Store token and user info
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      setIsAuthenticated(true)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (showRegister) {
    return <Register setShowRegister={setShowRegister} setIsAuthenticated={setIsAuthenticated} />
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md border-primary/20">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Sign in to manage your notes</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <button onClick={() => setShowRegister(true)} className="text-primary hover:underline font-semibold">
              Register here
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
