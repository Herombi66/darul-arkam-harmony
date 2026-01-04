"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Application = {
  id: string;
  name: string;
  grade: string;
  date: string;
  status: "Admitted" | "Processing" | "Rejected";
};

export const columns: ColumnDef<Application>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "grade",
    header: "Grade",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      let variant: "default" | "secondary" | "destructive" = "secondary";
      if (status === "Admitted") {
        variant = "default";
      } else if (status === "Rejected") {
        variant = "destructive";
      }
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const application = row.original;
      const queryClient = useQueryClient();

      const mutation = useMutation({
        mutationFn: () => {
          return axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/admission/applications/${
              application.id
            }/accept`
          );
        },
        onSuccess: () => {
          toast.success("Application accepted and email sent");
          queryClient.invalidateQueries({ queryKey: ["applications"] });
        },
        onError: () => {
          toast.error("Failed to accept application");
        },
      });

      return (
        <Dialog>
          <Popover>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(application.id)}
                >
                  Copy application ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DialogTrigger asChild>
                  <DropdownMenuItem>View application</DropdownMenuItem>
                </DialogTrigger>
                <PopoverTrigger asChild>
                  <DropdownMenuItem>Schedule interview</DropdownMenuItem>
                </PopoverTrigger>
                <DropdownMenuItem onClick={() => mutation.mutate()}>
                  {mutation.isPending ? "Accepting..." : "Accept"}
                </DropdownMenuItem>
                <DropdownMenuItem>Reject</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" initialFocus />
            </PopoverContent>
          </Popover>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>
                Full details of the application.
              </DialogDescription>
            </DialogHeader>
            <div>
              <p>
                <strong>Name:</strong> {application.name}
              </p>
              <p>
                <strong>Grade:</strong> {application.grade}
              </p>
              <p>
                <strong>Date:</strong> {application.date}
              </p>
              <p>
                <strong>Status:</strong> {application.status}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      );
    },
  },
];