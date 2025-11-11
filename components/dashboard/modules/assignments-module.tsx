"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import AssignmentsList from "./assignments-list"
import AssignmentModal from "./assignment-modal"
import { apiService } from "@/lib/api"

export interface Assignment {
  _id: string
  title: string
  description: string
  instructions?: string
  subject?: string
  semester?: string
  faculty?: string
  year?: number
  dueDate: string
  fileUrl: string
  imageUrl?: string
  seoKeywords?: string[]
  seoDescription?: string
  author: {
    _id: string
    name: string
    email: string
  }
  totalMarks?: number
  difficulty?: "easy" | "medium" | "hard"
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export default function AssignmentsModule() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"createdAt" | "updatedAt" | "title" | "dueDate">("createdAt")
  const [order, setOrder] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(1)
  const [limit] = useState(9)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    fetchAssignments(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy, order])

  const fetchAssignments = async (requestedPage: number) => {
    try {
      setLoading(true)
      const shouldUseSearch = Boolean(searchQuery) || Boolean(sortBy) || Boolean(order)
      const resp = shouldUseSearch
        ? await apiService.searchPaginated("assignments", {
            page: requestedPage,
            limit,
            sortBy,
            order,
            q: searchQuery || undefined,
            query: searchQuery || undefined,
            search: searchQuery || undefined,
          })
        : await apiService.getPaginated("assignments", { page: requestedPage, limit })
      const items = Array.isArray(resp) ? resp : (resp.assignments ?? resp.data ?? [])
      setAssignments(items)
      setTotalPages(resp.totalPages ?? 1)
      setTotalCount(resp.total ?? resp.count ?? (resp.assignments?.length ?? 0))
    } catch (error) {
      console.error("[v0] Error fetching assignments:", error)
      alert(`Failed to load assignments: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setPage(1)
    fetchAssignments(1)
  }

  const handleAddAssignment = () => {
    setSelectedAssignment(null)
    setIsModalOpen(true)
  }

  const handleEditAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment)
    setIsModalOpen(true)
  }

  const handleDeleteAssignment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return

    try {
      await apiService.delete("assignments", id)
      await fetchAssignments(page)
    } catch (error) {
      console.error("Error deleting assignment:", error)
      alert("Failed to delete assignment")
    }
  }

  const handleSaveAssignment = async (assignmentData: any) => {
    try {
      if (selectedAssignment) {
        const updatedAssignment = await apiService.update<Assignment>(
          "assignments",
          selectedAssignment._id,
          assignmentData,
        )
        setAssignments(assignments.map((a) => (a._id === selectedAssignment._id ? updatedAssignment : a)))
      } else {
        await apiService.create<Assignment>("assignments", assignmentData)
        setPage(1)
        await fetchAssignments(1)
      }

      setIsModalOpen(false)
    } catch (error) {
      console.error("Error saving assignment:", error)
      alert("Failed to save assignment")
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Assignments</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage your assignments</p>
          <p className="text-muted-foreground text-xs mt-1">
            Showing page {page} of {totalPages} {totalCount ? `(total ${totalCount})` : ""}
          </p>
        </div>
        <Button onClick={handleAddAssignment} className="gap-2">
          <Plus className="h-4 w-4" />
          New Assignment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <input
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search assignments..."
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
          <option value="dueDate">Sort by: Due date</option>
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
            <p className="text-muted-foreground">Loading assignments...</p>
          </div>
        </div>
      ) : (
        <>
          <AssignmentsList
            assignments={assignments}
            onEdit={handleEditAssignment}
            onDelete={handleDeleteAssignment}
            hasAssignments={totalCount > 0}
          />
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
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

      <AssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAssignment}
        initialAssignment={selectedAssignment}
      />
    </div>
  )
}
