import { Project } from "@/types"
import { cookies } from 'next/headers'
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
  const projects = await getProjects();
  return (
    <ul>
      {projects && projects.length > 0 ? (
        projects.map((project: Project) => (
          <ProjectListItem key={project.id} project={project} />
        ))
      ) : (
        <p>プロジェクトが見つかりません</p>
      )}
    </ul>
  )
}

export const ProjectListSkeleton = () => {
  return (
    <ul>
      <li className="p-4 bg-gray-50 hover:bg-gray-100 animate-pulse mx-16 my-1 rounded-md border-1 cursor-pointer flex flex-col">
        <div className="w-full h-5 my-1 bg-gray-200 rounded-sm animate-pulse"></div>
        <div className="w-full h-4 mb-1 bg-gray-200 rounded-sm animate-pulse"></div>
      </li>
      <li className="p-4 bg-gray-50 hover:bg-gray-100 mx-16 my-1 rounded-md border-1 cursor-pointer flex flex-col">
        <div className="w-full h-5 my-1 bg-gray-200 rounded-sm animate-pulse"></div>
        <div className="w-full h-4 mb-1 bg-gray-200 rounded-sm animate-pulse"></div>
      </li>
      <li className="p-4 bg-gray-50 hover:bg-gray-100 mx-16 my-1 rounded-md border-1 cursor-pointer flex flex-col">
        <div className="w-full h-5 my-1 bg-gray-200 rounded-sm animate-pulse"></div>
        <div className="w-full h-4 mb-1 bg-gray-200 rounded-sm animate-pulse"></div>
      </li>
    </ul>
  )
}