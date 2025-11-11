"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import OldQuestionsList from "./old-questions-list"
import OldQuestionModal from "./old-question-modal"
import { apiService } from "@/lib/api"

export interface OldQuestion {
  _id: string
  title: string
  question: string
  answer: string
  subject: string
  semester?: string
  faculty?: string
  year?: number
  description?: string
  fileUrl: string
  imageUrl?: string
  seoKeywords?: string[]
  seoDescription?: string
  author: {
    _id: string
    name: string
    email: string
  }
  difficulty?: "easy" | "medium" | "hard"
  views: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export default function OldQuestionsModule() {
  const [questions, setQuestions] = useState<OldQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<OldQuestion | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"createdAt" | "updatedAt" | "title" | "views" | "year">("createdAt")
  const [order, setOrder] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(1)
  const [limit] = useState(9)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    fetchQuestions(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy, order])

  const fetchQuestions = async (requestedPage: number) => {
    try {
      setLoading(true)
      const shouldUseSearch = Boolean(searchQuery) || Boolean(sortBy) || Boolean(order)
      const resp = shouldUseSearch
        ? await apiService.searchPaginated("old-questions", {
            page: requestedPage,
            limit,
            sortBy,
            order,
            q: searchQuery || undefined,
            query: searchQuery || undefined,
            search: searchQuery || undefined,
          })
        : await apiService.getPaginated("old-questions", { page: requestedPage, limit })
      const items = Array.isArray(resp) ? resp : (resp.oldQuestions ?? resp.data ?? [])
      setQuestions(items)
      setTotalPages(resp.totalPages ?? 1)
      setTotalCount(resp.total ?? resp.count ?? (resp.oldQuestions?.length ?? 0))
    } catch (error) {
      console.error("[v0] Error fetching questions:", error)
      alert(`Failed to load old questions: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setPage(1)
    fetchQuestions(1)
  }

  const handleAddQuestion = () => {
    setSelectedQuestion(null)
    setIsModalOpen(true)
  }

  const handleEditQuestion = (question: OldQuestion) => {
    setSelectedQuestion(question)
    setIsModalOpen(true)
  }

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return

    try {
      await apiService.delete("old-questions", id)
      await fetchQuestions(page)
    } catch (error) {
      console.error("Error deleting question:", error)
      alert("Failed to delete question")
    }
  }

  const handleSaveQuestion = async (questionData: any) => {
    try {
      if (selectedQuestion) {
        const updatedQuestion = await apiService.update<OldQuestion>(
          "old-questions",
          selectedQuestion._id,
          questionData,
        )
        setQuestions(questions.map((q) => (q._id === selectedQuestion._id ? updatedQuestion : q)))
      } else {
        await apiService.create<OldQuestion>("old-questions", questionData)
        setPage(1)
        await fetchQuestions(1)
      }

      setIsModalOpen(false)
    } catch (error) {
      console.error("Error saving question:", error)
      alert("Failed to save question")
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Old Questions</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage question papers</p>
          <p className="text-muted-foreground text-xs mt-1">
            Showing page {page} of {totalPages} {totalCount ? `(total ${totalCount})` : ""}
          </p>
        </div>
        <Button onClick={handleAddQuestion} className="gap-2">
          <Plus className="h-4 w-4" />
          New Question
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <input
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search old questions..."
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
          <option value="year">Sort by: Year</option>
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
            <p className="text-muted-foreground">Loading questions...</p>
          </div>
        </div>
      ) : (
        <>
          <OldQuestionsList
            questions={questions}
            onEdit={handleEditQuestion}
            onDelete={handleDeleteQuestion}
            hasQuestions={totalCount > 0}
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

      <OldQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveQuestion}
        initialQuestion={selectedQuestion}
      />
    </div>
  )
}
