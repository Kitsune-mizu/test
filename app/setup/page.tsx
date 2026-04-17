"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Loader2, Copy } from "lucide-react";
import { HikaruLogo } from "@/components/ui/hikaru-logo";

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [credentials, setCredentials] = useState<{
    customerEmail: string;
    customerPassword: string;
    adminEmail: string;
    adminPassword: string;
  } | null>(null);

  const runSetup = async () => {
    setLoading(true);
    setStatus("idle");
    try {
      const response = await fetch("/api/setup");
      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.message || "Setup failed");
      } else {
        setStatus("success");
        setMessage(data.message);
        setCredentials(data.credentials);
      }
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Setup failed");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <HikaruLogo variant="full" />
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="text-2xl">Database Setup</CardTitle>
              <CardDescription>
                Initialize demo data dan buat demo users untuk testing
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Instructions */}
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Langkah Setup:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-neutral-600">
                    <li>Pastikan Supabase credentials sudah di .env.local</li>
                    <li>Klik tombol "Run Setup" di bawah</li>
                    <li>Catat demo credentials yang muncul</li>
                    <li>Gunakan untuk login sebagai customer atau admin</li>
                  </ol>
                </div>

                {/* Setup Button */}
                <Button
                  onClick={runSetup}
                  disabled={loading}
                  size="lg"
                  className="w-full"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Running Setup..." : "Run Setup"}
                </Button>

                {/* Status Messages */}
                {status === "success" && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      {message}
                    </AlertDescription>
                  </Alert>
                )}

                {status === "error" && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {message}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Credentials Display */}
                {credentials && (
                  <div className="space-y-4 bg-neutral-50 p-4 rounded-lg">
                    <h3 className="font-semibold">Demo Credentials:</h3>

                    {/* Customer Credentials */}
                    <div className="bg-white p-3 rounded border">
                      <p className="text-sm font-medium text-neutral-600 mb-2">
                        👤 Customer Login (localhost:3000/auth/login)
                      </p>
                      <div className="space-y-2 text-sm font-mono">
                        <div className="flex items-center justify-between">
                          <span>Email: {credentials.customerEmail}</span>
                          <button
                            onClick={() =>
                              copyToClipboard(credentials.customerEmail)
                            }
                            className="text-primary hover:text-primary/80"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Password: {credentials.customerPassword}</span>
                          <button
                            onClick={() =>
                              copyToClipboard(credentials.customerPassword)
                            }
                            className="text-primary hover:text-primary/80"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Admin Credentials */}
                    <div className="bg-white p-3 rounded border border-primary/20">
                      <p className="text-sm font-medium text-neutral-600 mb-2">
                        🔐 Admin Login (localhost:3000/admin/auth/login)
                      </p>
                      <div className="space-y-2 text-sm font-mono">
                        <div className="flex items-center justify-between">
                          <span>Email: {credentials.adminEmail}</span>
                          <button
                            onClick={() =>
                              copyToClipboard(credentials.adminEmail)
                            }
                            className="text-primary hover:text-primary/80"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Password: {credentials.adminPassword}</span>
                          <button
                            onClick={() =>
                              copyToClipboard(credentials.adminPassword)
                            }
                            className="text-primary hover:text-primary/80"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-neutral-500 bg-yellow-50 p-2 rounded">
                      💡 Tip: Admin account sudah memiliki role="admin" di
                      database
                    </div>
                  </div>
                )}

                {/* Info Box */}
                <div className="bg-blue-50 p-4 rounded-lg text-sm text-neutral-600">
                  <p className="font-medium text-blue-900 mb-2">
                    ℹ️ Informasi Database:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>SQL migrations berjalan otomatis via setup endpoint</li>
                    <li>10+ produk demo akan di-seed</li>
                    <li>2 akun demo dibuat: customer dan admin</li>
                    <li>Semua RLS policies sudah enabled untuk security</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Links */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-sm text-neutral-600">
              Setup selesai? Lanjut ke:
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="/auth/login"
                className="text-sm text-primary hover:underline font-medium"
              >
                Customer Login →
              </a>
              <a
                href="/admin/auth/login"
                className="text-sm text-primary hover:underline font-medium"
              >
                Admin Login →
              </a>
              <a
                href="/"
                className="text-sm text-primary hover:underline font-medium"
              >
                Homepage →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
