"use client";

import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminNavbar() {
  const { user, signOut } = useClerk();
  const router = useRouter();

  return (
    <div className="px-3 py-2">
      <div className="m-auto my-3 flex max-w-5xl items-center justify-between gap-2">
        <Link
          href="/admin"
          className="text-muted-foreground font-semibold hover:text-black"
        >
          Admin Dashboard
        </Link>
        <div className="space-x-6">
          <span className="text-muted-foreground font-semibold hover:text-black">
            {user?.username}
          </span>
         <Button className="hover:bg-red-600" onClick={async () => {
          await signOut()
          router.push('/')
         }}>Logout</Button>
        </div>
      </div>
    </div>
  );
}
