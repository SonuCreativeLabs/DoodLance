"use client"

import { Card } from "@/components/ui/card"

const mockJobs = [
  {
    id: 1,
    title: "Full Stack Developer Needed for E-commerce Platform",
    description: "Looking for an experienced full stack developer to help build a modern e-commerce platform. Must have experience with React, Node.js, and PostgreSQL.",
    budget: "$5,000 - $8,000",
    duration: "2-3 months",
    skills: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    postedAt: "2 hours ago",
    location: "Remote",
    proposals: 12
  },
  {
    id: 2,
    title: "Mobile App Developer for Health & Fitness App",
    description: "Need a skilled mobile developer to create a health and fitness tracking app. Experience with React Native and API integration required.",
    budget: "$3,000 - $5,000",
    duration: "1-2 months",
    skills: ["React Native", "iOS", "Android", "API Integration"],
    postedAt: "5 hours ago",
    location: "Remote",
    proposals: 8
  }
]

export default function FeedPage() {
  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-semibold">Job Feed</h1>
      <div className="space-y-4">
        {mockJobs.map(job => (
          <Card key={job.id} className="p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-medium">{job.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{job.postedAt} • {job.location}</p>
              </div>
              <p className="text-gray-600">{job.description}</p>
              <div className="flex flex-wrap gap-2">
                {job.skills.map(skill => (
                  <span key={skill} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-1">
                  <p className="font-medium">{job.budget}</p>
                  <p className="text-sm text-gray-500">{job.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{job.proposals} proposals</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 