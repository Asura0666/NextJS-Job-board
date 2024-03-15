import JobPage from "@/components/JobPage";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import AdminSidebar from "./AdminSidebar";

interface PageProps {
  params: { slug: string };
}

const getJob = cache(async (slug: string) => {
  const job = await prisma.job.findUnique({
    where: { slug },
  });

  if (!job) notFound();

  return job;
});

// export async function generateStaticParams() {
//   const jobs = await prisma.job.findMany({
//     select: {slug: true}
//   })

//   return jobs.map(({slug}) => slug)
// }

export async function generateMetadata({
  params: { slug },
}: PageProps): Promise<Metadata> {
  const job = await getJob(slug);

  return {
    title: job.title,
  };
}

export default async function Page({ params: { slug } }: PageProps) {
  const job = await getJob(slug);

  return (
    <main className="m-auto my-10 flex max-w-5xl flex-col gap-3 px-3 md:flex-row md:items-center">
      <JobPage job={job} />
      <AdminSidebar job={job} />
    </main>
  );
}
