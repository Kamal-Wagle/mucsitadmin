"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Assignment } from "./assignments-module"
import { getAllSemesters, getSubjectsBySemester } from "@/data/csit-subjects"

interface AssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (assignmentData: any) => void
  initialAssignment?: Assignment | null
}

export default function AssignmentModal({ isOpen, onClose, onSave, initialAssignment }: AssignmentModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [instructions, setInstructions] = useState("")
  const [subject, setSubject] = useState("")
  const [semester, setSemester] = useState("")
  const [faculty, setFaculty] = useState("")
  const [year, setYear] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [fileUrl, setFileUrl] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [totalMarks, setTotalMarks] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [loading, setLoading] = useState(false)
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([])

  useEffect(() => {
    if (initialAssignment) {
      setTitle(initialAssignment.title)
      setDescription(initialAssignment.description)
      setInstructions(initialAssignment.instructions || "")
      setSubject(initialAssignment.subject || "")
      setSemester(initialAssignment.semester || "")
      setFaculty(initialAssignment.faculty || "")
      setYear(initialAssignment.year?.toString() || "")
      setDueDate(initialAssignment.dueDate?.split("T")[0] || "")
      setFileUrl(initialAssignment.fileUrl || "")
      setImageUrl(initialAssignment.imageUrl || "")
      setTotalMarks(initialAssignment.totalMarks?.toString() || "")
      setDifficulty(initialAssignment.difficulty || "")
    } else {
      setTitle("")
      setDescription("")
      setInstructions("")
      setSubject("")
      setSemester("")
      setFaculty("")
      setYear("")
      setDueDate("")
      setFileUrl("")
      setImageUrl("")
      setTotalMarks("")
      setDifficulty("")
    }
  }, [initialAssignment, isOpen])

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
    if (!title.trim() || !description.trim() || !dueDate || !fileUrl.trim()) {
      alert("Please fill in required fields: title, description, due date, and file URL")
      return
    }

    setLoading(true)
    await onSave({
      title,
      description,
      instructions,
      subject,
      semester,
      faculty,
      year: year ? Number.parseInt(year) : undefined,
      dueDate,
      fileUrl,
      imageUrl,
      totalMarks: totalMarks ? Number.parseInt(totalMarks) : undefined,
      difficulty,
    })
    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialAssignment ? "Edit Assignment" : "Create New Assignment"}</DialogTitle>
          <DialogDescription>
            {initialAssignment ? "Update your assignment details" : "Create a new assignment"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter assignment title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Enter assignment description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              placeholder="Enter submission instructions..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              disabled={loading}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="faculty">Faculty</Label>
              <Input
                id="faculty"
                placeholder="e.g., Science"
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="">Select difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalMarks">Total Marks</Label>
              <Input
                id="totalMarks"
                type="number"
                placeholder="e.g., 100"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileUrl">File URL *</Label>
            <Input
              id="fileUrl"
              placeholder="https://example.com/assignment.pdf"
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
              {loading ? "Saving..." : initialAssignment ? "Update Assignment" : "Create Assignment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
