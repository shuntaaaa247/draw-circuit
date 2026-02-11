import Link from "next/link";

export default function LogoutButton() {
  return(
    <Link
      href="/login"
      className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:border-slate-400"
    >
      ログイン
    </Link>
  )
}