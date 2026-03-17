"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { routes, customerCookieName } from "@/constants/routes";
import { customerFormSchema, type CustomerFormValues } from "@/schemas/customer.schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CustomerEntryForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema)
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Failed to save customer");
      }

      document.cookie = `${customerCookieName}=${payload.customer._id}; path=/; max-age=2592000; samesite=lax`;
      localStorage.setItem(customerCookieName, payload.customer._id);
      toast.success("Customer saved successfully");
      router.push(routes.products);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save customer");
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Start your order</CardTitle>
        <CardDescription>
          Enter your details once, and GearUp will keep your cart tied to your customer record.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" placeholder="Ava Thompson" {...register("fullName")} />
              {errors.fullName ? <p className="text-sm text-destructive">{errors.fullName.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="ava@example.com" {...register("email")} />
              {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="+1 555 0148" {...register("phone")} />
              {errors.phone ? <p className="text-sm text-destructive">{errors.phone.message}</p> : null}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" placeholder="742 Evergreen Terrace, Springfield" {...register("address")} />
              {errors.address ? <p className="text-sm text-destructive">{errors.address.message}</p> : null}
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Save and continue
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
