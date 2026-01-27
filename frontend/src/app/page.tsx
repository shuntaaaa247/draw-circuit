import { cookies } from 'next/headers'
import { Suspense } from 'react';
import Link from 'next/link';
import { ProjectList, ProjectListSkeleton } from '@/components/home/ProjectList';
import CreateProjectButton from '@/components/home/CreateProjectButton';
import LoginButton from '@/components/home/LoginButton';
import LogoutButton from '@/components/home/LogoutButton';

export const dynamic = 'force-dynamic' // Dynamic Rendering(従来のSSRに相当)になる(fetchのno-storeでもDynamic Renderingになるが、ここでより明示的にしている)

export default async function Home() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  return ( 
    <div>
      <h1>Draw Circuit</h1>
      <div>
        { process.env.SERVER_IS_READY !== "false" && <CreateProjectButton /> }
        { token ? <LogoutButton /> : process.env.SERVER_IS_READY !== "false" && <LoginButton />}
      </div>
      {/* <ProjectList projects={projects} /> */}
      { token ?
        <Suspense fallback={<ProjectListSkeleton />}>
          <ProjectList />
        </Suspense>
      : 
      <div>
        <p className='mt-5 mb-3'>ログインすると、描いた回路を保存することができます。</p>
        { process.env.SERVER_IS_READY === "false" && <h1 className='font-bold my-5'>現在、ログイン機能をはじめとするサーバー側の機能は準備中です。<br/>ログインしていなくても回路のお絵描き自体は可能です(保存はできません)</h1>}
        <Link href={"/canvas/1"} className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'>ログインしないで回路を描く</Link>
      </div>}
    </div>
  )
}