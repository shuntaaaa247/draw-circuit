"use client"
import { SubmitHandler, useForm } from "react-hook-form"
import ClearIcon from '@mui/icons-material/Clear';
import { NewProjectInput } from "@/types"
import { useState } from "react"
import { useRouter, redirect } from "next/navigation"

type CreateProjectModalContentProps = {
  handleCloseModal: () => void
}

const sendCreateProjectRequest = async (data: NewProjectInput): Promise<{ isSuccess: boolean, rawApiErrorMessage: string | null }> => {
  let shouldRedirect = false;
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
      if (response.status === 401) {
        // 今後この場でログインできるようにしたい(入力データが失われないような方法を要検討)
        alert("セッションが切れました。再度ログインしてください。");
        shouldRedirect = true;
      } else {
        return { isSuccess: false, rawApiErrorMessage: response.statusText}
      }
    }
  } catch (error) {
    // console.error("Failed to create project", error)
    return { isSuccess: false, rawApiErrorMessage: "プロジェクトの作成に失敗しました" }
  }
  
  if (shouldRedirect) {
    redirect("/api/auth/logout");
  }
  return { isSuccess: true, rawApiErrorMessage: null }
}

export default function CreateProjectModal({ handleCloseModal }: CreateProjectModalContentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [apiErrorMessage, setApiErrorMessage] = useState("")
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<NewProjectInput>()
  const onSubmit: SubmitHandler<NewProjectInput> = async (data) => {
    console.log(data)
    setIsLoading(true)
    const { isSuccess, rawApiErrorMessage  } = await sendCreateProjectRequest(data)
    if (isSuccess) {
      handleCloseModal()
    } else {
      setApiErrorMessage(rawApiErrorMessage || "プロジェクトの作成に失敗しました")
    }
    // handleCloseModal()
    setIsLoading(false)
    router.refresh()
  }
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex justify-center items-center" onClick={handleCloseModal}>
      <div className="bg-white w-1/2 p-8 rounded-lg flex flex-col" onClick={(e) => e.stopPropagation()}>
        <span className="text-2xl text-left hover:bg-gray-100 rounded-md w-8 h-8 flex items-center justify-center cursor-pointer" onClick={handleCloseModal}><ClearIcon /></span>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <h1 className="text-2xl font-bold mb-4">新規プロジェクト作成</h1>
          <div className="mb-4 flex flex-col w-full">
            <input type="text" placeholder="ex. RLC直列回路" {...register("name", { required: "必須", maxLength: { value: 100, message: "100文字以内" } })} className="border border-gray-300 rounded-md p-2 mb-0" />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>
          <div className="mb-4 flex flex-col w-full">
            <input type="text" placeholder="ex. 抵抗とコイルとコンデンサを直列に接続した回路を作成" {...register("description")} className="border border-gray-300 rounded-md p-2 mb-0" />
          </div>
          <button type="submit" className={`bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 cursor-pointer ${isLoading ? "opacity-50 disabled" : ""}`} disabled={isLoading}>
            {isLoading ? "Loading..." : "Create Project"}
          </button>
          {apiErrorMessage && <p className="text-red-500">{apiErrorMessage}</p>}
        </form>
      </div>
    </div>
  )
}