import Link from "next/link";

export default function LogoutButton() {
  return(
    <Link href={"/login"} className='ml-3 p-2 rounded-md border border-slate-200 hover:bg-slate-200'>
      ログイン
    </Link>
  )
}