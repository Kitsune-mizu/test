'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'

interface LowStockProduct {
  id: string
  name: string
  stock: number
}

export function LowStockAlerts() {
  const [products, setProducts] = useState<LowStockProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/admin/dashboard/low-stock')
        if (!response.ok) throw new Error('Failed to fetch low stock products')
        const data = await response.json()
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (!isLoading && products.length === 0) {
    return null
  }

  return (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          Low Stock Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div className="text-destructive">{error}</div>}
        <div className="space-y-2">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))
          ) : (
            products.map((product) => (
              <div key={product.id} className="flex items-center justify-between">
                <span className="text-sm">{product.name}</span>
                <span className="font-medium text-destructive">{product.stock} left</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
