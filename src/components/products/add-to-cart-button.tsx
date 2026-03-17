"use client";

import { useState } from "react";
import { Loader2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function AddToCartButton({
  customerId,
  productId,
  stockQuantity
}: {
  customerId: string;
  productId: string;
  stockQuantity: number;
}) {
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addToCart = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/carts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, productId, quantity })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Unable to add item to cart");
      }

      toast.success("Product added to cart");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add item to cart");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="inline-flex items-center gap-2 rounded-full border bg-muted/60 p-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          disabled={quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center text-sm font-medium">{quantity}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setQuantity((current) => Math.min(stockQuantity, current + 1))}
          disabled={quantity >= stockQuantity}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button type="button" className="w-full" onClick={addToCart} disabled={!stockQuantity || isSubmitting}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Add to cart
      </Button>
    </div>
  );
}
