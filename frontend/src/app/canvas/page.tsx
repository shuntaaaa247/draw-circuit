// 非ログイン中(tokenがない)でも回路を描くためのページ
import Canvas from '@/components/canvas'

export default async function CanvasPage() {
  const project = {
    id: -1,
    name: "no-login",
    description: "非ログインでの操作",
    circuit_elements: []
  }
    return(<Canvas project={project} />)
}