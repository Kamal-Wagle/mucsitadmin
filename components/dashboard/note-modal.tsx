"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Note } from "./dashboard"

interface NoteModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (title: string, content: string) => void
  initialNote?: Note | null
}

export default function NoteModal({ isOpen, onClose, onSave, initialNote }: NoteModalProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title)
      setContent(initialNote.content)
    } else {
      setTitle("")
      setContent("")
    }
  }, [initialNote, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      alert("Please fill in all fields")
      return
    }

    setLoading(true)
    await onSave(title, content)
    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initialNote ? "Edit Note" : "Create New Note"}</DialogTitle>
          <DialogDescription>
            {initialNote ? "Update your note content" : "Create a new note to keep track of your ideas"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Enter note content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
              rows={8}
              className="resize-none"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : initialNote ? "Update Note" : "Create Note"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
