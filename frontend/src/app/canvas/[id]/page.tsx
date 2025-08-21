'use client'
import dynamic from 'next/dynamic'

// react-konvaを使用しているコンポーネントはdynamic importを利用する
const StageComponent = dynamic(() => import('../../../components/canvas/StageComponent'), {
  ssr: false
})

export default function Canvas() {
  return (
    <StageComponent />
  )
}