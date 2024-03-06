import { JobFilterValues } from "@/lib/validation";
import JobListItem from "./JobListItem";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface JobResultsProps {
  filterValues: JobFilterValues;
}

export default async function JobResults({
  filterValues: { hybrid, q, type, location, remote, onsite },
}: JobResultsProps) {
  const searchString = q
    ? q
        .split(" ")
        .filter((word) => word.length > 0)
        .join(" | ")
    : "";

  const searchFilter: Prisma.JobWhereInput = searchString
    ? {
        OR: [
          { title: { search: searchString } },
          { companyName: { search: searchString } },
          { type: { search: searchString } },
          { locationType: { search: searchString } },
          { location: { search: searchString } },
        ],
      }
    : {};

  const where: Prisma.JobWhereInput = {
    AND: [
      searchFilter,
      type ? { type } : {},
      location ? { location } : {},
      remote ? { locationType: "Remote" } : {},
      onsite ? { locationType: "On-site" } : {},
      hybrid ? { locationType: "Hybrid" } : {},
      { approved: true },
    ],
  };
  try {
    const jobs = await prisma.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return (
      <div className="grow space-y-4">
        {jobs.map((job) => (
          <JobListItem job={job} key={job.id} />
        ))}
        {jobs.length === 0 && (
          <p className="m-auto text-center text-xl">
            No jobs found. Try adjusting your search filters
          </p>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return (
      <p className="m-auto text-center text-xl">
        Error fetching jobs. Please try again later.
      </p>
    );
  }
}
