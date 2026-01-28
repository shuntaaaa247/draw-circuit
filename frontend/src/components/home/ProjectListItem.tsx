"use client"
import { Project } from '@/types'
import { useRouter } from 'next/navigation'
export const ProjectListItem = ({ project }: { project: Project }) => {
  const router = useRouter()
  return (
    <li
      key={project.id}
      className="flex cursor-pointer flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md active:scale-[0.995]"
      onClick={() => router.push(`/canvas/${project.id}`)}
    >
      <h2 className="text-lg font-semibold text-slate-800">{project.name}</h2>
      <p className="mt-1 text-sm text-slate-600">{project.description}</p>
    </li>
  )
}