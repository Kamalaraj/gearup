import nodemailer from "nodemailer";

type OrderMailPayload = {
  to: string;
  customerName: string;
  orderId: string;
  items: Array<{ name: string; quantity: number; priceAtTime: number }>;
  totalAmount: number;
  deliveryAddress: string;
};

export async function sendOrderConfirmationEmail(payload: OrderMailPayload) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    return {
      sent: false,
      reason: "SMTP environment variables are not fully configured."
    };
  }

  if (SMTP_HOST === "smtp.example.com") {
    return {
      sent: false,
      reason: "SMTP host is still set to the placeholder value smtp.example.com."
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });

    const itemRows = payload.items
      .map((item) => `<li>${item.name} x ${item.quantity} - $${item.priceAtTime.toFixed(2)}</li>`)
      .join("");

    await transporter.sendMail({
      from: SMTP_FROM,
      to: payload.to,
      subject: `GearUp order confirmation: ${payload.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Thanks for ordering with GearUp, ${payload.customerName}</h2>
          <p>Your order <strong>${payload.orderId}</strong> has been placed successfully.</p>
          <p><strong>Items</strong></p>
          <ul>${itemRows}</ul>
          <p><strong>Total:</strong> $${payload.totalAmount.toFixed(2)}</p>
          <p><strong>Delivery address:</strong><br />${payload.deliveryAddress.replace(/\n/g, "<br />")}</p>
        </div>
      `
    });

    return { sent: true };
  } catch (error) {
    return {
      sent: false,
      reason: error instanceof Error ? error.message : "Failed to send confirmation email."
    };
  }
}
