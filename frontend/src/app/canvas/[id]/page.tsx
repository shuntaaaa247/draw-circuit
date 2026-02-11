import Canvas from '@/components/canvas'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Project } from '@/types'

const getProject = async (id: string) => {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  let shouldRedirect = false;
  let returnValue: Project | null = null;

  if (!token) {
    redirect('/')
  }

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/v1/projects/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) {
      if (response.status === 401) {
        shouldRedirect = true;
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } else {
      returnValue = await response.json();
    }
  } catch (error) {
    console.error('Error fetching circuit elements:', error)
  }

  if (shouldRedirect) {
    redirect('/api/auth/logout');
  }
  return returnValue;
}

export default async function CanvasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id)

  // projectがnullの場合は、現状以下のようにしている(要検討)
  if (!project) {
    console.error('Project not found');
    redirect('/');
  }

  return (
    <Canvas project={project} />
  )
}