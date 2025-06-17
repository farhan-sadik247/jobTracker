import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, Clock, CheckCircle, XCircle, TrendingUp, Calendar } from 'lucide-react'
import { JobApplication } from "../lib/types"


// Add this function directly in this file
function getDaysUntilDeadline(deadline: Date | string) {
  const today = new Date()
  const deadlineDate = new Date(deadline)
  const diffTime = deadlineDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

interface StatsCardsProps {
  jobs: JobApplication[]
}

export default function StatsCards({ jobs }: StatsCardsProps) {
  const totalApplications = jobs.length
  const pendingApplications = jobs.filter((job) => job.status === "applied").length
  const interviews = jobs.filter((job) => job.status === "interview").length
  const offers = jobs.filter((job) => job.status === "offer").length
  const rejections = jobs.filter((job) => job.status === "rejected").length

  const upcomingDeadlines = jobs.filter(
    (job) => job.deadline && getDaysUntilDeadline(job.deadline) <= 7 && getDaysUntilDeadline(job.deadline) > 0,
  ).length

  const stats = [
    {
      title: "Total Applications",
      value: totalApplications,
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Pending",
      value: pendingApplications,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Interviews",
      value: interviews,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Offers",
      value: offers,
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Rejections",
      value: rejections,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Deadlines (7 days)",
      value: upcomingDeadlines,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
