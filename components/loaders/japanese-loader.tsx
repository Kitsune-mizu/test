"use client"

import { useEffect, useState } from "react"

export function JapaneseSkeleton() {
  const [shimmer, setShimmer] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setShimmer(prev => !prev)
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6 p-6">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div 
          className={`h-8 rounded-lg transition-opacity duration-1000 ${
            shimmer ? 'bg-neutral-200 opacity-100' : 'bg-neutral-100 opacity-60'
          }`}
          style={{ width: '40%' }}
        />
        <div 
          className={`h-4 rounded-lg transition-opacity duration-1000 ${
            shimmer ? 'bg-neutral-200 opacity-100' : 'bg-neutral-100 opacity-60'
          }`}
          style={{ width: '60%' }}
        />
      </div>

      {/* Content Skeleton */}
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div 
              className={`h-4 rounded-lg transition-opacity duration-1000 ${
                shimmer ? 'bg-neutral-200 opacity-100' : 'bg-neutral-100 opacity-60'
              }`}
              style={{ width: `${75 + (i * 10)}%` }}
            />
            <div 
              className={`h-3 rounded-lg transition-opacity duration-1000 ${
                shimmer ? 'bg-neutral-200 opacity-100' : 'bg-neutral-100 opacity-60'
              }`}
              style={{ width: `${50 + (i * 15)}%` }}
            />
          </div>
        ))}
      </div>

      {/* Japanese accent element */}
      <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
        <span className="text-8xl font-heading font-bold text-red-600">
          読
        </span>
      </div>
    </div>
  )
}

export function JapaneseLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Decorative Japanese characters */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <div className="relative">
          <span className="absolute text-9xl font-heading font-bold text-red-600 animate-pulse" style={{ left: '-200px', top: '-100px' }}>
            読
          </span>
          <span className="absolute text-9xl font-heading font-bold text-red-600 animate-pulse" style={{ right: '-200px', bottom: '-100px', animationDelay: '0.5s' }}>
            込
          </span>
        </div>
      </div>

      {/* Loading spinner */}
      <div className="relative w-16 h-16">
        {/* Outer circle */}
        <div className="absolute inset-0 rounded-full border-4 border-neutral-200" />
        
        {/* Animated border - red accent */}
        <div 
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-600 border-r-red-600 animate-spin"
          style={{ animationDuration: '1.5s' }}
        />

        {/* Inner circle with Japanese character */}
        <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center border-2 border-neutral-100">
          <span className="text-2xl font-heading font-bold text-red-600 animate-pulse">
            光
          </span>
        </div>
      </div>

      {/* Loading text */}
      <div className="absolute bottom-20 text-center space-y-2">
        <p className="text-sm font-medium text-foreground">
          Loading <span className="text-red-600">|</span> 読込中
        </p>
        <p className="text-xs text-muted-foreground">
          お待ちください
        </p>
      </div>
    </div>
  )
}
