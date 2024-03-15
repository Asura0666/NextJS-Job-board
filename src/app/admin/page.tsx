import JobListItem from "@/components/JobListItem";
import H1 from "@/components/ui/h1";
import prisma from "@/lib/prisma";
import Link from "next/link";


export default async function AdminPage() {

  const unapprovedJobs = await prisma.job.findMany({
    where: {approved: false}
  })

  return <main className="m-auto my-10 max-w-5xl px-3 space-y-10">
    <H1 className="text-center">Admin Dashboard</H1>
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-bold">Unapproved Jobs: </h2>
      {
        unapprovedJobs.map(job => (
          <Link className="block" key={job.id} href={`/admin/jobs/${job.slug}`}>
          <JobListItem job={job} />
        </Link>
        ))
      }
      {
        unapprovedJobs.length === 0 && (
          <p className="text-muted-foreground">No Unapproved Jobs</p>
        )
      }
    </section>
  </main>
}