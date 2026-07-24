export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string; // Category slug or ID
  price: number;
  discountPercentage: number;
  discountPrice: number;
  currency: string;
  rating: number;
  totalReviews: number;
  images: string[];
  ingredients: string[];
  preparationTime: string; // e.g. "15-20 min"
  isAvailable: boolean;
  isPopular: boolean;
  isFeatured: boolean;
  isRecommended: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  icon?: string;
  description?: string;
  itemCount?: number;
}

export interface Offer {
  id: string;
  title: string;
  code: string;
  description: string;
  discountPercentage: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  validUntil: string;
  bannerUrl: string;
  isAvailable: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  buttonText: string;
  isActive: boolean;
  position: number;
}

export interface VisitorLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
  canadaTime?: string;
  utcTime?: string;
}

export interface Visitor {
  visitorId: string;
  firstVisit: string;
  lastVisit: string;
  firstVisitCanadaTime?: string;
  lastVisitCanadaTime?: string;
  firstVisitUtcTime?: string;
  lastVisitUtcTime?: string;
  pageViews: number;
  location?: VisitorLocation;
  ip?: string;
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  language?: string;
  screenSize?: string;
  themePreference?: 'light' | 'dark' | 'system';
  recentProducts?: string[];
  favoriteCategories?: string[];
  skippedLocation?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  imageUrl?: string;
  isApproved: boolean;
  createdAt: string;
}

export interface RestaurantSettings {
  restaurantName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  openingHours: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  minOrderValue: number;
  currencySymbol: string;
  taxRate: number; // percentage
  deliveryAreas: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOptions?: string[];
  itemTotal: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  notes?: string;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  grandTotal: number;
  status: OrderStatus;
  whatsappSentAt: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'manager';
  lastLogin: string;
}
