"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatRelativeTime } from "@/lib/format"
import { submitReviewAction } from "@/app/actions/reviews"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Review {
  id: string
  rating: number
  comment: string | null
  created_at: string
  users: { id: string; name: string | null } | null
}

interface ProductReviewsProps {
  productId: string
  reviews: Review[]
  isLoggedIn: boolean
}

export function ProductReviews({ productId, reviews, isLoggedIn }: ProductReviewsProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      toast.error("Please select a rating")
      return
    }

    setIsSubmitting(true)
    const result = await submitReviewAction(productId, rating, comment)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Review submitted successfully")
      setRating(0)
      setComment("")
      router.refresh()
    }
    setIsSubmitting(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-heading text-2xl font-bold">Customer Reviews</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{averageRating.toFixed(1)}</span>
              <span className="text-muted-foreground">({reviews.length} reviews)</span>
            </div>
          )}
        </div>
      </div>

      {/* Review Form */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="mb-10 p-6 bg-muted/30 rounded-xl">
          <h3 className="font-medium mb-4">Write a Review</h3>
          
          {/* Star Rating */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-muted-foreground">Rating:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-0.5"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <Textarea
            placeholder="Share your experience with this product..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mb-4"
            rows={4}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      ) : (
        <div className="mb-10 p-6 bg-muted/30 rounded-xl text-center">
          <p className="text-muted-foreground mb-4">Sign in to write a review</p>
          <Button asChild variant="outline">
            <a href="/auth/login">Sign In</a>
          </Button>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No reviews yet. Be the first to review this product!
        </p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-0">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {review.users?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{review.users?.name || "Anonymous"}</p>
                      <div className="flex mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatRelativeTime(review.created_at)}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="mt-3 text-muted-foreground">{review.comment}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
