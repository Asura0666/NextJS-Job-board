import { jobTypes, locationTypes } from "@/lib/job-types";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Select from "./ui/select";
import prisma from "@/lib/prisma";
import { Button } from "./ui/button";
import { JobFilterValues, jobFilterSchema } from "@/lib/validation";
import { redirect } from "next/navigation";

async function filterJobs(formData: FormData) {
  "use server";

  console.log(formData);

  const values = Object.fromEntries(formData.entries());

  const { q, location, type, remote, onsite, hybrid } =
    jobFilterSchema.parse(values);

  const searchParams = new URLSearchParams({
    ...(q && { q: q.trim() }),
    ...(type && { type }),
    ...(location && { location }),
    ...(remote && { remote: "true" }),
    ...(onsite && { onsite: "true" }),
    ...(hybrid && { hybrid: "true" }),
  });

  redirect(`/?${searchParams.toString()}`);
}

interface JobFilterSidebarProps {
  defaultValues: JobFilterValues;
}

export default async function JobFilterSidebar({
  defaultValues,
}: JobFilterSidebarProps) {
  const distinctLocations = (await prisma.job
    .findMany({
      where: { approved: true },
      select: { location: true },
      distinct: ["location"],
    })
    .then((location) =>
      location.map(({ location }) => location).filter(Boolean),
    )) as string[];

  return (
    <aside className="sticky top-0 h-fit rounded-lg border bg-background p-4 md:w-[260px]">
      <form method="POST" action={filterJobs}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="q">Search</Label>
            <Input defaultValue={defaultValues.q} id="q" name="q" placeholder="Title, Company, etc." />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Types</Label>
            <Select id="type" name="type" defaultValue={defaultValues.type || ''}>
              <option value="">All Types</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Search</Label>
            <Select id="location" name="location" defaultValue={defaultValues.location || ''}>
              <option value="">All location</option>
              {distinctLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex w-full flex-row space-y-2 md:flex-col lg:flex-row lg:items-center lg:space-y-0">
            <div className="flex grow items-center gap-1.5">
              <input
                id="remote"
                name="remote"
                type="checkbox"
                className="scale-100 accent-black"
                defaultChecked={defaultValues.remote}
              />
              <Label htmlFor="remote">Remote</Label>
            </div>
            <div className="flex grow items-center gap-1.5">
              <input
                id="onsite"
                name="onsite"
                type="checkbox"
                className="scale-100 accent-black"
                defaultChecked={defaultValues.onsite}
              />
              <Label htmlFor="onsite">On-site</Label>
            </div>
            <div className="flex grow items-center gap-1.5">
              <input
                id="hybrid"
                name="hybrid"
                type="checkbox"
                className="scale-100 accent-black"
                defaultChecked={defaultValues.hybrid}
              />
              <Label htmlFor="hybrid">Hybrid</Label>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Filter Jobs
          </Button>
        </div>
      </form>
    </aside>
  );
}
