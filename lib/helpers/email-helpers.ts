"use server";

/**
 * Email notification system
 * Menggunakan platform seperti SendGrid, Resend, atau Mailgun
 * Untuk demo, kami akan log ke console
 */

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

/**
 * Generate order confirmation email
 */
export async function generateOrderConfirmationEmail(orderData: {
  orderNumber: string;
  customerName: string;
  totalPrice: number;
  items: Array<{ name: string; quantity: number; price: number }>;
  trackingUrl: string;
}): Promise<EmailTemplate> {
  const itemsHtml = orderData.items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
        </tr>`,
    )
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #E10600;">ご注文ありがとうございます</h1>
      <p>Thank you for your order, ${orderData.customerName}!</p>
      
      <div style="background-color: #f5f5f5; padding: 16px; margin: 20px 0; border-radius: 8px;">
        <p><strong>Order Number:</strong> #${orderData.orderNumber}</p>
        <p><strong>Total Amount:</strong> $${orderData.totalPrice.toFixed(2)}</p>
      </div>

      <h2 style="color: #333;">Order Details</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f0f0f0;">
            <th style="padding: 8px; text-align: left;">Product</th>
            <th style="padding: 8px; text-align: center;">Qty</th>
            <th style="padding: 8px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="margin: 20px 0;">
        <a href="${orderData.trackingUrl}" style="background-color: #E10600; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Track Your Order
        </a>
      </div>

      <p style="color: #666; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
        お問い合わせがございましたら、サポートチームまでお気軽にご連絡ください。<br>
        If you have any questions, please contact our support team.
      </p>
    </div>
  `;

  const text = `
Thank you for your order!

Order Number: #${orderData.orderNumber}
Total Amount: $${orderData.totalPrice.toFixed(2)}

Items:
${orderData.items.map((item) => `- ${item.name} (Qty: ${item.quantity}) - $${item.price.toFixed(2)}`).join("\n")}

Track your order: ${orderData.trackingUrl}
  `;

  return {
    subject: `Order Confirmation - #${orderData.orderNumber}`,
    html,
    text,
  };
}

/**
 * Generate order status update email
 */
export async function generateOrderStatusEmail(orderData: {
  orderNumber: string;
  customerName: string;
  status: string;
  statusJapanese: string;
  trackingNumber?: string;
  trackingUrl?: string;
}): Promise<EmailTemplate> {
  const statusMessages: Record<string, { title: string; message: string }> = {
    confirmed: {
      title: "✅ Order Confirmed",
      message: "Your order has been confirmed and will be processed soon.",
    },
    preparing: {
      title: "⚙️ Preparing Your Order",
      message: "We are currently picking and packing your items.",
    },
    shipped: {
      title: "📦 Your Order Has Shipped!",
      message:
        "Your order is on the way. Track your package using the link below.",
    },
    delivered: {
      title: "🎉 Order Delivered!",
      message:
        "Thank you for shopping with us. We hope you enjoy your purchase!",
    },
  };

  const statusInfo = statusMessages[orderData.status] || {
    title: "Order Update",
    message: "Your order status has been updated.",
  };

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #E10600;">${statusInfo.title}</h1>
      <p>Dear ${orderData.customerName},</p>
      
      <p>${statusInfo.message}</p>

      <div style="background-color: #f5f5f5; padding: 16px; margin: 20px 0; border-radius: 8px;">
        <p><strong>Order Number:</strong> #${orderData.orderNumber}</p>
        <p><strong>Status:</strong> ${orderData.status} (${orderData.statusJapanese})</p>
        ${orderData.trackingNumber ? `<p><strong>Tracking Number:</strong> ${orderData.trackingNumber}</p>` : ""}
      </div>

      ${
        orderData.trackingUrl
          ? `
        <div style="margin: 20px 0;">
          <a href="${orderData.trackingUrl}" style="background-color: #E10600; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Track Your Package
          </a>
        </div>
      `
          : ""
      }

      <p style="color: #666; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
        Thank you for your business! ご注文ありがとうございます
      </p>
    </div>
  `;

  const text = `
${statusInfo.title}

Dear ${orderData.customerName},

${statusInfo.message}

Order Number: #${orderData.orderNumber}
Status: ${orderData.status} (${orderData.statusJapanese})
${orderData.trackingNumber ? `Tracking Number: ${orderData.trackingNumber}` : ""}
${orderData.trackingUrl ? `\nTrack your package: ${orderData.trackingUrl}` : ""}
  `;

  return {
    subject: `Order ${orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)} - #${orderData.orderNumber}`,
    html,
    text,
  };
}

/**
 * Send email notification
 * Dalam production, gunakan Resend, SendGrid, atau provider email lainnya
 */
export async function sendEmail(
  to: string,
  template: EmailTemplate,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Log untuk demo (dalam production, integrasikan dengan email provider)
    console.log("[Email] Sending to:", to);
    console.log("[Email] Subject:", template.subject);
    console.log("[Email] Message:", template.text);

    // TODO: Integrate dengan Resend, SendGrid, atau provider lain
    // const response = await resend.emails.send({
    //   from: 'noreply@yourdomain.com',
    //   to,
    //   subject: template.subject,
    //   html: template.html,
    // })

    return {
      success: true,
      messageId: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
    };
  } catch (error) {
    console.error("[v0] Email send error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}

/**
 * Send order confirmation email ke customer
 */
export async function sendOrderConfirmationEmail(
  customerEmail: string,
  orderData: {
    orderNumber: string;
    customerName: string;
    totalPrice: number;
    items: Array<{ name: string; quantity: number; price: number }>;
    orderId: string;
  },
): Promise<void> {
  try {
    const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${orderData.orderId}`;
    const template = generateOrderConfirmationEmail({
      ...orderData,
      trackingUrl,
    });

    await sendEmail(customerEmail, template);
  } catch (error) {
    console.error("[v0] Failed to send order confirmation email:", error);
  }
}

/**
 * Send order status update email ke customer
 */
export async function sendOrderStatusEmail(
  customerEmail: string,
  orderData: {
    orderNumber: string;
    customerName: string;
    status: string;
    statusJapanese: string;
    trackingNumber?: string;
    orderId: string;
  },
): Promise<void> {
  try {
    const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${orderData.orderId}`;
    const template = generateOrderStatusEmail({
      ...orderData,
      trackingUrl,
    });

    await sendEmail(customerEmail, template);
  } catch (error) {
    console.error("[v0] Failed to send order status email:", error);
  }
}
