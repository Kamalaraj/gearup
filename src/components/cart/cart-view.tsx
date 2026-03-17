"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { routes } from "@/constants/routes";
import { DeleteConfirmationDialog } from "@/components/common/delete-confirmation-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

type CartItem = {
  itemId: string;
  name: string;
  quantity: number;
  priceAtTime: number;
  image: string;
  isDeleted?: boolean;
};

type CartRecord = {
  _id: string;
  items: CartItem[];
  totalAmount: number;
};

export function CartView({ cart }: { cart: CartRecord | null }) {
  const [currentCart, setCurrentCart] = useState(cart);
  const [pendingItemId, setPendingItemId] = useState<string | null>(null);
  const activeItems = useMemo(
    () => currentCart?.items.filter((item) => !item.isDeleted) ?? [],
    [currentCart],
  );

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!currentCart) return;

    try {
      setPendingItemId(itemId);
      const response = await fetch(`/api/carts/${currentCart._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Unable to update quantity");
      }

      setCurrentCart(payload.cart);
      toast.success("Quantity updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update quantity");
    } finally {
      setPendingItemId(null);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!currentCart) return;

    try {
      setPendingItemId(itemId);
      const response = await fetch(`/api/carts/${currentCart._id}/items/${itemId}`, {
        method: "DELETE"
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Unable to remove item");
      }

      setCurrentCart(payload.cart);
      toast.success("Item removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to remove item");
    } finally {
      setPendingItemId(null);
    }
  };

  if (!currentCart || !activeItems.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your cart is empty</CardTitle>
          <CardDescription>Add some products before heading to checkout.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href={routes.products}>Browse products</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.7fr_0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle>Cart items</CardTitle>
          <CardDescription>Update quantities or remove products from your active cart.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeItems.map((item) => (
                <TableRow key={item.itemId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-16 w-16 overflow-hidden rounded-xl border bg-muted">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Ready for checkout</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(item.priceAtTime)}</TableCell>
                  <TableCell>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={item.quantity}
                      onChange={(event) => updateQuantity(item.itemId, Number(event.target.value))}
                      className="h-10 w-20 rounded-lg border bg-white px-3"
                      disabled={pendingItemId === item.itemId}
                    />
                  </TableCell>
                  <TableCell>{formatCurrency(item.priceAtTime * item.quantity)}</TableCell>
                  <TableCell className="text-right">
                    <DeleteConfirmationDialog
                      trigger={
                        <Button variant="ghost" size="icon" disabled={pendingItemId === item.itemId}>
                          {pendingItemId === item.itemId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      }
                      title="Remove this item?"
                      description="This will soft remove the item from the active cart."
                      onConfirm={() => removeItem(item.itemId)}
                      isLoading={pendingItemId === item.itemId}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>Proceed once everything in the cart looks right.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>Items</span>
            <span>{activeItems.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm font-medium">
            <span>Subtotal</span>
            <span>{formatCurrency(currentCart.totalAmount)}</span>
          </div>
          <Button asChild className="w-full" disabled={!activeItems.length}>
            <Link href={`${routes.checkout}?cartId=${currentCart._id}`}>Checkout</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
