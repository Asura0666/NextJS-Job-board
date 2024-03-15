import { JobFilterValues } from "@/lib/validation";
import JobListItem from "./JobListItem";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface JobResultsProps {
  filterValues: JobFilterValues;
  page?: number;
}

export default async function JobResults({
  filterValues,
  page = 1,
}: JobResultsProps) {
  const { hybrid, q, type, location, remote, onsite } = filterValues;

  const jobPerPage = 5;
  const skip = (page - 1) * jobPerPage;

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
    const jobsPromise = prisma.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: jobPerPage,
      skip: skip,
    });

    const countPromise = prisma.job.count({ where });

    const [jobs, totalResults] = await Promise.all([jobsPromise, countPromise]);

    return (
      <div className="grow space-y-4">
        {jobs.map((job) => (
          <Link className="block" key={job.id} href={`/jobs/${job.slug}`}>
            <JobListItem job={job} />
          </Link>
        ))}
        {jobs.length === 0 && (
          <p className="m-auto text-center text-xl">
            No jobs found. Try adjusting your search filters
          </p>
        )}
        {jobs.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(totalResults / jobPerPage)}
            filterValues={filterValues}
          />
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

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  filterValues: JobFilterValues;
}

function Pagination({
  currentPage,
  totalPages,
  filterValues: { q, type, location, remote, hybrid, onsite },
}: PaginationProps) {
  function generatePageLink(page: number) {
    const searchParams = new URLSearchParams({
      ...(q && { q: q.trim() }),
      ...(type && { type }),
      ...(location && { location }),
      ...(remote && { remote: "true" }),
      ...(onsite && { onsite: "true" }),
      ...(hybrid && { hybrid: "true" }),
      page: page.toString(),
    });
    return `/?${searchParams.toString()}`;
  }

  return (
    <div className="flex justify-between items-center">
      <Link
        href={generatePageLink(currentPage - 1)}
        className={cn(
          "flex items-center gap-2 border px-3 hover:opacity-90 py-2 bg-slate-950 text-white rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          currentPage <= 1 && "invisible",
        )}
      >
        <ArrowLeft size={16} />
        Previous page
      </Link>
      <span className="font-semibold text-center" >Page {currentPage} of {totalPages}</span>
      <Link
        href={generatePageLink(currentPage + 1)}
        className={cn(
          "flex items-center gap-2 border px-3 hover:opacity-90 py-2 bg-slate-950 text-white rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          currentPage >= totalPages && "invisible",
        )}
      >
        Next page
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
