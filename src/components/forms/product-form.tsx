"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { upload } from "@imagekit/next";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { routes } from "@/constants/routes";
import { productFormSchema, type ProductFormValues } from "@/schemas/product.schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ProductForm({
  mode,
  product
}: {
  mode: "create" | "edit";
  product?: {
    _id: string;
    name: string;
    description: string;
    category: string;
    image: string;
    price: number;
    stockQuantity: number;
    isActive: boolean;
  };
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product ?? {
      name: "",
      description: "",
      category: "",
      image: "",
      price: 0,
      stockQuantity: 0,
      isActive: true
    }
  });
  const imageUrl = watch("image");

  const uploadImage = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const authResponse = await fetch("/api/upload-auth");
      const authPayload = await authResponse.json();

      if (!authResponse.ok) {
        throw new Error(authPayload.message || "Failed to authenticate image upload");
      }

      const result = await upload({
        file,
        fileName: file.name,
        folder: "/gearup/products",
        useUniqueFileName: true,
        publicKey: authPayload.publicKey,
        token: authPayload.token,
        signature: authPayload.signature,
        expire: authPayload.expire,
        onProgress: (event) => {
          if (!event.total) return;
          setUploadProgress(Math.round((event.loaded / event.total) * 100));
        }
      });

      if (!result.url) {
        throw new Error("Image upload succeeded but no URL was returned.");
      }

      setValue("image", result.url, { shouldValidate: true, shouldDirty: true });
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      setIsSubmitting(true);

      const response = await fetch(mode === "create" ? "/api/products" : `/api/products/${product?._id}`, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Failed to save product");
      }

      toast.success(mode === "create" ? "Product created successfully" : "Product updated successfully");
      router.push(routes.products);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle>{mode === "create" ? "Create product" : "Edit product"}</CardTitle>
        <CardDescription>Save a catalog item that will be available on the products page.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5 sm:grid-cols-2" onSubmit={onSubmit}>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} />
            {errors.description ? <p className="text-sm text-destructive">{errors.description.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" placeholder="Laptops" {...register("category")} />
            {errors.category ? <p className="text-sm text-destructive">{errors.category.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Product image</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void uploadImage(file);
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
              {isUploading ? `Uploading ${uploadProgress}%` : imageUrl ? "Replace image" : "Upload image"}
            </Button>
            <Input id="image" readOnly placeholder="Uploaded ImageKit URL" {...register("image")} />
            {errors.image ? <p className="text-sm text-destructive">{errors.image.message}</p> : null}
            {imageUrl ? (
              <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-2xl border bg-muted">
                <Image src={imageUrl} alt="Product preview" fill className="object-cover" />
              </div>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input id="price" type="number" min={0} step="0.01" {...register("price", { valueAsNumber: true })} />
            {errors.price ? <p className="text-sm text-destructive">{errors.price.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="stockQuantity">Stock quantity</Label>
            <Input
              id="stockQuantity"
              type="number"
              min={0}
              step="1"
              {...register("stockQuantity", { valueAsNumber: true })}
            />
            {errors.stockQuantity ? <p className="text-sm text-destructive">{errors.stockQuantity.message}</p> : null}
          </div>
          <div className="sm:col-span-2">
            <Label className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4 rounded border" {...register("isActive")} />
              Keep this product active in the catalog
            </Label>
          </div>
          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {mode === "create" ? "Create product" : "Save changes"}
            </Button>
            <Button asChild type="button" variant="outline">
              <Link href={routes.products}>Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
