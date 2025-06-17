"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Search, Filter, Calendar, Briefcase } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { JobApplication } from "../lib/types"
import { formatDate, getDaysUntilDeadline, getStatusColor, getPriorityColor } from "../lib/utils"
import JobForm from "../components/job-form"
import JobDetails from "../components/job-details"
import StatsCards from "../components/stats-cards"

export default function Dashboard() {
  const [jobs, setJobs] = useState<JobApplication[]>([])
  const [filteredJobs, setFilteredJobs] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showJobForm, setShowJobForm] = useState(false)
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null)
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null)

  const filterJobs = useCallback(() => {
    let filtered = jobs

    if (statusFilter !== "all") {
      filtered = filtered.filter((job) => job.status === statusFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredJobs(filtered)
  }, [jobs, searchTerm, statusFilter])

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    filterJobs()
  }, [filterJobs])

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/jobs?userId=demo-user")
      const data = await response.json()
      setJobs(data)
    } catch (error) {
      console.error("Failed to fetch jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleJobSubmit = async (jobData: Partial<JobApplication>) => {
    try {
      if (editingJob) {
        await fetch(`/api/jobs/${editingJob._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jobData),
        })
      } else {
        await fetch("/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...jobData, userId: "demo-user" }),
        })
      }

      fetchJobs()
      setShowJobForm(false)
      setEditingJob(null)
    } catch (error) {
      console.error("Failed to save job:", error)
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    try {
      await fetch(`/api/jobs/${jobId}`, { method: "DELETE" })
      fetchJobs()
      setSelectedJob(null)
    } catch (error) {
      console.error("Failed to delete job:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your job applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Job Tracker</h1>
            </div>
            <Button onClick={() => setShowJobForm(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Job Application
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <StatsCards jobs={jobs} />

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search companies, positions, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Job Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Card
              key={job._id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedJob(job)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-1">{job.jobTitle}</CardTitle>
                    <p className="text-gray-600 font-medium">{job.companyName}</p>
                    <p className="text-sm text-gray-500">{job.location}</p>
                  </div>
                  <Badge className={getPriorityColor(job.priority)}>{job.priority}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                    <span className="text-sm text-gray-500">{formatDate(job.applicationDate)}</span>
                  </div>

                  {job.deadline && (
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span
                        className={`${
                          getDaysUntilDeadline(job.deadline) <= 3 ? "text-red-600 font-medium" : "text-gray-600"
                        }`}
                      >
                        {getDaysUntilDeadline(job.deadline) > 0
                          ? `${getDaysUntilDeadline(job.deadline)} days left`
                          : "Deadline passed"}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {job.jobType}
                    </Badge>
                    {job.salary && <span className="text-sm font-medium text-green-600">{job.salary}</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No job applications found</h3>
            <p className="text-gray-600 mb-4">
              {jobs.length === 0
                ? "Start tracking your job applications by adding your first one!"
                : "Try adjusting your search or filter criteria."}
            </p>
            {jobs.length === 0 && <Button onClick={() => setShowJobForm(true)}>Add Your First Job Application</Button>}
          </div>
        )}
      </div>

      {/* Job Form Modal */}
      {showJobForm && (
        <JobForm
          job={editingJob}
          onSubmit={handleJobSubmit}
          onClose={() => {
            setShowJobForm(false)
            setEditingJob(null)
          }}
        />
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetails
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onEdit={(job) => {
            setEditingJob(job)
            setShowJobForm(true)
            setSelectedJob(null)
          }}
          onDelete={handleDeleteJob}
        />
      )}
    </div>
  )
}