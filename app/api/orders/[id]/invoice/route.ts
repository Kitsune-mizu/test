import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { formatDate, formatPrice } from "@/lib/format";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: order } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          quantity,
          price,
          products (id, name, price, tax_rate)
        ),
        users:user_id (
          email,
          name,
          phone,
          address
        )
      `,
      )
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Generate invoice HTML
    const invoiceHtml = generateInvoiceHTML(order);

    // Return as HTML/PDF-ready content
    return new NextResponse(invoiceHtml, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="invoice-${order.order_number || order.id}.html"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate invoice",
      },
      { status: 500 },
    );
  }
}

function generateInvoiceHTML(order: any): string {
  const orderNumber =
    order.order_number || `ORD-${order.id.slice(0, 8).toUpperCase()}`;
  const userInfo =
    order.users && Array.isArray(order.users) ? order.users[0] : order.users;

  let subtotal = 0;
  let taxTotal = 0;

  const itemsHTML = order.order_items
    .map((item: any) => {
      const itemSubtotal = item.price * item.quantity;
      const taxRate = item.products?.tax_rate || 0;
      const itemTax = (itemSubtotal * taxRate) / 100;
      subtotal += itemSubtotal;
      taxTotal += itemTax;

      return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
            ${item.products?.name || "Product"}
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">
            $${item.price.toFixed(2)}
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">
            $${taxRate.toFixed(2)}%
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">
            $${(itemSubtotal + itemTax).toFixed(2)}
          </td>
        </tr>
      `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${orderNumber}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          color: #1f2937;
          background: #f9fafb;
        }
        .invoice-container {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 40px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 20px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
        }
        .invoice-details {
          text-align: right;
        }
        .invoice-number {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
        }
        .invoice-date {
          color: #6b7280;
          font-size: 14px;
        }
        .addresses {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        .address-block h3 {
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .address-block p {
          font-size: 14px;
          line-height: 1.6;
          color: #1f2937;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        th {
          background: #f3f4f6;
          padding: 12px 8px;
          text-align: left;
          font-weight: 600;
          font-size: 13px;
          color: #374151;
        }
        .totals {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 40px;
        }
        .totals-table {
          width: 300px;
        }
        .totals-table tr {
          border-bottom: 1px solid #e5e7eb;
        }
        .totals-table td {
          padding: 10px 0;
          text-align: right;
        }
        .totals-table .label {
          text-align: left;
          color: #6b7280;
        }
        .total-row {
          font-weight: 600;
          font-size: 16px;
          color: #1f2937;
        }
        .final-total {
          font-size: 18px;
          color: #059669;
          font-weight: bold;
        }
        .footer {
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
        }
        @media print {
          body { background: white; }
          .invoice-container { box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div class="logo">Hikaru Bouken</div>
          <div class="invoice-details">
            <div class="invoice-number">Invoice ${orderNumber}</div>
            <div class="invoice-date">${formatDate(order.created_at)}</div>
          </div>
        </div>

        <div class="addresses">
          <div class="address-block">
            <h3>Bill From</h3>
            <p>Hikaru Bouken Inc.<br>123 Mountain Street<br>Adventure City, AC 12345<br>support@hikaru.local</p>
          </div>
          <div class="address-block">
            <h3>Bill To</h3>
            <p>
              ${userInfo?.name || "Customer"}<br>
              ${userInfo?.email || ""}<br>
              ${userInfo?.phone || ""}<br>
              ${userInfo?.address || ""}
            </p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Unit Price</th>
              <th style="text-align: right;">Tax Rate</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <div class="totals">
          <table class="totals-table">
            <tr>
              <td class="label">Subtotal</td>
              <td>$${subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td class="label">Tax</td>
              <td>$${taxTotal.toFixed(2)}</td>
            </tr>
            <tr class="total-row">
              <td class="label">Total</td>
              <td class="final-total">$${(subtotal + taxTotal).toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <div class="footer">
          <p>Thank you for your order!</p>
          <p style="margin-top: 10px;">Payment Method: ${order.payment_method === "cod" ? "Cash on Delivery" : "Card Payment"}</p>
          <p style="margin-top: 10px;">Order Status: ${order.status}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
