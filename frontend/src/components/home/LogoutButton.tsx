"use client"
import { redirect } from 'next/navigation'

export default function LogoutButton() {
  return(
    <button
      className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:border-slate-400 cursor-pointer"
      onClick={() => redirect('/api/auth/logout')}
    >
      ログアウト
    </button>
  )
}