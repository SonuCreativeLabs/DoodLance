"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type ProposalStatus = "Pending" | "Accepted" | "Rejected"

interface Proposal {
  id: number
  jobTitle: string
  status: ProposalStatus
  submittedAt: string
  proposedRate: string
  coverLetter: string
  clientName: string
  clientLocation: string
}

const mockProposals: Proposal[] = [
  {
    id: 1,
    jobTitle: "Full Stack Developer Needed for E-commerce Platform",
    status: "Pending",
    submittedAt: "2 days ago",
    proposedRate: "$45/hr",
    coverLetter: "I have extensive experience in building e-commerce platforms using React and Node.js...",
    clientName: "Tech Solutions Inc.",
    clientLocation: "United States"
  },
  {
    id: 2,
    jobTitle: "React Native Developer for Social Media App",
    status: "Accepted",
    submittedAt: "1 week ago",
    proposedRate: "$50/hr",
    coverLetter: "As a React Native developer with 4 years of experience...",
    clientName: "Social Connect Ltd.",
    clientLocation: "Canada"
  },
  {
    id: 3,
    jobTitle: "Backend Developer for API Development",
    status: "Rejected",
    submittedAt: "2 weeks ago",
    proposedRate: "$40/hr",
    coverLetter: "I specialize in building scalable APIs using Node.js and Express...",
    clientName: "Data Systems Corp",
    clientLocation: "Germany"
  }
]

const statusColors: Record<ProposalStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Accepted: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800"
}

export default function ProposalsPage() {
  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-semibold">My Proposals</h1>
      <div className="space-y-4">
        {mockProposals.map(proposal => (
          <Card key={proposal.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-medium">{proposal.jobTitle}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {proposal.clientName} • {proposal.clientLocation}
                  </p>
                </div>
                <Badge variant="outline" className={statusColors[proposal.status]}>
                  {proposal.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600 line-clamp-2">{proposal.coverLetter}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Proposed Rate: {proposal.proposedRate}</span>
                  <span>Submitted {proposal.submittedAt}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 