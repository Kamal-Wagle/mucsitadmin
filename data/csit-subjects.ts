export interface SemesterSubjects {
  semester: string
  subjects: string[]
}

export const csitSubjects: SemesterSubjects[] = [
  {
    semester: "First Semester",
    subjects: ["Introduction to Information Technology", "C Programming", "Digital Logic", "Mathematics I", "Physics"],
  },
  {
    semester: "Second Semester",
    subjects: ["Discrete Structure", "Object Oriented Programming", "Microprocessor", "Mathematics II", "Statistic I"],
  },
  {
    semester: "Third Semester",
    subjects: [
      "Data Structure and Algorithms",
      "Numerical Method",
      "Computer Architecture",
      "Computer Graphics",
      "Statistics II",
    ],
  },
  {
    semester: "Fourth Semester",
    subjects: [
      "Theory of Computation",
      "Computer Networks",
      "Operating System",
      "Database Management System",
      "Artificial Intelligence",
    ],
  },
  {
    semester: "Fifth Semester",
    subjects: [
      "Design and Analysis of Algorithms",
      "System Analysis and Design",
      "Cryptography",
      "Simulation and Modeling",
      "Web. Technology",
    ],
  },
  {
    semester: "Sixth Semester",
    subjects: [
      "Software Engineering",
      "Complier Design and Construction",
      "E-Governance",
      "NET Centric Computing",
      "Technical Writing",
    ],
  },
  {
    semester: "Seventh Semester",
    subjects: ["Advanced Java programming", "Data Warehousing and Data Mining", "Principles of Management"],
  },
  {
    semester: "Eighth Semester",
    subjects: ["Advanced Database"],
  },
]

export const getAllSemesters = (): string[] => {
  return csitSubjects.map((s) => s.semester)
}

export const getAllSubjects = (): string[] => {
  const allSubjects = new Set<string>()
  csitSubjects.forEach((sem) => {
    sem.subjects.forEach((subject) => allSubjects.add(subject))
  })
  return Array.from(allSubjects).sort()
}

export const getSubjectsBySemester = (semesterName: string): string[] => {
  const semester = csitSubjects.find((s) => s.semester === semesterName)
  return semester?.subjects || []
}
