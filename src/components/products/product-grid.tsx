import Image from "next/image";

import { AddToCartButton } from "@/components/products/add-to-cart-button";
import { ProductActions } from "@/components/products/product-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

type ProductCardRecord = {
  _id: string;
  productId: string;
  name: string;
  description: string;
  category: string;
  image: string;
  price: number;
  stockQuantity: number;
};

export function ProductGrid({
  products,
  customerId
}: {
  products: ProductCardRecord[];
  customerId: string;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <Card key={product._id} className="overflow-hidden">
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          </div>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge variant="outline" className="mb-3">
                  {product.category}
                </Badge>
                <CardTitle>{product.name}</CardTitle>
              </div>
              <p className="text-lg font-semibold">{formatCurrency(product.price)}</p>
            </div>
            <CardDescription>{product.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : "Out of stock"}
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="w-full space-y-3">
              <AddToCartButton
                customerId={customerId}
                productId={product._id}
                stockQuantity={product.stockQuantity}
              />
              <ProductActions productId={product._id} />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
