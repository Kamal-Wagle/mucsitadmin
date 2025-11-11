"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import NotesList from "./notes-list"
import NoteModal from "./note-modal"
import { apiService } from "@/lib/api"

export interface Note {
  _id: string
  title: string
  content: string
  description?: string
  subject?: string
  semester?: string
  faculty?: string
  year?: number
  fileUrl: string
  imageUrl?: string
  seoKeywords?: string[]
  seoDescription?: string
  author: {
    _id: string
    name: string
    email: string
  }
  views: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export default function NotesModule() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"createdAt" | "updatedAt" | "title" | "views">("createdAt")
  const [order, setOrder] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(1)
  const [limit] = useState(9) // grid shows up to 3 cols; 9 fits nicely
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    fetchNotes(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy, order])

  const fetchNotes = async (requestedPage: number) => {
    try {
      setLoading(true)
      // When searching or using explicit sorting, hit /notes/search to leverage backend features
      const shouldUseSearch = Boolean(searchQuery) || Boolean(sortBy) || Boolean(order)
      const resp = shouldUseSearch
        ? await apiService.searchPaginated("notes", {
            page: requestedPage,
            limit,
            sortBy,
            order,
            q: searchQuery || undefined,
          })
        : await apiService.getPaginated("notes", { page: requestedPage, limit })
      // resp shape based on backend: { count, total, page, totalPages, notes }
      setNotes(resp.notes ?? [])
      setTotalPages(resp.totalPages ?? 1)
      setTotalCount(resp.total ?? resp.count ?? (resp.notes?.length ?? 0))
    } catch (error) {
      console.error("[v0] Error fetching notes:", error)
      alert(`Failed to load notes: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setPage(1)
    // Fire a fetch immediately for responsiveness
    fetchNotes(1)
  }

  const handleAddNote = () => {
    setSelectedNote(null)
    setIsModalOpen(true)
  }

  const handleEditNote = (note: Note) => {
    setSelectedNote(note)
    setIsModalOpen(true)
  }

  const handleDeleteNote = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return

    try {
      await apiService.delete("notes", id)
      // Refetch to keep pagination metadata accurate
      await fetchNotes(page)
    } catch (error) {
      console.error("Error deleting note:", error)
      alert("Failed to delete note")
    }
  }

  const handleSaveNote = async (noteData: any) => {
    try {
      if (selectedNote) {
        const updatedNote = await apiService.update<Note>("notes", selectedNote._id, noteData)
        setNotes(notes.map((n) => (n._id === selectedNote._id ? updatedNote : n)))
      } else {
        await apiService.create<Note>("notes", noteData)
        // After create, refetch from first page so new items appear predictably
        setPage(1)
        await fetchNotes(1)
      }

      setIsModalOpen(false)
    } catch (error) {
      console.error("Error saving note:", error)
      alert("Failed to save note")
    }
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false),
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Notes</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage your notes</p>
          <p className="text-muted-foreground text-xs mt-1">
            Showing page {page} of {totalPages} {totalCount ? `(total ${totalCount})` : ""}
          </p>
        </div>
        <Button onClick={handleAddNote} className="gap-2">
          <Plus className="h-4 w-4" />
          New Note
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <input
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search notes..."
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
        >
          <option value="createdAt">Sort by: Created</option>
          <option value="updatedAt">Sort by: Updated</option>
          <option value="title">Sort by: Title</option>
          <option value="views">Sort by: Views</option>
        </select>
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value as any)}
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
        >
          <option value="desc">Order: Descending</option>
          <option value="asc">Order: Ascending</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading notes...</p>
          </div>
        </div>
      ) : (
        <>
          <NotesList
            notes={filteredNotes}
            onEdit={handleEditNote}
            onDelete={handleDeleteNote}
            hasNotes={totalCount > 0}
          />
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
            >
              Next
            </Button>
          </div>
        </>
      )}

      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNote}
        initialNote={selectedNote}
      />
    </div>
  )
}
