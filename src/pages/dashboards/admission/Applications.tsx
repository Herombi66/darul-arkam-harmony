"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { columns } from "@/components/applications/columns";
import { DataTable } from "@/components/applications/data-table";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Skeleton } from "@/components/ui/skeleton";

async function getData(): Promise<any[]> {
  const { data } = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/admission/applications`
  );
  return data;
}

export default function AdmissionApplications() {
  const { data, isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: getData,
  });

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="admission" />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-primary mb-6">Applications</h1>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <DataTable columns={columns} data={data || []} />
        )}
      </main>
    </div>
  );
}