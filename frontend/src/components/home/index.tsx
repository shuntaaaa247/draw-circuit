import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Project } from "@/types"
import { ProjectListItem } from './ProjectListItem'


async function getProjects(): Promise<Project[]> {
  try {
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:4000';
    console.log('API Base URL:', apiBaseUrl);

    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    console.log('Token:', token);

    const response = await fetch(`${apiBaseUrl}/api/v1/projects`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-store', // Dynamic Rendering(従来のSSRに相当)になる
      // cache: 'force-cache', // Static Rendering(SSGに相当)になる
      // credentials: 'include'
    })
    
    if (!response.ok) {
      const resJson = await response.json();
      console.log('Response JSON:', resJson);
      if (response.status === 401) {
        return redirect('/');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    console.log('Response:', response);
    const resJson = await response.json();
    console.log('ResJSON:', resJson);
    return resJson;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

// export default async function ProjectList() {
export const ProjectList = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) {
    return redirect('/');
  }
  const projects = await getProjects();
  return (
    <ul className="space-y-3">
      {projects && projects.length > 0 ? (
        projects.map((project: Project) => (
          <ProjectListItem key={project.id} project={project} />
        ))
      ) : (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center text-slate-500 shadow-sm">
          プロジェクトが見つかりません
        </div>
      )}
    </ul>
  )
}

export const ProjectListSkeleton = () => {
  return (
    <ul className="space-y-3">
      {[1, 2, 3].map((i) => (
        <li
          key={i}
          className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
        >
          <div className="mb-2 h-5 w-2/3 rounded bg-slate-200 animate-pulse" />
          <div className="h-4 w-1/2 rounded bg-slate-100 animate-pulse" />
        </li>
      ))}
    </ul>
  )
}