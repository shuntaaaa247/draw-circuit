"use client"


import { Project } from "@/types"
import { useRouter } from "next/navigation"

export default function ProjectList({ projects }: { projects: Project[] }) {
  const router = useRouter()
  return (
    <>
      {projects && projects.length > 0 ? (
        projects.map((project: Project) => (
          <div key={project.id} className="p-4 hover:bg-gray-100 rounded-md cursor-pointer" onClick={() => router.push(`/canvas/${project.id}`)}>
            <h2>{project.name}</h2>
            <p>{project.description}</p>
          </div>
        ))
      ) : (
        <p>プロジェクトが見つかりません</p>
      )}
    </>
  )
}