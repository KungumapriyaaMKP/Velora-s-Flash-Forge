import { Product } from '../domain/storeTypes.js';

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'prod_flash_forge_edition',
    name: "Velora Flash Forge Founder's Edition VR-900",
    category: 'Gaming',
    price: 499.99,
    originalPrice: 899.99,
    discountPercent: 44,
    image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 1248,
    inStock: true,
    stockCount: 100,
    description: 'High-performance next-gen VR headset featuring 4K OLED displays per eye, ultra-low sub-millisecond motion latency, and neural haptic feedback.',
    features: ['4K Micro-OLED Dual Displays', '120Hz Refresh Rate', 'Zero-Latency Wireless Sync', 'Neural Spatial Audio Engine']
  },
  {
    id: 'prod_cyber_deck_pro',
    name: 'CyberDeck X1 Ultra Gaming Laptop',
    category: 'Computing',
    price: 1299.00,
    originalPrice: 1599.00,
    discountPercent: 18,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 892,
    inStock: true,
    stockCount: 45,
    description: 'Liquid-cooled mobile workstation powered by RTX 5090 graphics and 64GB DDR5 RAM for uncompromised ray-tracing throughput.',
    features: ['RTX 5090 Mobile GPU', '64GB DDR5 6400MHz', '240Hz QHD+ Display', 'Vapor Chamber Cooling']
  },
  {
    id: 'prod_quantum_buds_pro',
    name: 'Quantum Audio Noise-Canceling Earbuds',
    category: 'Wearables',
    price: 149.99,
    originalPrice: 249.99,
    discountPercent: 40,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewCount: 540,
    inStock: true,
    stockCount: 80,
    description: 'Active ANC 45dB noise cancellation with lossless 24-bit audio streaming and 36-hour battery life.',
    features: ['45dB Active Noise Cancellation', '24-Bit Hi-Res Lossless Audio', '36-Hour Total Battery', 'IPX7 Water Resistance']
  },
  {
    id: 'prod_forge_watch_ultra',
    name: 'Forge Watch Ultra Smartwatch',
    category: 'Wearables',
    price: 299.99,
    originalPrice: 399.99,
    discountPercent: 25,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 1120,
    inStock: true,
    stockCount: 60,
    description: 'Titanium chassis outdoor GPS watch with real-time biometric telemetry, ECG sensor, and 7-day battery endurance.',
    features: ['Grade-5 Titanium Case', 'Dual-Frequency GPS Tracking', 'Biometric ECG Sensor', '100m Water Resistance']
  },
  {
    id: 'prod_mech_keyboard_forge',
    name: 'Flash Forge RGB Optical Mechanical Keyboard',
    category: 'Electronics',
    price: 119.99,
    originalPrice: 179.99,
    discountPercent: 33,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewCount: 310,
    inStock: true,
    stockCount: 120,
    description: 'Hot-swappable optical switches with 8000Hz polling rate for instantaneous competitive esports actuation.',
    features: ['Hot-Swappable Optical Switches', '8000Hz Ultra-Polling Rate', 'Per-Key RGB Lighting', 'PBT Double-shot Keycaps']
  },
  {
    id: 'prod_curved_monitor_4k',
    name: 'Velora 34" Ultrawide OLED Curved Gaming Monitor',
    category: 'Electronics',
    price: 899.99,
    originalPrice: 1199.99,
    discountPercent: 25,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 412,
    inStock: true,
    stockCount: 30,
    description: 'Quantum Dot OLED panel with 0.03ms response time, 175Hz refresh rate, and 99.3% DCI-P3 color gamut.',
    features: ['34" WQHD Curved QD-OLED', '0.03ms Response Time', '175Hz Refresh Rate', 'VESA DisplayHDR True Black 400']
  }
];

export class CatalogService {
  public static filterProducts(
    products: Product[],
    query: string,
    category: string,
    minPrice: number,
    maxPrice: number,
    onlyInStock: boolean,
    sortBy: 'popularity' | 'price_low' | 'price_high' | 'rating'
  ): Product[] {
    return products
      .filter((p) => {
        // Query search match
        const matchesQuery = 
          !query || 
          p.name.toLowerCase().includes(query.toLowerCase()) || 
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase());

        // Category filter
        const matchesCategory = category === 'All' || p.category === category;

        // Price range
        const matchesPrice = p.price >= minPrice && p.price <= maxPrice;

        // Stock availability
        const matchesStock = !onlyInStock || p.inStock;

        return matchesQuery && matchesCategory && matchesPrice && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return a.price - b.price;
        if (sortBy === 'price_high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.reviewCount - a.reviewCount; // Popularity
      });
  }
}
