"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { customerCookieName, routes } from "@/constants/routes";
import { signupSchema, type SignupValues } from "@/schemas/customer.schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function SignupForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Failed to sign up");
      }

      document.cookie = `${customerCookieName}=${payload.customer._id}; path=/; max-age=2592000; samesite=lax`;
      toast.success("Account created successfully");
      router.push(routes.products);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to sign up");
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>Create your GearUp account and start ordering products.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5 sm:grid-cols-2" onSubmit={onSubmit}>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" {...register("fullName")} />
            {errors.fullName ? <p className="text-sm text-destructive">{errors.fullName.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register("phone")} />
            {errors.phone ? <p className="text-sm text-destructive">{errors.phone.message}</p> : null}
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" {...register("address")} />
            {errors.address ? <p className="text-sm text-destructive">{errors.address.message}</p> : null}
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password ? <p className="text-sm text-destructive">{errors.password.message}</p> : null}
          </div>
          <div className="sm:col-span-2 space-y-3">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Create account
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href={routes.login} className="font-medium text-accent">
                Login
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
