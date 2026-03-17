"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { routes } from "@/constants/routes";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/auth/logout", {
        method: "POST"
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Failed to logout");
      }

      document.cookie = "gearup_customer_id=; path=/; max-age=0; samesite=lax";
      localStorage.removeItem("gearup_customer_id");
      toast.success("Logged out successfully");
      router.push(routes.home);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to logout");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button type="button" variant="outline" onClick={handleLogout} disabled={isSubmitting}>
      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      Logout
    </Button>
  );
}
