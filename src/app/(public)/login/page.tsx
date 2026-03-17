import { PageShell } from "@/components/common/page-shell";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <PageShell
      title="Login to GearUp"
      description="Access your saved customer account, active cart, and order history."
    >
      <LoginForm />
    </PageShell>
  );
}
