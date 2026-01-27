"use client"
import { logout } from "@/libs/auth/logout"

export default function LogoutButton() {
  return(
    <button 
      className='ml-3 p-2 rounded-md border border-slate-200 hover:bg-slate-200'
      onClick={logout}
    >ログアウト</button>
  )
}