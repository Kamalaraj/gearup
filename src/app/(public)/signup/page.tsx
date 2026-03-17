import { PageShell } from "@/components/common/page-shell";
import { SignupForm } from "@/components/forms/signup-form";

export default function SignupPage() {
  return (
    <PageShell
      title="Create your GearUp account"
      description="Sign up with your customer details once and use the same account for future orders."
    >
      <SignupForm />
    </PageShell>
  );
}
