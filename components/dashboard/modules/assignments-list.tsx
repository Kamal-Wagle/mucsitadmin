"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, Calendar } from "lucide-react"
import type { Assignment } from "./assignments-module"

interface AssignmentsListProps {
  assignments: Assignment[]
  onEdit: (assignment: Assignment) => void
  onDelete: (id: string) => void
  hasAssignments: boolean
}

export default function AssignmentsList({ assignments, onEdit, onDelete, hasAssignments }: AssignmentsListProps) {
  if (!hasAssignments) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md text-center border-dashed">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-2">No assignments yet</p>
            <p className="text-sm text-muted-foreground">Create your first assignment to get started</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (assignments.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md text-center border-dashed">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">No assignments match your search</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {assignments.map((assignment) => (
        <Card key={assignment._id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg line-clamp-2">{assignment.title}</CardTitle>
            <CardDescription className="flex items-center gap-1 text-xs">
              <Calendar className="h-3 w-3" />
              Due: {new Date(assignment.dueDate).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{assignment.description}</p>
            {assignment.subject && (
              <p className="text-xs text-primary mb-3 font-medium">Subject: {assignment.subject}</p>
            )}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(assignment)} className="flex-1 gap-2">
                <Edit2 className="h-3 w-3" />
                Edit
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(assignment._id)} className="gap-2">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
