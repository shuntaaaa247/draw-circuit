import Canvas from '@/components/canvas'
// 'use client'
// import dynamic from 'next/dynamic'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// // react-konvaを使用しているコンポーネントはdynamic importを利用する
// const StageComponent = dynamic(() => import('../../../components/canvas/StageComponent'), {
//   ssr: false
// })

// export default function Canvas() {
//   return (
//     <StageComponent />
//   )
// }
const getProject = async (id: string) => {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return redirect('/')
  }

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/v1/projects/${id}`, {
      // headers: {
      //   'Authorization': "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3NTYxMTA4OTd9.armj_UqA-XNCudvmwxnHlsxeV76uUIiXtCydUOQPTqc"
      // }
      // credentials: 'include'
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) {
      if (response.status === 401) {
        return redirect('/')
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching circuit elements:', error)
    return redirect('/')
  }
}

export default async function CanvasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id)

  console.log(project)
  return (
    <Canvas project={project} />
  )
}