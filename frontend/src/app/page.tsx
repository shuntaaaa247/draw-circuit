import { Project } from '@/types';
import ProjectList from '@/components/home/ProjectList';

async function getProjects(): Promise<Project[]> {
  try {
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:4000';
    // const apiBaseUrl = 'http://backend:4000';
    console.log('API Base URL:', apiBaseUrl);
    
    const response = await fetch(`${apiBaseUrl}/api/v1/projects`, {
      headers: {
        'Authorization': "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3NTYxMTA4OTd9.armj_UqA-XNCudvmwxnHlsxeV76uUIiXtCydUOQPTqc"
      }
    })
    
    if (!response.ok) {
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
  console.log('Projects:', projects);
  
  return (
    <div>
      <h1>Hello World</h1>
      <ProjectList projects={projects} />
    </div>
  )
}