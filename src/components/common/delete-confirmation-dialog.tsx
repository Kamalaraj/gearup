"use client";

import { Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogActionButton,
  AlertDialogCancelButton,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

export function DeleteConfirmationDialog({
  trigger,
  title,
  description,
  onConfirm,
  isLoading
}: {
  trigger: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancelButton>Cancel</AlertDialogCancelButton>
          <AlertDialogActionButton onClick={onConfirm} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Confirm
          </AlertDialogActionButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
