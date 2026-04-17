import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: userProfile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userProfile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const sampleProducts = [
    {
      name: "Alpine Pro Backpack 50L",
      slug: "alpine-pro-backpack-50l",
      description:
        "Premium 50L hiking backpack with ergonomic design, rain cover, and multiple compartments. Perfect for multi-day treks.",
      category: "Backpacks",
      brand: "Patagonia",
      price: 299.99,
      stock: 45,
      image_url:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
      tags: ["hiking", "backpack", "premium"],
    },
    {
      name: "Summit Hiking Boots",
      slug: "summit-hiking-boots",
      description:
        "Waterproof hiking boots with ankle support, durable rubber sole, and breathable mesh lining. Tested in extreme conditions.",
      category: "Footwear",
      brand: "Salomon",
      price: 189.99,
      stock: 67,
      image_url:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
      tags: ["boots", "hiking", "footwear"],
    },
    {
      name: "Mountain Tent 4-Person",
      slug: "mountain-tent-4-person",
      description:
        "Lightweight 4-person tent with instant setup, aluminum poles, and triple-layer fabric. Wind and weather resistant.",
      category: "Tents",
      brand: "Mountain Hardwear",
      price: 449.99,
      stock: 28,
      image_url:
        "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=500&h=500&fit=crop",
      tags: ["tent", "camping", "4-person"],
    },
    {
      name: "Thermal Sleeping Bag",
      slug: "thermal-sleeping-bag",
      description:
        "Temperature-rated sleeping bag for cold weather camping. Synthetic insulation, water-resistant shell, comfort range -10°C to 0°C.",
      category: "Sleeping Bags",
      brand: "The North Face",
      price: 229.99,
      stock: 52,
      image_url:
        "https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?w=500&h=500&fit=crop",
      tags: ["sleeping bag", "camping", "thermal"],
    },
    {
      name: "Weather-Proof Jacket",
      slug: "weather-proof-jacket",
      description:
        "Breathable and waterproof outdoor jacket with sealed seams and ventilation. Perfect for any weather condition.",
      category: "Clothing",
      brand: "Arc'teryx",
      price: 329.99,
      stock: 34,
      image_url:
        "https://images.unsplash.com/photo-1539533857671-f2b84b81fb81?w=500&h=500&fit=crop",
      tags: ["jacket", "clothing", "waterproof"],
    },
    {
      name: "Climbing Harness Pro",
      slug: "climbing-harness-pro",
      description:
        "Professional climbing harness with reinforced waist belt and gear loops. Certified for rock and ice climbing.",
      category: "Climbing",
      brand: "Black Diamond",
      price: 119.99,
      stock: 41,
      image_url:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop",
      tags: ["climbing", "harness", "safety"],
    },
    {
      name: "GPS Navigator Watch",
      slug: "gps-navigator-watch",
      description:
        "Advanced GPS watch with trail mapping, compass, and weather updates. Water-resistant to 100m.",
      category: "Navigation",
      brand: "Garmin",
      price: 399.99,
      stock: 19,
      image_url:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
      tags: ["watch", "gps", "navigation"],
    },
    {
      name: "Hydration Pack 20L",
      slug: "hydration-pack-20l",
      description:
        "Lightweight 20L backpack with integrated hydration system. Multiple storage pockets and breathable back panel.",
      category: "Backpacks",
      brand: "Osprey",
      price: 159.99,
      stock: 56,
      image_url:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
      tags: ["backpack", "hydration", "day-hike"],
    },
    {
      name: "Camping Cookware Set",
      slug: "camping-cookware-set",
      description:
        "Complete cookware set with pot, pan, and utensils. Lightweight aluminum construction with non-stick coating.",
      category: "Accessories",
      brand: "Coleman",
      price: 89.99,
      stock: 73,
      image_url:
        "https://images.unsplash.com/photo-1555939594-58d7cb561404?w=500&h=500&fit=crop",
      tags: ["cookware", "camping", "accessories"],
    },
    {
      name: "Insulated Water Bottle",
      slug: "insulated-water-bottle",
      description:
        "Double-wall insulated water bottle keeps drinks hot or cold for 24 hours. Durable stainless steel construction.",
      category: "Accessories",
      brand: "Nalgene",
      price: 44.99,
      stock: 128,
      image_url:
        "https://images.unsplash.com/photo-1602143407151-7e536cd34493?w=500&h=500&fit=crop",
      tags: ["bottle", "hydration", "accessory"],
    },
  ];

  try {
    // Check if products already exist
    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    if (count && count > 0) {
      return NextResponse.json(
        { message: "Products already seeded", count },
        { status: 200 },
      );
    }

    const { data, error } = await supabase
      .from("products")
      .insert(sampleProducts)
      .select();

    if (error) throw error;

    return NextResponse.json({
      message: "Products seeded successfully",
      count: data?.length || 0,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to seed products",
      },
      { status: 400 },
    );
  }
}
