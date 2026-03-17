"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { DeleteConfirmationDialog } from "@/components/common/delete-confirmation-dialog";
import { Button } from "@/components/ui/button";

export function ProductActions({ productId }: { productId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE"
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Failed to delete product");
      }

      toast.success("Product deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button asChild variant="outline" className="w-full">
        <Link href={`/products/${productId}`}>Edit product</Link>
      </Button>
      <DeleteConfirmationDialog
        trigger={
          <Button type="button" variant="destructive" className="w-full" disabled={isDeleting}>
            Delete
          </Button>
        }
        title="Delete this product?"
        description="This will soft delete the product and remove it from the visible catalog."
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
