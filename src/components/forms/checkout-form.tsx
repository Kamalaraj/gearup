"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { routes } from "@/constants/routes";
import { deliveryDetailsSchema } from "@/schemas/order.schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CheckoutFormValues = {
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
};

export function CheckoutForm({
  customerId,
  customerEmail,
  cartId,
  cartSummary
}: {
  customerId: string;
  customerEmail: string;
  cartId: string;
  cartSummary: React.ReactNode;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(deliveryDetailsSchema)
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          cartId,
          email: customerEmail,
          deliveryDetails: values
        })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Failed to place order");
      }

      toast.success("Order placed successfully");
      toast.success(payload.emailResult?.sent ? "Confirmation email sent" : payload.emailResult?.reason ?? "Email skipped");
      router.push(`${routes.orderSuccess}?orderId=${payload.order._id}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
      <Card>
        <CardHeader>
          <CardTitle>Delivery details</CardTitle>
          <CardDescription>We’ll use this information to deliver your order.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient name</Label>
              <Input id="recipientName" {...register("recipientName")} />
              {errors.recipientName ? <p className="text-sm text-destructive">{errors.recipientName.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} />
              {errors.phone ? <p className="text-sm text-destructive">{errors.phone.message}</p> : null}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="addressLine1">Address line 1</Label>
              <Input id="addressLine1" {...register("addressLine1")} />
              {errors.addressLine1 ? <p className="text-sm text-destructive">{errors.addressLine1.message}</p> : null}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="addressLine2">Address line 2</Label>
              <Input id="addressLine2" {...register("addressLine2")} />
              {errors.addressLine2 ? <p className="text-sm text-destructive">{errors.addressLine2.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} />
              {errors.city ? <p className="text-sm text-destructive">{errors.city.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal code</Label>
              <Input id="postalCode" {...register("postalCode")} />
              {errors.postalCode ? <p className="text-sm text-destructive">{errors.postalCode.message}</p> : null}
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Place order
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {cartSummary}
    </div>
  );
}
