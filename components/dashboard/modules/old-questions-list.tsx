"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, Calendar } from "lucide-react"
import type { OldQuestion } from "./old-questions-module"

interface OldQuestionsListProps {
  questions: OldQuestion[]
  onEdit: (question: OldQuestion) => void
  onDelete: (id: string) => void
  hasQuestions: boolean
}

export default function OldQuestionsList({ questions, onEdit, onDelete, hasQuestions }: OldQuestionsListProps) {
  if (!hasQuestions) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md text-center border-dashed">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-2">No questions yet</p>
            <p className="text-sm text-muted-foreground">Add old question papers</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md text-center border-dashed">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">No questions match your search</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {questions.map((question) => (
        <Card key={question._id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg line-clamp-2">{question.title}</CardTitle>
            <CardDescription className="flex items-center gap-1 text-xs">
              <Calendar className="h-3 w-3" />
              {new Date(question.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{question.content}</p>
            {(question.year || question.subject) && (
              <p className="text-xs text-primary mb-3 font-medium">
                {question.year && `Year: ${question.year}`}
                {question.year && question.subject && " • "}
                {question.subject && `Subject: ${question.subject}`}
              </p>
            )}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(question)} className="flex-1 gap-2">
                <Edit2 className="h-3 w-3" />
                Edit
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(question._id)} className="gap-2">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
