"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Note } from "./notes-module"
import { getAllSemesters, getSubjectsBySemester } from "@/data/csit-subjects"

interface NoteModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (noteData: any) => void
  initialNote?: Note | null
}

export default function NoteModal({ isOpen, onClose, onSave, initialNote }: NoteModalProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [description, setDescription] = useState("")
  const [subject, setSubject] = useState("")
  const [semester, setSemester] = useState("")
  const [faculty, setFaculty] = useState("")
  const [year, setYear] = useState("")
  const [fileUrl, setFileUrl] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([])

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title)
      setContent(initialNote.content)
      setDescription(initialNote.description || "")
      setSubject(initialNote.subject || "")
      setSemester(initialNote.semester || "")
      setFaculty(initialNote.faculty || "")
      setYear(initialNote.year?.toString() || "")
      setFileUrl(initialNote.fileUrl || "")
      setImageUrl(initialNote.imageUrl || "")
    } else {
      setTitle("")
      setContent("")
      setDescription("")
      setSubject("")
      setSemester("")
      setFaculty("")
      setYear("")
      setFileUrl("")
      setImageUrl("")
    }
  }, [initialNote, isOpen])

  useEffect(() => {
    if (semester) {
      setAvailableSubjects(getSubjectsBySemester(semester))
      setSubject("")
    } else {
      setAvailableSubjects([])
    }
  }, [semester])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !fileUrl.trim()) {
      alert("Please fill in title, content, and file URL")
      return
    }

    setLoading(true)
    await onSave({
      title,
      content,
      description,
      subject,
      semester,
      faculty,
      year: year ? Number.parseInt(year) : undefined,
      fileUrl,
      imageUrl,
    })
    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialNote ? "Edit Note" : "Create New Note"}</DialogTitle>
          <DialogDescription>{initialNote ? "Update your note details" : "Create a new note"}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter note title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <select
                id="semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="">Select semester</option>
                {getAllSemesters().map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={loading || availableSubjects.length === 0}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground disabled:opacity-50"
            >
              <option value="">{availableSubjects.length === 0 ? "Select semester first" : "Select subject"}</option>
              {availableSubjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              placeholder="Enter note content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
              rows={5}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Additional description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="faculty">Faculty</Label>
              <Input
                id="faculty"
                placeholder="e.g., Science and Technology"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                placeholder="e.g., 2025"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileUrl">File URL *</Label>
            <Input
              id="fileUrl"
              placeholder="https://example.com/file.pdf"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={loading}
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
