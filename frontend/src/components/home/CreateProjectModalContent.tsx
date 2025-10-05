"use client"
import { SubmitHandler, useForm } from "react-hook-form"
import ClearIcon from '@mui/icons-material/Clear';
import { NewProjectInput } from "@/types"
import { useState } from "react"
import { useRouter } from "next/navigation"

type CreateProjectModalContentProps = {
  handleCloseModal: () => void
}

const sendCreateProjectRequest = async (data: NewProjectInput): Promise<boolean> => {
  try {
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:4000';
    const response = await fetch(`${apiBaseUrl}/api/v1/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project: {
          name: data.name,
          description: data.description
        }
      }),
      credentials: 'include',
    })
    if (!response.ok) {
      // throw new Error("Failed to create project")
      console.error("Failed to create project", response.statusText)
      return false
    }
    return true
  } catch (error) {
    console.error("Failed to create project", error)
    return false
  }
}

export default function CreateProjectModal({ handleCloseModal }: CreateProjectModalContentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { register, handleSubmit } = useForm<NewProjectInput>()
  const onSubmit: SubmitHandler<NewProjectInput> = async (data) => {
    console.log(data)
    setIsLoading(true)
    const isSuccess = await sendCreateProjectRequest(data)
    if (isSuccess) {
      handleCloseModal()
    }
    // handleCloseModal()
    setIsLoading(false)
    router.refresh()
  }
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-10 flex justify-center items-center" onClick={handleCloseModal}>
      <div className="bg-white w-1/2 p-8 pt- rounded-lg flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
        <span className="text-2xl text-left hover:bg-gray-100 rounded-md w-8 h-8 flex items-center justify-center cursor-pointer" onClick={handleCloseModal}><ClearIcon /></span>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">新規プロジェクト作成</h1>
          <input type="text" placeholder="ex. RLC直列回路" {...register("name", { required: true })} className="border border-gray-300 rounded-md p-2" />
          <input type="text" placeholder="ex. 抵抗とコイルとコンデンサを直列に接続した回路を作成" {...register("description")} className="border border-gray-300 rounded-md p-2" />
          <button type="submit" className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 cursor-pointer">Create Project</button>
        </form>
      </div>
    </div>
  )
}