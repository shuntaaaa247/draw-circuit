"use client"


import { Project } from "@/types"
import { useRouter } from "next/navigation"

export default function ProjectList({ projects }: { projects: Project[] }) {
  const router = useRouter()
  return (
    <ul>
      {projects && projects.length > 0 ? (
        projects.map((project: Project) => (
          <li key={project.id} className="p-4 bg-gray-50 hover:bg-gray-100 mx-16 my-1 rounded-md border-1 cursor-pointer" onClick={() => router.push(`/canvas/${project.id}`)}>
            <h2 className="text-lg font-bold">{project.name}</h2>
            <p className="text-sm text-gray-700">{project.description}</p>
          </li>
        ))
      ) : (
        <p>プロジェクトが見つかりません</p>
      )}
    </ul>
  )
}