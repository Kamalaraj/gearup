import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

type OrderRow = {
  _id: string;
  orderId: string;
  items: Array<{ name: string; quantity: number }>;
  totalAmount: number;
  orderStatus: "pending" | "confirmed" | "shipped" | "delivered";
  createdAt: string;
};

const statusVariantMap: Record<OrderRow["orderStatus"], "default" | "accent" | "outline"> = {
  pending: "outline",
  confirmed: "accent",
  shipped: "default",
  delivered: "accent"
};

export function OrderListTable({ orders }: { orders: OrderRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order history</CardTitle>
        <CardDescription>Track your placed orders and their current status.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Placed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-medium">{order.orderId}</TableCell>
                <TableCell>
                  {order.items.length} item{order.items.length === 1 ? "" : "s"}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariantMap[order.orderStatus]}>
                    {order.orderStatus}
                  </Badge>
                </TableCell>
                <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
