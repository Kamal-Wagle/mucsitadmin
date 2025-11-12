"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit2, Trash2, Calendar, User } from "lucide-react"
import type { Blog } from "./blog-module"

interface BlogListProps {
  blogs: Blog[]
  onEdit: (blog: Blog) => void
  onDelete: (id: string) => void
  hasBlogs: boolean
}

export default function BlogList({ blogs, onEdit, onDelete, hasBlogs }: BlogListProps) {
  if (!hasBlogs) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md text-center border-dashed">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-2">No blog posts yet</p>
            <p className="text-sm text-muted-foreground">Create your first blog post</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (blogs.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md text-center border-dashed">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">No blog posts match your search</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {blogs.map((blog) => (
        <Card key={blog._id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg line-clamp-2">{blog.title}</CardTitle>
            <CardDescription className="flex flex-col gap-1">
              <span className="flex items-center gap-1 text-xs">
                <Calendar className="h-3 w-3" />
                {new Date(blog.createdAt).toLocaleDateString()}
              </span>
              {blog.author && (
                <span className="flex items-center gap-1 text-xs">
                  <User className="h-3 w-3" />
                  {blog.author.name || blog.author.email}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{blog.excerpt || blog.description || ""}</p>
            {blog.category && (
              <div className="mb-4">
                <Badge variant="secondary">{blog.category}</Badge>
              </div>
            )}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(blog)} className="flex-1 gap-2">
                <Edit2 className="h-3 w-3" />
                Edit
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(blog._id)} className="gap-2">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
