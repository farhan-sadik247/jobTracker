export interface JobApplication {
  _id?: string
  userId: string
  companyName: string
  jobTitle: string
  jobDescription: string
  applicationDate: Date
  deadline?: Date
  status: "applied" | "interview" | "rejected" | "offer" | "accepted"
  priority: "low" | "medium" | "high"
  jobUrl?: string
  notes?: string
  contactPerson?: string
  contactEmail?: string
  salary?: string
  location: string
  jobType: "full-time" | "part-time" | "internship" | "contract"
  createdAt: Date
  updatedAt: Date
}

export interface CVSuggestion {
  skills: string[]
  keywords: string[]
  improvements: string[]
  matchScore: number
}

export interface User {
  _id?: string
  email: string
  name: string
  createdAt: Date
}
