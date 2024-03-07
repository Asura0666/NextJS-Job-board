import JobFilterSidebar from "@/components/JobFilterSidebar";
import JobResults from "@/components/JobResults";
import H1 from "@/components/ui/h1";
import { JobFilterValues } from "@/lib/validation";
import { Metadata } from "next";

interface PageProps {
  searchParams: {
    q?: string;
    type?: string;
    location?: string;
    remote?: string;
    onsite?: string;
    hybrid?: string;
  };
}

function getTitle({
  q,
  type,
  location,
  remote,
  onsite,
  hybrid,
}: JobFilterValues) {
  const titlePrefix = q
    ? `${q} jobs`
    : type
      ? `${type} developer jobs`
      : remote
        ? "Remote developer jobs"
        : onsite
          ? "On-site developer jobs"
          : hybrid
            ? "Hybrid developers jobs"
            : "All developers jobs";

  const titleSuffix = location ? ` in ${location}` : "";

  return `${titlePrefix}${titleSuffix}`;
}

export function generateMetadata({
  searchParams: { q, type, location, remote, onsite, hybrid },
}: PageProps): Metadata {
  return {
    title: `${getTitle({
      q,
      type,
      location,
      remote: remote === "true",
      onsite: onsite === "true",
      hybrid: hybrid === "true",
    })} | Flow Jobs`,
  };
}

export default async function Home({
  searchParams: { q, type, location, remote, onsite, hybrid },
}: PageProps) {
  const filterValues: JobFilterValues = {
    q,
    type,
    location,
    remote: remote === "true",
    onsite: onsite === "true",
    hybrid: hybrid === "true",
  };

  return (
    <main className="m-auto my-10 max-w-5xl space-y-10 px-3">
      <div className="space-y-5 text-center">
        <H1>{getTitle(filterValues)}</H1>
        <p className="text-muted-foreground">Find Your Dream Job</p>
      </div>
      <section className="flex flex-col gap-4 md:flex-row">
        <JobFilterSidebar defaultValues={filterValues} />
        <JobResults filterValues={filterValues} />
      </section>
    </main>
  );
}
