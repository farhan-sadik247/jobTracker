"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CVSuggestion, JobApplication } from "../lib/types"


interface JobFormProps {
  job?: JobApplication | null
  onSubmit: (job: Partial<JobApplication>) => void
  onClose: () => void
}

export default function JobForm({ job, onSubmit, onClose }: JobFormProps) {
  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    jobDescription: "",
    applicationDate: new Date().toISOString().split("T")[0],
    deadline: "",
    status: "applied" as "applied" | "interview" | "offer" | "rejected" | "accepted",
    priority: "medium" as "low" | "medium" | "high",
    jobUrl: "",
    notes: "",
    contactPerson: "",
    contactEmail: "",
    salary: "",
    location: "",
    jobType: "internship" as "internship" | "full-time" | "part-time" | "contract",
  })

  const [aiSuggestions, setAiSuggestions] = useState<CVSuggestion | null>(null)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [currentCV, setCurrentCV] = useState("")

  useEffect(() => {
    if (job) {
      setFormData({
        companyName: job.companyName,
        jobTitle: job.jobTitle,
        jobDescription: job.jobDescription,
        applicationDate: new Date(job.applicationDate).toISOString().split("T")[0],
        deadline: job.deadline ? new Date(job.deadline).toISOString().split("T")[0] : "",
        status: job.status,
        priority: job.priority,
        jobUrl: job.jobUrl || "",
        notes: job.notes || "",
        contactPerson: job.contactPerson || "",
        contactEmail: job.contactEmail || "",
        salary: job.salary || "",
        location: job.location,
        jobType: job.jobType,
      })
    }
  }, [job])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Convert string dates to Date objects before submission
    onSubmit({
      ...formData,
      applicationDate: new Date(formData.applicationDate),
      deadline: formData.deadline ? new Date(formData.deadline) : undefined,
    })
  }

  const generateAISuggestions = async () => {
    if (!formData.jobDescription.trim()) {
      alert("Please enter a job description first")
      return
    }

    setLoadingSuggestions(true)
    try {
      const response = await fetch("/api/ai/cv-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: formData.jobDescription,
          currentCV: currentCV,
        }),
      })

      const data = await response.json()
      setAiSuggestions(data.error ? data.fallback : data)
    } catch (error) {
      console.error("Failed to get AI suggestions:", error)
      // Fallback suggestions
      setAiSuggestions({
        skills: ["Communication", "Problem Solving", "Teamwork"],
        keywords: ["Experience", "Leadership", "Innovation"],
        improvements: ["Add specific achievements", "Include relevant metrics"],
        matchScore: 70,
      })
    } finally {
      setLoadingSuggestions(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">{job ? "Edit Job Application" : "Add New Job Application"}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jobType">Job Type</Label>
                  <Select value={formData.jobType} onValueChange={(value: string) => handleInputChange("jobType", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: string) => handleInputChange("priority", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="applicationDate">Application Date</Label>
                  <Input
                    id="applicationDate"
                    type="date"
                    value={formData.applicationDate}
                    onChange={(e) => handleInputChange("applicationDate", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="deadline">Deadline (Optional)</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange("deadline", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: string) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="salary">Salary (Optional)</Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => handleInputChange("salary", e.target.value)}
                  placeholder="e.g., $50,000 - $60,000"
                />
              </div>

              <div>
                <Label htmlFor="jobUrl">Job URL (Optional)</Label>
                <Input
                  id="jobUrl"
                  type="url"
                  value={formData.jobUrl}
                  onChange={(e) => handleInputChange("jobUrl", e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Right Column - Detailed Info & AI */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="jobDescription">Job Description *</Label>
                <Textarea
                  id="jobDescription"
                  value={formData.jobDescription}
                  onChange={(e) => handleInputChange("jobDescription", e.target.value)}
                  rows={6}
                  required
                  placeholder="Paste the job description here..."
                />
              </div>

              {/* AI CV Suggestions Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    AI CV Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="currentCV">Current CV/Resume (Optional)</Label>
                    <Textarea
                      id="currentCV"
                      value={currentCV}
                      onChange={(e) => setCurrentCV(e.target.value)}
                      rows={3}
                      placeholder="Paste your current CV content for better suggestions..."
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={generateAISuggestions}
                    disabled={loadingSuggestions}
                    className="w-full"
                  >
                    {loadingSuggestions ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Suggestions...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Get AI CV Suggestions
                      </>
                    )}
                  </Button>

                  {aiSuggestions && (
                    <div className="space-y-4 mt-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Match Score</h4>
                        <Badge
                          variant={
                            aiSuggestions.matchScore >= 80
                              ? "default"
                              : aiSuggestions.matchScore >= 60
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {aiSuggestions.matchScore}%
                        </Badge>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Key Skills to Highlight</h4>
                        <div className="flex flex-wrap gap-2">
                          {aiSuggestions.skills.map((skill, index) => (
                            <Badge key={index} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Important Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {aiSuggestions.keywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Improvements</h4>
                        <ul className="text-sm space-y-1">
                          {aiSuggestions.improvements.map((improvement, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-600 mr-2">•</span>
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div>
                <Label htmlFor="contactPerson">Contact Person (Optional)</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="contactEmail">Contact Email (Optional)</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={4}
                  placeholder="Any additional notes about this application..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{job ? "Update Application" : "Add Application"}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
