'use client'
import dynamic from 'next/dynamic'
import { Project } from '@/types'
// react-konvaを使用しているコンポーネントはdynamic importを利用する
const StageComponent = dynamic(() => import('./StageComponent'), {
  ssr: false
})

export default function Canvas({ project }: { project: Project }) {
  return (
    <StageComponent project={project} />
  )
}