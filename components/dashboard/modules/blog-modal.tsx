"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import type { Blog, BlogSection } from "./blog-module"

interface BlogModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (blogData: any) => void
  initialBlog?: Blog | null
}

export default function BlogModal({ isOpen, onClose, onSave, initialBlog }: BlogModalProps) {
  const [title, setTitle] = useState("")
  const [sections, setSections] = useState<BlogSection[]>([{ text: "", imageUrl: "" }])
  const [excerpt, setExcerpt] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [fileUrl, setFileUrl] = useState("")
  const [isFeatured, setIsFeatured] = useState(false)
  const [readTimeMinutes, setReadTimeMinutes] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialBlog) {
      setTitle(initialBlog.title)
      setSections(
        initialBlog.sections && initialBlog.sections.length > 0 ? initialBlog.sections : [{ text: "", imageUrl: "" }],
      )
      setExcerpt(initialBlog.excerpt || "")
      setCategory(initialBlog.category || "")
      setDescription(initialBlog.description || "")
      setFileUrl(initialBlog.fileUrl || "")
      setIsFeatured(initialBlog.isFeatured || false)
      setReadTimeMinutes(initialBlog.readTimeMinutes?.toString() || "")
    } else {
      setTitle("")
      setSections([{ text: "", imageUrl: "" }])
      setExcerpt("")
      setCategory("")
      setDescription("")
      setFileUrl("")
      setIsFeatured(false)
      setReadTimeMinutes("")
    }
  }, [initialBlog, isOpen])

  const handleAddSection = () => {
    setSections([...sections, { text: "", imageUrl: "" }])
  }

  const handleRemoveSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index))
  }

  const handleUpdateSection = (index: number, field: keyof BlogSection, value: string) => {
    const newSections = [...sections]
    newSections[index] = { ...newSections[index], [field]: value }
    setSections(newSections)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || sections.length === 0 || !fileUrl.trim()) {
      alert("Please fill in required fields: title, at least one section, and file URL")
      return
    }

    setLoading(true)
    await onSave({
      title,
      sections: sections.filter((s) => s.text || s.imageUrl),
      excerpt,
      category,
      description,
      fileUrl,
      isFeatured,
      readTimeMinutes: readTimeMinutes ? Number.parseInt(readTimeMinutes) : undefined,
    })
    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialBlog ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
          <DialogDescription>{initialBlog ? "Update your blog post" : "Write a new blog post"}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter blog post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              placeholder="Brief summary of the blog post..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              disabled={loading}
              rows={2}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="e.g., Technology"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="readTime">Read Time (minutes)</Label>
              <Input
                id="readTime"
                type="number"
                placeholder="e.g., 5"
                value={readTimeMinutes}
                onChange={(e) => setReadTimeMinutes(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Sections *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSection}
                disabled={loading}
                className="gap-2 bg-transparent"
              >
                <Plus className="h-4 w-4" />
                Add Section
              </Button>
            </div>

            {sections.map((section, index) => (
              <div key={index} className="p-3 border border-input rounded-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Section {index + 1}</span>
                  {sections.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSection(index)}
                      disabled={loading}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <Textarea
                  placeholder="Section text..."
                  value={section.text || ""}
                  onChange={(e) => handleUpdateSection(index, "text", e.target.value)}
                  disabled={loading}
                  rows={3}
                  className="resize-none"
                />

                <Input
                  placeholder="Section image URL..."
                  value={section.imageUrl || ""}
                  onChange={(e) => handleUpdateSection(index, "imageUrl", e.target.value)}
                  disabled={loading}
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileUrl">File URL *</Label>
            <Input
              id="fileUrl"
              placeholder="https://example.com/blog.pdf"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              disabled={loading}
              className="w-4 h-4"
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Featured Post
            </Label>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : initialBlog ? "Update Post" : "Publish Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
