export type Gender = "men" | "women" | "unisex";
export type PriceDisplayMode = "fixed" | "from" | "on_request";

export type Category = {
  id: string;
  name: string;
  slug: string;
  gender: "men" | "women";
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  gender: Gender | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  additional_info: string | null;
  price: number | null;
  price_display_mode: PriceDisplayMode;
  category_id: string | null;
  collection_id: string | null;
  gender: Gender;
  featured: boolean;
  published: boolean;
  sort_order: number;
  whatsapp_message: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductWithRelations = Product & {
  category: Category | null;
  collection: Collection | null;
  images: ProductImage[];
};

export type Testimonial = {
  id: string;
  customer_name: string;
  quote: string;
  image_url: string | null;
  role: string | null;
  location: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
};

export type GalleryImage = {
  id: string;
  url: string;
  alt: string;
  sort_order: number;
  published: boolean;
};

export type HeroImage = {
  id: string;
  url: string;
  alt: string;
  sort_order: number;
  published: boolean;
};

export type SiteSettings = {
  id: string;
  phone: string;
  whatsapp_number: string;
  email: string;
  instagram_fashion: string;
  instagram_woman: string;
  address: string;
  hero_headline: string;
  hero_subheadline: string;
  about_short: string;
  about_long: string;
  footer_tagline: string;
  updated_at: string;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number | null;
  priceDisplayMode: PriceDisplayMode;
  quantity: number;
  image: string | null;
};

export type CheckoutDetails = {
  name: string;
  phone: string;
  address: string;
  occasion: string;
  notes: string;
};

export type DashboardStats = {
  totalProducts: number;
  publishedProducts: number;
  draftProducts: number;
  collections: number;
  featuredProducts: number;
};
