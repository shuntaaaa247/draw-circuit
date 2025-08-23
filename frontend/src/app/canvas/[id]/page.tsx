import Canvas from '@/components/canvas'
// 'use client'
// import dynamic from 'next/dynamic'

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
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/v1/projects/${id}`, {
      headers: {
        'Authorization': "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3NTYwMDg2OTR9.rLf_l9oKs_cUZUkhHP0spq2d1nhWZBFp1LktCT--9P8"
      }
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching circuit elements:', error)
    return []
  }
}

export default async function CanvasPage({ params }: { params: { id: string } }) {
  const { id } = params
  const project = await getProject(id)
  console.log(project)
  return (
    <Canvas project={project} />
  )
}