"use client"
import { Project } from '@/types'
import { useRouter } from 'next/navigation'
export const ProjectListItem = ({ project }: { project: Project }) => {
  const router = useRouter()
  return (
    <li key={project.id} className="p-4 bg-gray-50 hover:bg-gray-100 mx-16 my-1 rounded-md border-1 cursor-pointer flex flex-col" onClick={() => router.push(`/canvas/${project.id}`)}>
      <h2 className="text-lg font-bold">{project.name}</h2>
      <p className="text-sm text-gray-700">{project.description}</p>
    </li>
  )
}