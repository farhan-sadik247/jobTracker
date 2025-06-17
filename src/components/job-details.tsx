"use client"

import { X, Edit, Trash2, ExternalLink, Calendar, MapPin, DollarSign, User, Mail, FileText } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { JobApplication } from '../lib/types'


// Add these utility functions directly in this file
function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function getDaysUntilDeadline(deadline: Date | string) {
  const today = new Date()
  const deadlineDate = new Date(deadline)
  const diffTime = deadlineDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

function getStatusColor(status: string) {
  switch (status) {
    case "applied":
      return "bg-blue-100 text-blue-800"
    case "interview":
      return "bg-yellow-100 text-yellow-800"
    case "rejected":
      return "bg-red-100 text-red-800"
    case "offer":
      return "bg-green-100 text-green-800"
    case "accepted":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800"
    case "medium":
      return "bg-yellow-100 text-yellow-800"
    case "low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

interface JobDetailsProps {
  job: JobApplication
  onClose: () => void
  onEdit: (job: JobApplication) => void
  onDelete: (jobId: string) => void
}
export default function JobDetails({ job, onClose, onEdit, onDelete }: JobDetailsProps) {
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this job application?")) {
      onDelete(job._id!)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{job.jobTitle}</h2>
            <p className="text-lg text-gray-600">{job.companyName}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(job)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status and Priority */}
              <div className="flex flex-wrap gap-4">
                <Badge className={getStatusColor(job.status)}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </Badge>
                <Badge className={getPriorityColor(job.priority)}>
                  {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)} Priority
                </Badge>
                <Badge variant="outline">
                  {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}
                </Badge>
              </div>

              {/* Job Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Job Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap text-gray-700 max-h-64 overflow-y-auto">{job.jobDescription}</div>
                </CardContent>
              </Card>

              {/* Notes */}
              {job.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-wrap">{job.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Key Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Application Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Applied</p>
                      <p className="font-medium">{formatDate(job.applicationDate)}</p>
                    </div>
                  </div>

                  {job.deadline && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Deadline</p>
                        <p
                          className={`font-medium ${
                            getDaysUntilDeadline(job.deadline) <= 3 ? "text-red-600" : "text-gray-900"
                          }`}
                        >
                          {formatDate(job.deadline)}
                          <span className="text-sm text-gray-500 ml-2">
                            (
                            {getDaysUntilDeadline(job.deadline) > 0
                              ? `${getDaysUntilDeadline(job.deadline)} days left`
                              : "Passed"}
                            )
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">{job.location}</p>
                    </div>
                  </div>

                  {job.salary && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Salary</p>
                        <p className="font-medium text-green-600">{job.salary}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Info */}
              {(job.contactPerson || job.contactEmail) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {job.contactPerson && (
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Contact Person</p>
                          <p className="font-medium">{job.contactPerson}</p>
                        </div>
                      </div>
                    )}

                    {job.contactEmail && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <a href={`mailto:${job.contactEmail}`} className="font-medium text-blue-600 hover:underline">
                            {job.contactEmail}
                          </a>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {job.jobUrl && (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={job.jobUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Job Posting
                      </a>
                    </Button>
                  )}

                  {job.contactEmail && (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={`mailto:${job.contactEmail}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
