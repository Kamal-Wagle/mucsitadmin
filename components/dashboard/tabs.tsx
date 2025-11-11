"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, BookOpen, Bell, ClipboardList, HelpCircle } from "lucide-react"
import NotesModule from "./modules/notes-module"
import AssignmentsModule from "./modules/assignments-module"
import OldQuestionsModule from "./modules/old-questions-module"
import BlogModule from "./modules/blog-module"

export default function DashboardTabs() {
  return (
    <Tabs defaultValue="notes" className="w-full">
      <TabsList className="grid w-full grid-cols-5 gap-1 bg-muted p-1 rounded-lg mb-8">
        <TabsTrigger value="notes" className="gap-2 text-xs md:text-sm">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Notes</span>
        </TabsTrigger>
        <TabsTrigger value="assignments" className="gap-2 text-xs md:text-sm">
          <ClipboardList className="h-4 w-4" />
          <span className="hidden sm:inline">Assignments</span>
        </TabsTrigger>
        <TabsTrigger value="questions" className="gap-2 text-xs md:text-sm">
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Questions</span>
        </TabsTrigger>
        <TabsTrigger value="blog" className="gap-2 text-xs md:text-sm">
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">Blog</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="notes" className="mt-6">
        <NotesModule />
      </TabsContent>

      <TabsContent value="assignments" className="mt-6">
        <AssignmentsModule />
      </TabsContent>

      <TabsContent value="questions" className="mt-6">
        <OldQuestionsModule />
      </TabsContent>

      <TabsContent value="blog" className="mt-6">
        <BlogModule />
      </TabsContent>
    </Tabs>
  )
}
