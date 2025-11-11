"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import BlogList from "./blog-list"
import BlogModal from "./blog-modal"
import { apiService } from "@/lib/api"

export interface BlogSection {
  text?: string
  imageUrl?: string
}

export interface Blog {
  _id: string
  title: string
  sections: BlogSection[]
  excerpt?: string
  category?: string
  description?: string
  fileUrl: string
  seoKeywords?: string[]
  seoDescription?: string
  author: {
    _id: string
    name: string
    email: string
  }
  views: number
  likes: number
  isPublished: boolean
  isFeatured: boolean
  readTimeMinutes?: number
  createdAt: string
  updatedAt: string
}

export default function BlogModule() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"createdAt" | "updatedAt" | "title" | "views" | "likes">("createdAt")
  const [order, setOrder] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(1)
  const [limit] = useState(9)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    fetchBlogs(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy, order])

  const fetchBlogs = async (requestedPage: number) => {
    try {
      setLoading(true)
      const shouldUseSearch = Boolean(searchQuery) || Boolean(sortBy) || Boolean(order)
      const resp = shouldUseSearch
        ? await apiService.searchPaginated("blogs", {
            page: requestedPage,
            limit,
            sortBy,
            order,
            // send common aliases to match backend expectations
            q: searchQuery || undefined,
            query: searchQuery || undefined,
            search: searchQuery || undefined,
          })
        : await apiService.getPaginated("blogs", { page: requestedPage, limit })
      const items = Array.isArray(resp) ? resp : (resp.blogs ?? resp.data ?? [])
      setBlogs(items)
      setTotalPages(resp.totalPages ?? 1)
      setTotalCount(resp.total ?? resp.count ?? (resp.blogs?.length ?? 0))
    } catch (error) {
      console.error("[v0] Error fetching blogs:", error)
      alert(`Failed to load blogs: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setPage(1)
    fetchBlogs(1)
  }

  const handleAddBlog = () => {
    setSelectedBlog(null)
    setIsModalOpen(true)
  }

  const handleEditBlog = (blog: Blog) => {
    setSelectedBlog(blog)
    setIsModalOpen(true)
  }

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return

    try {
      await apiService.delete("blogs", id)
      await fetchBlogs(page)
    } catch (error) {
      console.error("Error deleting blog:", error)
      alert("Failed to delete blog")
    }
  }

  const handleSaveBlog = async (blogData: any) => {
    try {
      if (selectedBlog) {
        const updatedBlog = await apiService.update<Blog>("blogs", selectedBlog._id, blogData)
        setBlogs(blogs.map((b) => (b._id === selectedBlog._id ? updatedBlog : b)))
      } else {
        await apiService.create<Blog>("blogs", blogData)
        setPage(1)
        await fetchBlogs(1)
      }

      setIsModalOpen(false)
    } catch (error) {
      console.error("Error saving blog:", error)
      alert("Failed to save blog")
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Blog</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage blog posts</p>
          <p className="text-muted-foreground text-xs mt-1">
            Showing page {page} of {totalPages} {totalCount ? `(total ${totalCount})` : ""}
          </p>
        </div>
        <Button onClick={handleAddBlog} className="gap-2">
          <Plus className="h-4 w-4" />
          New Blog Post
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <input
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search blogs..."
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
          <option value="likes">Sort by: Likes</option>
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
            <p className="text-muted-foreground">Loading blog posts...</p>
          </div>
        </div>
      ) : (
        <>
          <BlogList
            blogs={blogs}
            onEdit={handleEditBlog}
            onDelete={handleDeleteBlog}
            hasBlogs={totalCount > 0}
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

      <BlogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBlog}
        initialBlog={selectedBlog}
      />
    </div>
  )
}
