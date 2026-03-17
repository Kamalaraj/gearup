import { redirect } from "next/navigation";

export default async function ProductEditAliasPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  redirect(`/products/${resolvedParams.id}`);
}
