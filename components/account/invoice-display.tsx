"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface InvoiceDisplayProps {
  orderId: string;
  orderNumber?: string | null;
}

export function InvoiceDisplay({ orderId, orderNumber }: InvoiceDisplayProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadInvoice = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/invoice`);

      if (!response.ok) {
        throw new Error("Failed to download invoice");
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${orderNumber || orderId}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Invoice downloaded successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to download invoice",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewInvoice = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/invoice`);

      if (!response.ok) {
        throw new Error("Failed to view invoice");
      }

      const html = await response.text();
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(html);
        newWindow.document.close();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to view invoice",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleViewInvoice}
            disabled={isLoading}
            variant="outline"
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Invoice
          </Button>
          <Button
            onClick={handleDownloadInvoice}
            disabled={isLoading}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
