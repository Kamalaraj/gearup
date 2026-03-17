import "dotenv/config";

import { connectToDatabase } from "../src/lib/db";
import { productSeedSchema } from "../src/schemas/product.schema";
import { productService } from "../src/services/product.service";

const products = [
  {
    name: "AeroBook Pro 14",
    description: "Ultra-light laptop with a crisp 2.8K display and all-day battery for mobile work.",
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80",
    price: 1499,
    stockQuantity: 12
  },
  {
    name: "VoltBook Studio 16",
    description: "Performance laptop tuned for creators, developers, and heavy multitasking workloads.",
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    price: 1899,
    stockQuantity: 8
  },
  {
    name: "Orbit Phone X",
    description: "Flagship smartphone with a vivid OLED panel, fast charging, and advanced camera system.",
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
    price: 999,
    stockQuantity: 15
  },
  {
    name: "Orbit Phone Lite",
    description: "Balanced everyday smartphone with strong battery life and clean software experience.",
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80",
    price: 649,
    stockQuantity: 21
  },
  {
    name: "Pulse Buds Air",
    description: "Wireless earbuds with ANC, clear microphones, and low-latency gaming mode.",
    category: "Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    price: 179,
    stockQuantity: 30
  },
  {
    name: "Pulse Headset Max",
    description: "Over-ear headphones with deep bass tuning and plush memory foam comfort.",
    category: "Headphones",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80",
    price: 249,
    stockQuantity: 16
  },
  {
    name: "VisionView 27",
    description: "27-inch QHD monitor with 165Hz refresh rate for gaming and smooth desktop work.",
    category: "Monitors",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80",
    price: 399,
    stockQuantity: 11
  },
  {
    name: "VisionView UltraWide",
    description: "34-inch ultrawide monitor with vibrant color and ample screen space for multitasking.",
    category: "Monitors",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80",
    price: 699,
    stockQuantity: 7
  },
  {
    name: "ChargeDock 7-in-1",
    description: "Compact USB-C hub with HDMI, SD, Ethernet, and high-speed charging passthrough.",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=1200&q=80",
    price: 89,
    stockQuantity: 26
  },
  {
    name: "Glide Mouse Pro",
    description: "Ergonomic wireless mouse with adjustable DPI and multi-device pairing.",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80",
    price: 79,
    stockQuantity: 24
  },
  {
    name: "MechKeys Mini",
    description: "Compact mechanical keyboard with hot-swappable switches and RGB backlighting.",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80",
    price: 129,
    stockQuantity: 19
  },
  {
    name: "PowerBrick 100W",
    description: "Fast GaN charger that can power laptops, tablets, phones, and accessories together.",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=1200&q=80",
    price: 69,
    stockQuantity: 34
  },
  {
    name: "StreamCam 4K",
    description: "High-resolution webcam with AI framing and sharp low-light image performance.",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=1200&q=80",
    price: 159,
    stockQuantity: 13
  },
  {
    name: "TabEdge S",
    description: "Slim productivity tablet for note-taking, reading, and casual creative work.",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=80",
    price: 499,
    stockQuantity: 14
  },
  {
    name: "SoundBar Nano",
    description: "Desktop soundbar designed for compact setups with clear dialogue and punchy output.",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80",
    price: 139,
    stockQuantity: 17
  }
];

async function main() {
  await connectToDatabase();
  const parsedProducts = products.map((product) => productSeedSchema.parse(product));
  const result = await productService.seedProducts(parsedProducts);

  if (result.skipped) {
    console.log("Products already exist. Seed skipped.");
    return;
  }

  console.log(`Seeded ${result.insertedCount} products successfully.`);
}

main()
  .catch((error) => {
    console.error("Product seed failed", error);
    process.exit(1);
  });
