"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { OldQuestion } from "./old-questions-module"
import { getAllSemesters, getSubjectsBySemester } from "@/data/csit-subjects"

interface OldQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (questionData: any) => void
  initialQuestion?: OldQuestion | null
}

export default function OldQuestionModal({ isOpen, onClose, onSave, initialQuestion }: OldQuestionModalProps) {
  const [title, setTitle] = useState("")
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [subject, setSubject] = useState("")
  const [semester, setSemester] = useState("")
  const [faculty, setFaculty] = useState("")
  const [year, setYear] = useState("")
  const [description, setDescription] = useState("")
  const [fileUrl, setFileUrl] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [loading, setLoading] = useState(false)
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([])

  useEffect(() => {
    if (initialQuestion) {
      setTitle(initialQuestion.title)
      setQuestion(initialQuestion.question)
      setAnswer(initialQuestion.answer)
      setSubject(initialQuestion.subject)
      setSemester(initialQuestion.semester || "")
      setFaculty(initialQuestion.faculty || "")
      setYear(initialQuestion.year?.toString() || "")
      setDescription(initialQuestion.description || "")
      setFileUrl(initialQuestion.fileUrl || "")
      setImageUrl(initialQuestion.imageUrl || "")
      setDifficulty(initialQuestion.difficulty || "")
    } else {
      setTitle("")
      setQuestion("")
      setAnswer("")
      setSubject("")
      setSemester("")
      setFaculty("")
      setYear("")
      setDescription("")
      setFileUrl("")
      setImageUrl("")
      setDifficulty("")
    }
  }, [initialQuestion, isOpen])

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
    if (!title.trim() || !question.trim() || !answer.trim() || !subject.trim() || !fileUrl.trim()) {
      alert("Please fill in required fields: title, question, answer, subject, and file URL")
      return
    }

    setLoading(true)
    await onSave({
      title,
      question,
      answer,
      subject,
      semester,
      faculty,
      year: year ? Number.parseInt(year) : undefined,
      description,
      fileUrl,
      imageUrl,
      difficulty,
    })
    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialQuestion ? "Edit Question" : "Add Old Question Paper"}</DialogTitle>
          <DialogDescription>
            {initialQuestion ? "Update question details" : "Add old question papers for students"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Final Exam 2023"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="question">Question *</Label>
            <Textarea
              id="question"
              placeholder="Enter the question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={loading}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="answer">Answer *</Label>
            <Textarea
              id="answer"
              placeholder="Enter the answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={loading}
              rows={4}
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
              <Label htmlFor="subject">Subject *</Label>
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
                placeholder="e.g., 2023"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                disabled={loading}
              />
            </div>
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

          <div className="space-y-2">
            <Label htmlFor="fileUrl">File URL *</Label>
            <Input
              id="fileUrl"
              placeholder="https://example.com/paper.pdf"
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
              {loading ? "Saving..." : initialQuestion ? "Update Question" : "Add Question"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
