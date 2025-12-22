import { cookies } from 'next/headers'
import { Project } from '@/types';
import { ProjectList, ProjectListSkeleton } from '@/components/home/ProjectList';
import CreateProjectButton from '@/components/home/CreateProjectButton';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic' // Dynamic Rendering(従来のSSRに相当)になる(fetchのno-storeでもDynamic Renderingになるが、ここでより明示的にしている)

export default async function Home() {
  return ( 
    <div>
      <h1>Draw Circuit</h1>
      <CreateProjectButton />
      {/* <ProjectList projects={projects} /> */}
      <Suspense fallback={<ProjectListSkeleton />}>
        <ProjectList />
      </Suspense>
    </div>
  )
}