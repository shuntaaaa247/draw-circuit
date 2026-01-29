import { cookies } from 'next/headers'
import { Suspense } from 'react';
import Link from 'next/link';
import { ProjectList, ProjectListSkeleton } from '@/components/home/index';
import CreateProjectButton from '@/components/home/CreateProjectButton';
import LoginButton from '@/components/home/LoginButton';
import LogoutButton from '@/components/home/LogoutButton';

export const dynamic = 'force-dynamic' // Dynamic Rendering(従来のSSRに相当)になる(fetchのno-storeでもDynamic Renderingになるが、ここでより明示的にしている)

export default async function Home() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  return ( 
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/80">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <h1 className="text-xl font-bold tracking-tight text-slate-800 sm:text-2xl cursor-pointer">
            <Link href="/">
              Draw Circuit
            </Link>
          </h1>
          <div className="flex items-center gap-2">
            { process.env.SERVER_IS_READY !== "false" && token ? <CreateProjectButton /> : null }
            { token ? <LogoutButton /> : process.env.SERVER_IS_READY !== "false" ? <LoginButton /> : null }
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* サーバー準備中バナー */}
        { process.env.SERVER_IS_READY === "false" && (
          <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-amber-900">
            <p className="text-sm font-medium leading-relaxed">
              現在、ログイン機能をはじめとするサーバー側の機能は準備中です。<br />
              ログインしていなくても回路を描くこと自体は可能です。（保存はできません。）
            </p>
          </div>
        )}

        { token ? (
          <Suspense fallback={<ProjectListSkeleton />}>
            <ProjectList />
          </Suspense>
        ) : (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <p className="mb-6 text-slate-600 leading-relaxed">
              ログインすると、描いた回路を保存することができます。
            </p>
            <Link
              href="/canvas"
              className="inline-flex items-center justify-center rounded-xl bg-slate-800 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700 active:scale-[0.98]"
            >
              ログインしないで回路を描く
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}