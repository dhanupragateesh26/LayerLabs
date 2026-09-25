export interface ProductSize {
  name: string;
  dimension: string;
  price: number;
  isDefault?: boolean;
}

export interface ProductDesign {
  id: string;
  name: string;
  desc: string;
  previewImg?: string;
}

export interface ProductColor {
  name: string;
  hex: string;
  inStock: boolean;
  previewImg?: string;
}

export interface Product {
  id: string;
  title: string;
  basePrice: number;
  img: string;
  images: string[];
  badges: string[];
  desc: string;
  customizationType: 'standard' | 'lamp' | 'lithophane';
  sizes: ProductSize[];
  colors?: ProductColor[];
  designs?: ProductDesign[];
  allowImageUpload?: boolean;
}

export const DEFAULT_COLORS: ProductColor[] = [
  { name: 'Matte White', hex: '#F3F4F6', inStock: true },
  { name: 'Classic Black', hex: '#1F2937', inStock: true },
  { name: 'Silk Gold', hex: '#D4AF37', inStock: true },
  { name: 'Crimson Red', hex: '#DC2626', inStock: true },
  { name: 'Royal Blue', hex: '#2563EB', inStock: true },
  { name: 'Forest Green', hex: '#15803D', inStock: true },
  { name: 'Sunset Orange', hex: '#EA580C', inStock: true },
  { name: 'Silk Silver', hex: '#9CA3AF', inStock: true },
];

export const products: Product[] = [
  {
    id: 'articulated-dragon-keychain',
    title: 'Articulated Dragon Keychain',
    basePrice: 60,
    img: '/products/dragon-keychain.jpg',
    images: ['/products/dragon-keychain.jpg', '/products/dragon-keychain-2.jpg'],
    badges: ['PLA', 'Articulated', 'Flexible', 'Keychain'],
    desc: 'Intricately detailed articulated dragon keychain with flexible, smoothly moving segments. Perfect for backpacks, keys, or fidgeting.',
    customizationType: 'standard',
    sizes: [
      { name: 'Standard', dimension: '10 cm', price: 60, isDefault: true },
      { name: 'Large', dimension: '15 cm', price: 90 },
      { name: 'Giant', dimension: '20 cm', price: 140 },
    ],
    colors: [
      { name: 'Matte White', hex: '#F3F4F6', inStock: true, previewImg: '/products/dragon-keychain.jpg' },
      { name: 'Emerald Jade', hex: '#15803D', inStock: true, previewImg: '/products/dragon-keychain-2.jpg' },
      { name: 'Classic Black', hex: '#1F2937', inStock: true, previewImg: '/products/dragon-keychain.jpg' },
      { name: 'Silk Gold', hex: '#D4AF37', inStock: true, previewImg: '/products/dragon-keychain-2.jpg' },
      { name: 'Crimson Red', hex: '#DC2626', inStock: true, previewImg: '/products/dragon-keychain.jpg' },
      { name: 'Royal Blue', hex: '#2563EB', inStock: true, previewImg: '/products/dragon-keychain-2.jpg' },
    ],
  },
  {
    id: 'custom-lithophane-lamp',
    title: 'Custom Lithophane Lamp',
    basePrice: 550,
    img: '/products/lithophane-lamp.jpg',
    images: ['/products/lithophane-lamp.jpg', '/products/lithophane-lamp-2.jpg', '/products/lithophane.png'],
    badges: ['12V Adapter', 'Custom Photo', 'Lamp', 'Backlit'],
    desc: 'Custom backlit 3D printed lithophane lamp that transforms your personal photos into a glowing, high-contrast light display. Comes complete with a 12V power adapter and LED base.',
    customizationType: 'lithophane',
    allowImageUpload: true,
    sizes: [
      { name: 'Desktop Compact', dimension: '10 × 6 cm', price: 550, isDefault: true },
      { name: 'Showcase Medium', dimension: '15 × 9 cm', price: 750 },
      { name: 'Grand Panorama', dimension: '20 × 12 cm', price: 980 },
    ],
    colors: [
      { name: 'Warm White LED (Stone Base)', hex: '#FFFDD0', inStock: true, previewImg: '/products/lithophane-lamp.jpg' },
      { name: 'Cool White LED (Matte Black Base)', hex: '#E0F2FE', inStock: true, previewImg: '/products/lithophane-lamp-2.jpg' },
      { name: 'Golden Glow (Timber Wood Look)', hex: '#FDE68A', inStock: true, previewImg: '/products/lithophane.png' },
    ],
  },
  {
    id: 'spiral-lamp',
    title: 'Modern Geometric Ambient Lamp',
    basePrice: 500,
    img: '/products/spiral-lamp.jpg',
    images: ['/products/spiral-lamp.jpg', '/products/spiral-lamp-hex.jpg', '/products/spiral-lamp-prism.jpg'],
    badges: ['PLA/PETG', 'Ambient Light', 'Parametric', 'Lamp'],
    desc: 'Modern parametric table lamp that diffuses warm, atmospheric illumination through intricate geometric shadows. Choose from multiple stunning computational designs.',
    customizationType: 'lamp',
    sizes: [
      { name: 'Standard Tabletop', dimension: '18 cm Height', price: 500, isDefault: true },
      { name: 'Large Floor / Console', dimension: '25 cm Height', price: 750 },
      { name: 'Grand Showcase', dimension: '32 cm Height', price: 1050 },
    ],
    designs: [
      {
        id: 'spiral-vortex',
        name: 'Spiral Vortex',
        desc: 'Twisted fluid contours creating a helical vortex light diffusion.',
        previewImg: '/products/spiral-lamp.jpg',
      },
      {
        id: 'hex-mesh',
        name: 'Hexagonal Cellular',
        desc: 'Geometric honeycomb structure that casts sharp cellular shadows.',
        previewImg: '/products/spiral-lamp-hex.jpg',
      },
      {
        id: 'twisted-prism',
        name: 'Twisted Polygonal Prism',
        desc: 'Sharp angular facets with modern architectural styling.',
        previewImg: '/products/spiral-lamp-prism.jpg',
      },
      {
        id: 'wave-ripple',
        name: 'Wave Ripple Undulation',
        desc: 'Smooth oceanic wave rings creating serene concentric illumination.',
        previewImg: '/products/spiral-lamp.jpg',
      },
    ],
    colors: [
      { name: 'Matte Ivory', hex: '#FFFFF0', inStock: true, previewImg: '/products/spiral-lamp.jpg' },
      { name: 'Warm Terracotta', hex: '#E07A5F', inStock: true, previewImg: '/products/spiral-lamp-hex.jpg' },
      { name: 'Midnight Charcoal', hex: '#262626', inStock: true, previewImg: '/products/spiral-lamp-prism.jpg' },
      { name: 'Emerald Jade', hex: '#065F46', inStock: true, previewImg: '/products/spiral-lamp.jpg' },
    ],
  },
  {
    id: 'michael-jackson-figurine',
    title: 'Michael Jackson Figurine',
    basePrice: 350,
    img: '/products/michael-jackson-figurine.jpg',
    images: ['/products/michael-jackson-figurine.jpg', '/products/michaeljackson.png'],
    badges: ['PLA', 'Figurine', 'Iconic', 'Collectable', 'High Detail'],
    desc: 'A highly detailed collectible figurine of the King of Pop captured in his world-renowned iconic dance pose.',
    customizationType: 'standard',
    sizes: [
      { name: 'Standard Display', dimension: '14 cm Height', price: 350, isDefault: true },
      { name: 'Showcase Collector', dimension: '20 cm Height', price: 520 },
      { name: 'Museum Scale', dimension: '26 cm Height', price: 780 },
    ],
    colors: [
      { name: 'Classic Black Suit', hex: '#18181B', inStock: true, previewImg: '/products/michael-jackson-figurine.jpg' },
      { name: 'Pure White Silk', hex: '#F8FAFC', inStock: true, previewImg: '/products/michaeljackson.png' },
      { name: 'Metallic Silver', hex: '#CBD5E1', inStock: true, previewImg: '/products/michael-jackson-figurine.jpg' },
      { name: 'Silk Gold', hex: '#EAB308', inStock: true, previewImg: '/products/michaeljackson.png' },
    ],
  },
  {
    id: 'grace-project-hail-mary-keychain',
    title: 'Grace (Project Hail Mary) Keychain',
    basePrice: 80,
    img: '/products/grace-keychain.jpg',
    images: ['/products/grace-keychain.jpg', '/products/grace-keychain-green.jpg'],
    badges: ['PLA', 'Sci-Fi', 'Collectable', 'Keychain'],
    desc: 'Detailed 3D printed keychain inspired by Grace from the movie & novel Project Hail Mary. Amaze-amaze-amaze!',
    customizationType: 'standard',
    sizes: [
      { name: 'Pocket Mini', dimension: '5 cm', price: 80, isDefault: true },
      { name: 'Standard Backpack', dimension: '8 cm', price: 120 },
      { name: 'Desk Figurine Scale', dimension: '12 cm', price: 180 },
    ],
    colors: [
      { name: 'Xenonite Black', hex: '#111827', inStock: true, previewImg: '/products/grace-keychain.jpg' },
      { name: 'Glow in the Dark Green', hex: '#86EFAC', inStock: true, previewImg: '/products/grace-keychain-green.jpg' },
      { name: 'Eridian Brown', hex: '#78350F', inStock: true, previewImg: '/products/grace-keychain.jpg' },
      { name: 'Matte White', hex: '#F3F4F6', inStock: true, previewImg: '/products/grace-keychain-green.jpg' },
    ],
  },
  {
    id: 'articulated-cat-keychain',
    title: 'Articulated Cat Keychain',
    basePrice: 70,
    img: '/products/cat-keychain.jpg',
    images: ['/products/cat-keychain.jpg', '/products/cat-keychain-gold.jpg'],
    badges: ['PLA', 'Articulated', 'Flexible', 'Cute'],
    desc: 'Playful articulated cat keychain featuring flexible interconnected body segments that wiggle and bend smoothly.',
    customizationType: 'standard',
    sizes: [
      { name: 'Standard Pocket', dimension: '8 cm', price: 70, isDefault: true },
      { name: 'Large', dimension: '12 cm', price: 110 },
    ],
    colors: [
      { name: 'Classic Black', hex: '#1F2937', inStock: true, previewImg: '/products/cat-keychain.jpg' },
      { name: 'Silk Gold', hex: '#D4AF37', inStock: true, previewImg: '/products/cat-keychain-gold.jpg' },
      { name: 'Matte White', hex: '#F3F4F6', inStock: true, previewImg: '/products/cat-keychain.jpg' },
      { name: 'Sunset Orange', hex: '#EA580C', inStock: true, previewImg: '/products/cat-keychain-gold.jpg' },
    ],
  },
  {
    id: 'f1-keychain',
    title: 'F1 Racing Car Keychain',
    basePrice: 60,
    img: '/products/f1-keychain.jpg',
    images: ['/products/f1-keychain.jpg', '/products/f1-keychain-red.jpg'],
    badges: ['PLA', 'F1', 'Motorsport', 'Keychain'],
    desc: 'Aerodynamic Formula 1 racing car keychain with sharp contours and sleek aerodynamics for motorsport fans.',
    customizationType: 'standard',
    sizes: [
      { name: 'Keyring Scale', dimension: '7 cm', price: 60, isDefault: true },
      { name: 'Showcase Model', dimension: '12 cm', price: 110 },
      { name: 'Desk Replica', dimension: '18 cm', price: 220 },
    ],
    colors: [
      { name: 'Silver Arrow', hex: '#94A3B8', inStock: true, previewImg: '/products/f1-keychain.jpg' },
      { name: 'Scuderia Red', hex: '#DC2626', inStock: true, previewImg: '/products/f1-keychain-red.jpg' },
      { name: 'Stealth Black', hex: '#0F172A', inStock: true, previewImg: '/products/f1-keychain.jpg' },
      { name: 'Papaya Orange', hex: '#F97316', inStock: true, previewImg: '/products/f1-keychain-red.jpg' },
      { name: 'Racing Yellow', hex: '#EAB308', inStock: true, previewImg: '/products/f1-keychain-red.jpg' },
    ],
  },
  {
    id: 'articulated-jellyfish-keychain',
    title: 'Articulated Jellyfish Keychain',
    basePrice: 80,
    img: '/products/jellyfish-keychain.png',
    images: ['/products/jellyfish-keychain.png'],
    badges: ['PLA', 'Articulated', 'Flexible', 'Organic'],
    desc: 'Unique articulated jellyfish keychain featuring flowing, flexible tentacles that move organically with every motion.',
    customizationType: 'standard',
    sizes: [
      { name: 'Standard', dimension: '8 cm', price: 80, isDefault: true },
      { name: 'Large Flow', dimension: '12 cm', price: 130 },
    ],
    colors: [
      { name: 'Aqua Blue', hex: '#06B6D4', inStock: true, previewImg: '/products/jellyfish-keychain.png' },
      { name: 'Deep Violet', hex: '#7C3AED', inStock: true, previewImg: '/products/jellyfish-keychain.png' },
      { name: 'Coral Pink', hex: '#F43F5E', inStock: true, previewImg: '/products/jellyfish-keychain.png' },
      { name: 'Glow Neon Green', hex: '#4ADE80', inStock: true, previewImg: '/products/jellyfish-keychain.png' },
      { name: 'Translucent Clear', hex: '#E2E8F0', inStock: true, previewImg: '/products/jellyfish-keychain.png' },
    ],
  },
  {
    id: 'batman-keychain',
    title: 'Batman Emblem Keychain',
    basePrice: 50,
    img: '/products/batman-keychain.png',
    images: ['/products/batman-keychain.png', '/products/batman-keychain-yellow.jpg'],
    badges: ['PLA', 'DC Comics', 'Batman', 'Durable'],
    desc: 'Crisp and durable 3D printed Batman symbol keychain crafted from tough PLA. Bold everyday carry for Dark Knight fans.',
    customizationType: 'standard',
    sizes: [
      { name: 'Standard Keychain', dimension: '6 cm', price: 50, isDefault: true },
      { name: 'Large Backpack Tag', dimension: '9 cm', price: 80 },
    ],
    colors: [
      { name: 'Matte Black', hex: '#0F172A', inStock: true, previewImg: '/products/batman-keychain.png' },
      { name: 'Batmobile Yellow', hex: '#EAB308', inStock: true, previewImg: '/products/batman-keychain-yellow.jpg' },
      { name: 'Dark Metallic Gunmetal', hex: '#475569', inStock: true, previewImg: '/products/batman-keychain.png' },
      { name: 'Gotham Silver', hex: '#94A3B8', inStock: true, previewImg: '/products/batman-keychain-yellow.jpg' },
    ],
  },
  {
    id: 'ganesha-model',
    title: 'Lord Ganesha Model',
    basePrice: 150,
    img: '/products/ganesha-model.png',
    images: ['/products/ganesha-model.png', '/products/ganesha statue.png'],
    badges: ['Devotional', 'Statue', 'PLA', 'Intricate'],
    desc: 'Auspicious Lord Ganesha idol with ornate jewelry and tranquil posture. Ideal for car dashboards, home altars, or gifting.',
    customizationType: 'standard',
    sizes: [
      { name: 'Car Dashboard Scale', dimension: '7 cm Height', price: 150, isDefault: true },
      { name: 'Home Altar Medium', dimension: '12 cm Height', price: 280 },
      { name: 'Temple Grand Scale', dimension: '18 cm Height', price: 490 },
    ],
    colors: [
      { name: 'Divine Silk Gold', hex: '#D4AF37', inStock: true, previewImg: '/products/ganesha-model.png' },
      { name: 'Sacred Marble White', hex: '#F8FAFC', inStock: true, previewImg: '/products/ganesha statue.png' },
      { name: 'Antique Bronze', hex: '#78350F', inStock: true, previewImg: '/products/ganesha-model.png' },
      { name: 'Copper Sheen', hex: '#B45309', inStock: true, previewImg: '/products/ganesha statue.png' },
    ],
  },
];

