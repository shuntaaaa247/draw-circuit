import { cookies } from 'next/headers'
import { Project } from '@/types';
import ProjectList from '@/components/home/ProjectList';
import CreateProjectButton from '@/components/home/CreateProjectButton';

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
      cache: 'no-store',
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

export default async function Home() {
  const projects: Project[] = await getProjects();

  return ( 
    <div>
      <h1>Draw Circuit</h1>
      <CreateProjectButton />
      <ProjectList projects={projects} />
    </div>
  )
}